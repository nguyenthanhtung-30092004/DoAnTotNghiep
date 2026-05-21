const {
  BadRequestError,
  NotFoundError,
  ConflictRequestError,
} = require("../core/error.response");

const brandModel = require("../models/brand.model");
const categoryModel = require("../models/category.model");
const productModel = require("../models/product.model");
const mongoose = require("mongoose");

const cloudinary = require("../configs/cloudDinary");

const fs = require("fs/promises");

const { validateVariants } = require("../helpers/product.helper");

class ProductService {
  async createProduct({ body, files }) {
    const uploadedImages = [];

    try {
      let { name, description, category, brand, variants = [] } = body;

      if (!name || !category || !brand) {
        throw new BadRequestError("Thiếu thông tin bắt buộc");
      }

      name = name.trim();

      if (typeof variants === "string") {
        try {
          variants = JSON.parse(variants);
        } catch (error) {
          throw new BadRequestError("Variants không hợp lệ");
        }
      }

      if (!Array.isArray(variants)) {
        throw new BadRequestError("Variants phải là array");
      }

      await validateVariants(variants);

      const [foundCategory, foundBrand, existingProduct] = await Promise.all([
        categoryModel.findById(category).lean(),
        brandModel.findById(brand).lean(),

        productModel.findOne({
          name,
          isDeleted: false,
        }),
      ]);

      if (!foundCategory) {
        throw new NotFoundError("Danh mục không tồn tại");
      }

      if (!foundBrand) {
        throw new NotFoundError("Thương hiệu không tồn tại");
      }

      if (existingProduct) {
        throw new ConflictRequestError("Tên sản phẩm đã tồn tại");
      }

      for (const file of files || []) {
        const isThumbnail = file.fieldname === "thumbnail";

        const isVariantImage = /^variantImages-\d+$/.test(file.fieldname);

        if (!isThumbnail && !isVariantImage) {
          throw new BadRequestError(
            `Field upload không hợp lệ: ${file.fieldname}`,
          );
        }
      }

      let thumbnail = null;

      const thumbnailFile = files?.find(
        (file) => file.fieldname === "thumbnail",
      );

      if (thumbnailFile) {
        const uploadThumbnail = await cloudinary.uploader.upload(
          thumbnailFile.path,
          {
            folder: "products/thumbnail",
          },
        );

        uploadedImages.push(uploadThumbnail.public_id);

        thumbnail = {
          url: uploadThumbnail.secure_url,
          publicId: uploadThumbnail.public_id,
        };
      }

      for (const file of files || []) {
        const match = file.fieldname.match(/variantImages-(\d+)/);

        if (!match) continue;

        const variantIndex = Number(match[1]);

        if (!variants[variantIndex]) continue;

        const uploadImage = await cloudinary.uploader.upload(file.path, {
          folder: "products/variants",
        });

        uploadedImages.push(uploadImage.public_id);

        if (!variants[variantIndex].images) {
          variants[variantIndex].images = [];
        }

        variants[variantIndex].images.push({
          url: uploadImage.secure_url,
          publicId: uploadImage.public_id,
        });
      }

      const product = await productModel.create({
        name,
        description,
        category,
        brand,
        thumbnail,
        variants,
      });

      return product;
    } catch (error) {
      if (uploadedImages.length > 0) {
        await Promise.all(
          uploadedImages.map((publicId) =>
            cloudinary.uploader.destroy(publicId).catch(() => {}),
          ),
        );
      }

      throw error;
    } finally {
      if (files?.length > 0) {
        await Promise.all(
          files.map((file) => fs.unlink(file.path).catch(() => {})),
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

      // lọc theo giá
      minPrice,
      maxPrice,

      // sắp xếp
      sort = "newest",
    } = query;

    page = Number(page);
    limit = Number(limit);

    if (page < 1 || limit < 1) {
      throw new BadRequestError("Page hoặc limit không hợp lệ");
    }

    const skip = (page - 1) * limit;

    // filter cơ bản
    const filter = {
      isDeleted: false,
    };

    // tìm kiếm theo tên / mô tả đã tạo text index
    if (search) {
      filter.$text = {
        $search: search,
      };
    }

    // lọc theo danh mục
    if (category) {
      filter.category = category;
    }

    // lọc theo thương hiệu
    if (brand) {
      filter.brand = brand;
    }

    // lọc theo trạng thái hiển thị
    if (isPublished !== undefined) {
      filter.isPublished = isPublished === "true";
    }

    // lọc theo khoảng giá
    if (minPrice || maxPrice) {
      filter.minPrice = {};

      if (minPrice) {
        filter.minPrice.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.maxPrice.$gte = Number(maxPrice);
      }
    }

    // Mặc định: mới nhất
    let sortOption = {
      createdAt: -1,
    };

    switch (sort) {
      case "price_asc":
        // giá tăng dần
        sortOption = {
          minPrice: 1,
        };
        break;

      case "price_desc":
        sortOption = {
          minPrice: -1,
        };
        break;

      case "name_asc":
        // Tên A - Z
        sortOption = {
          name: 1,
        };
        break;

      case "name_desc":
        // Tên Z - A
        sortOption = {
          name: -1,
        };
        break;

      case "oldest":
        // Cũ nhất
        sortOption = {
          createdAt: 1,
        };
        break;

      case "best_selling":
        // Bán chạy nhất
        sortOption = {
          createdAt: -1,
        };
        break;

      case "stock_desc":
        // Tồn khi giảm dần
        sortOption = {
          totalStock: -1,
        };
        break;

      default:
        sortOption = {
          createdAt: -1,
        };
    }

    const [products, total] = await Promise.all([
      productModel
        .find(filter)
        .populate("category", "name")
        .populate("brand", "nameBrand")
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .select("-variants.sizes.sold")
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

  async getDetailProduct(idOrSlug) {
    const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
    const filter = {
      isDeleted: false,
      ...(isObjectId
        ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug }] }
        : { slug: idOrSlug }),
    };

    const product = await productModel
      .findOne(filter)
      .populate("category", "name")
      .populate("brand", "nameBrand");

    if (!product) {
      throw new NotFoundError("Sản phẩm không tồn tại");
    }

    return product;
  }

  async updateProduct({ id, body, files }) {
    const uploadedImages = [];

    try {
      let { name, description, category, brand, variants, isPublished } = body;

      const product = await productModel.findById(id);

      if (!product || product.isDeleted) {
        throw new NotFoundError("Sản phẩm không tồn tại");
      }

      if (variants) {
        if (typeof variants === "string") {
          try {
            variants = JSON.parse(variants);
          } catch (error) {
            throw new BadRequestError("Variants không hợp lệ");
          }
        }

        await validateVariants(variants, id);
      }

      const [foundCategory, foundBrand] = await Promise.all([
        category ? categoryModel.findById(category) : true,

        brand ? brandModel.findById(brand) : true,
      ]);

      if (!foundCategory) {
        throw new NotFoundError("Danh mục không tồn tại");
      }

      if (!foundBrand) {
        throw new NotFoundError("Thương hiệu không tồn tại");
      }

      if (name && name.trim() !== product.name) {
        const existing = await productModel.findOne({
          name: name.trim(),
          _id: { $ne: id },
          isDeleted: false,
        });

        if (existing) {
          throw new ConflictRequestError("Tên sản phẩm đã tồn tại");
        }

        product.name = name.trim();
      }

      if (description !== undefined) {
        product.description = description;
      }

      if (category) {
        product.category = category;
      }

      if (brand) {
        product.brand = brand;
      }

      if (isPublished !== undefined) {
        product.isPublished = isPublished;
      }

      const thumbnailFile = files?.find((f) => f.fieldname === "thumbnail");

      if (thumbnailFile) {
        const uploadedThumbnail = await cloudinary.uploader.upload(
          thumbnailFile.path,
          {
            folder: "products/thumbnail",
          },
        );

        uploadedImages.push(uploadedThumbnail.public_id);

        if (product.thumbnail?.publicId) {
          await cloudinary.uploader
            .destroy(product.thumbnail.publicId)
            .catch(() => {});
        }

        product.thumbnail = {
          url: uploadedThumbnail.secure_url,
          publicId: uploadedThumbnail.public_id,
        };
      }

      if (variants) {
        product.variants = variants;
      }

      for (const file of files || []) {
        const match = file.fieldname.match(/variantImages-(\d+)/);

        if (!match) continue;

        const variantIndex = Number(match[1]);

        if (!product.variants[variantIndex]) {
          continue;
        }

        const uploadedImage = await cloudinary.uploader.upload(file.path, {
          folder: "products/variants",
        });

        uploadedImages.push(uploadedImage.public_id);

        product.variants[variantIndex].images.push({
          url: uploadedImage.secure_url,
          publicId: uploadedImage.public_id,
        });
      }

      await product.save();

      return product;
    } catch (error) {
      if (uploadedImages.length > 0) {
        await Promise.all(
          uploadedImages.map((id) =>
            cloudinary.uploader.destroy(id).catch(() => {}),
          ),
        );
      }

      throw error;
    } finally {
      if (files?.length > 0) {
        await Promise.all(
          files.map((file) => fs.unlink(file.path).catch(() => {})),
        );
      }
    }
  }

  async deleteProduct(id) {
    const product = await productModel.findById(id);

    if (!product) {
      throw new NotFoundError("Sản phẩm không tồn tại");
    }

    product.isDeleted = true;
    product.isPublished = false;

    await product.save();

    return {
      id,
    };
  }
}

module.exports = new ProductService();
