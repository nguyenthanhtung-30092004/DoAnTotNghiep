const {
  BadRequestError,
  NotFoundError,
  ConflictRequestError,
} = require("../core/error.response");
const brandModel = require("../models/brand.model");
const categoryModel = require("../models/category.model");
const productModel = require("../models/product.model");
const cloudinary = require("../configs/cloudDinary");
const fs = require("fs/promises");
const { validateVariants } = require("../helpers/product.helper");

class ProductService {
  async createProduct({ body, files }) {
    const uploadedImages = [];
    try {
      const { name, description, category, brand } = body;
      let { variants } = body;

      if (!name || !category || !brand) {
        throw new BadRequestError("Vui lòng điền đầy đủ thông tin bắt buộc");
      }

      if (typeof variants === "string") {
        try {
          variants = JSON.parse(variants);
        } catch (error) {
          throw new BadRequestError("Dữ liệu variants không hợp lệ");
        }
      }

      await validateVariants(variants);

      const [foundCategory, foundBrand, existingProduct] = await Promise.all([
        categoryModel.findById(category).lean(),
        brandModel.findById(brand).lean(),
        productModel.findOne({ name: name.trim(), isDeleted: false }).lean(),
      ]);

      if (!foundCategory) throw new NotFoundError("Danh mục không tồn tại");
      if (!foundBrand) throw new NotFoundError("Thương hiệu không tồn tại");
      if (existingProduct) throw new ConflictRequestError("Tên sản phẩm đã tồn tại");

      for (const file of files || []) {
        const isThumbnail = file.fieldname === "thumbnail";
        const isVariantImage = /^variantImages-\d+$/.test(file.fieldname);

        if (!isThumbnail && !isVariantImage) {
          throw new BadRequestError(`Field upload không hợp lệ: ${file.fieldname}`);
        }
      }

      let thumbnail = null;
      const uploadPromises = [];

      const thumbnailFile = files?.find((file) => file.fieldname === "thumbnail");
      if (thumbnailFile) {
        const thumbnailTask = cloudinary.uploader
          .upload(thumbnailFile.path, {
            folder: "products/thumbnail",
            public_id: `thumbnail-${Date.now()}`,
          })
          .then((res) => {
            uploadedImages.push(res.public_id);
            thumbnail = { url: res.secure_url, publicId: res.public_id };
          });
        uploadPromises.push(thumbnailTask);
      }

      if (files?.length > 0) {
        for (const file of files) {
          const match = file.fieldname.match(/variantImages-(\d+)/);
          if (!match) continue;

          const variantIndex = Number(match[1]);
          if (!variants[variantIndex]) continue;

          const variantImgTask = cloudinary.uploader
            .upload(file.path, {
              folder: "products/variants",
              public_id: `variant-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            })
            .then((res) => {
              uploadedImages.push(res.public_id);
              if (!variants[variantIndex].images) variants[variantIndex].images = [];
              variants[variantIndex].images.push({
                url: res.secure_url,
                publicId: res.public_id,
              });
            });
          uploadPromises.push(variantImgTask);
        }
      }

      await Promise.all(uploadPromises);

      const newProduct = await productModel.create({
        name: name.trim(),
        description,
        category,
        brand,
        thumbnail,
        variants,
      });

      return newProduct;
    } catch (error) {
      if (uploadedImages.length > 0) {
        await Promise.all(
          uploadedImages.map((publicId) =>
            cloudinary.uploader.destroy(publicId).catch(() => { }),
          ),
        );
      }
      throw error;
    } finally {
      if (files?.length > 0) {
        await Promise.all(
          files.map((file) => fs.unlink(file.path).catch(() => { })),
        );
      }
    }
  }

  async getAllProducts(query) {
    let {
      page = 1,
      limit = 10,
      search = "",
      category,
      brand,
      isPublished,
      sort = "newest",
    } = query;

    page = Number(page);
    limit = Number(limit);

    if (page < 1 || limit < 1) {
      throw new BadRequestError("Page hoặc limit không hợp lệ");
    }

    const skip = (page - 1) * limit;

    const filter = { isDeleted: false };
    if (search) {
      filter.$text = { $search: search };
    }
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (isPublished !== undefined) filter.isPublished = isPublished === "true";

    let sortOption = { createdAt: -1 };
    switch (sort) {
      case "oldest": sortOption = { createdAt: 1 }; break;
      case "name_asc": sortOption = { name: 1 }; break;
      case "name_desc": sortOption = { name: -1 }; break;
      default: sortOption = { createdAt: -1 };
    }

    const [products, total] = await Promise.all([
      productModel
        .find(filter)
        .populate("category", "nameCategory")
        .populate("brand", "nameBrand")
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      productModel.countDocuments(filter),
    ]);

    return {
      products,
      pagination: {
        currentPage: page,
        totalPage: Math.ceil(total / limit),
        totalProduct: total,
        limit,
      },
    };
  }

  async getDetailProduct(id) {
    if (!id) throw new BadRequestError("Thiếu id sản phẩm");
    
    const product = await productModel
      .findOne({ _id: id, isDeleted: false })
      .populate("category", "nameCategory")
      .populate("brand", "nameBrand");

    if (!product) throw new NotFoundError("Sản phẩm không tồn tại hoặc đã bị xóa");
    
    return product;
  }

  async updateProduct({ id, body, files }) {
    const uploadedImages = [];
    try {
      const { name, description, category, brand, isPublished } = body;
      let { variants } = body;

      const currentProduct = await productModel.findById(id);
      if (!currentProduct || currentProduct.isDeleted) {
        throw new NotFoundError("Sản phẩm không tồn tại");
      }

      if (variants) {
        if (typeof variants === "string") {
          try {
            variants = JSON.parse(variants);
          } catch (e) {
            throw new BadRequestError("Dữ liệu variants không hợp lệ");
          }
        }
        await validateVariants(variants, id);
      }

      let updateData = {
        name: name?.trim(),
        description,
        category,
        brand,
        isPublished,
      };
      
      if (variants) {
        updateData.variants = variants;
      }

      const thumbnailFile = files?.find((f) => f.fieldname === "thumbnail");
      if (thumbnailFile) {
        if (currentProduct.thumbnail?.publicId) {
          await cloudinary.uploader
            .destroy(currentProduct.thumbnail.publicId)
            .catch(() => { });
        }

        const upThum = await cloudinary.uploader.upload(thumbnailFile.path, {
          folder: "products/thumbnail",
        });
        uploadedImages.push(upThum.public_id);
        updateData.thumbnail = {
          url: upThum.secure_url,
          publicId: upThum.public_id,
        };
      }

      if (files?.length > 0 && updateData.variants) {
        for (const file of files) {
          const match = file.fieldname.match(/variantImages-(\d+)/);
          if (!match) continue;
          const idx = Number(match[1]);
          if (updateData.variants[idx]) {
            const upImg = await cloudinary.uploader.upload(file.path, {
              folder: "products/variants",
            });
            uploadedImages.push(upImg.public_id);
            if (!updateData.variants[idx].images) updateData.variants[idx].images = [];
            updateData.variants[idx].images.push({
              url: upImg.secure_url,
              publicId: upImg.public_id,
            });
          }
        }
      }

      const updatedProduct = await productModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true },
      );

      return updatedProduct;
    } catch (error) {
      if (uploadedImages.length > 0) {
        await Promise.all(
          uploadedImages.map((pubId) =>
            cloudinary.uploader.destroy(pubId).catch(() => { }),
          ),
        );
      }
      throw error;
    } finally {
      if (files?.length > 0) {
        await Promise.all(
          files.map((file) => fs.unlink(file.path).catch(() => { })),
        );
      }
    }
  }

  async deleteProduct(id) {
    const deletedProduct = await productModel.findByIdAndUpdate(
      id,
      { isDeleted: true, isPublished: false },
      { new: true },
    );

    if (!deletedProduct) throw new NotFoundError("Sản phẩm không tồn tại");

    return { id };
  }
}

module.exports = new ProductService();
