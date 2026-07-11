const {
  BadRequestError,
  NotFoundError,
  ConflictRequestError,
} = require('../core/error.response');

const brandModel = require('../models/brand.model');
const categoryModel = require('../models/category.model');
const productModel = require('../models/product.model');
const mongoose = require("mongoose");

const cloudinary = require('../config/cloudDinary');

const fs = require("fs/promises");

const { validateVariants } = require('../helpers/product.helper');

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
      const variantImageFiles = (files || [])
        .map((file) => {
          const match = file.fieldname.match(/variantImages-(\d+)/);

          if (!match) return null;

          const variantIndex = Number(match[1]);

          if (!variants[variantIndex]) return null;

          return {
            file,
            variantIndex,
          };
        })
        .filter(Boolean);

      const uploadedVariantImages = await Promise.all(
        variantImageFiles.map(async ({ file, variantIndex }) => {
          const uploadedImage = await cloudinary.uploader.upload(file.path, {
            folder: "products/variants",
          });

          return {
            variantIndex,
            publicId: uploadedImage.public_id,
            url: uploadedImage.secure_url,
          };
        }),
      );

      uploadedVariantImages.forEach((image) => {
        uploadedImages.push(image.publicId);

        if (!variants[image.variantIndex].images) {
          variants[image.variantIndex].images = [];
        }

        variants[image.variantIndex].images.push({
          url: image.url,
          publicId: image.publicId,
        });
      });

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

  async getAllProducts({ query = {}, params = {} }) {
    let {
      page = 1,
      limit = 10,
      search = "",
      category,
      brand,
      isPublished,
      minPrice,
      maxPrice,
      sort = "newest",
    } = query;

    const { categoryId, brandId } = params;

    // Params ưu tiên hơn query
    category = categoryId || category;
    brand = brandId || brand;

    page = Number(page);
    limit = Number(limit);

    if (!Number.isInteger(page) || page < 1) {
      throw new BadRequestError("Page không hợp lệ");
    }

    if (!Number.isInteger(limit) || limit < 1) {
      throw new BadRequestError("Limit không hợp lệ");
    }

    const skip = (page - 1) * limit;

    const filter = {
      isDeleted: false,
    };

    if (search) {
      filter.name = {
        $regex: String(search).trim(),
        $options: "i",
      };
    }

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        throw new BadRequestError("Danh mục không hợp lệ");
      }

      // Lấy luôn tất cả category con để hiện sản phẩm của cả cây
      const childCategories = await categoryModel
        .find({ parentId: category })
        .select("_id")
        .lean();

      const categoryIds = [
        new mongoose.Types.ObjectId(category),
        ...childCategories.map((c) => c._id),
      ];

      filter.category = { $in: categoryIds };
    }

    if (brand) {
      if (!mongoose.Types.ObjectId.isValid(brand)) {
        throw new BadRequestError("Thương hiệu không hợp lệ");
      }

      filter.brand = brand;
    }

    if (isPublished !== undefined) {
      filter.isPublished = isPublished === "true" || isPublished === true;
    }

    if (minPrice || maxPrice) {
      filter.minPrice = {};

      if (minPrice) {
        const min = Number(minPrice);

        if (Number.isNaN(min) || min < 0) {
          throw new BadRequestError("Giá nhỏ nhất không hợp lệ");
        }

        filter.minPrice.$gte = min;
      }

      if (maxPrice) {
        const max = Number(maxPrice);

        if (Number.isNaN(max) || max < 0) {
          throw new BadRequestError("Giá lớn nhất không hợp lệ");
        }

        filter.minPrice.$lte = max;
      }
    }

    let sortOption = {
      createdAt: -1,
    };

    switch (sort) {
      case "price_asc":
        sortOption = { minPrice: 1 };
        break;

      case "price_desc":
        sortOption = { minPrice: -1 };
        break;

      case "name_asc":
        sortOption = { name: 1 };
        break;

      case "name_desc":
        sortOption = { name: -1 };
        break;

      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      case "stock_desc":
        sortOption = { totalStock: -1 };
        break;

      case "best_selling":
        sortOption = { sold: -1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    const [products, total] = await Promise.all([
      productModel
        .find(filter)
        .populate("category", "name slug")
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

      const variantImageFiles = (files || [])
        .map((file) => {
          const match = file.fieldname.match(/variantImages-(\d+)/);

          if (!match) return null;

          const variantIndex = Number(match[1]);

          if (!product.variants[variantIndex]) return null;

          return {
            file,
            variantIndex,
          };
        })
        .filter(Boolean);

      const uploadedVariantImages = await Promise.all(
        variantImageFiles.map(async ({ file, variantIndex }) => {
          const uploadedImage = await cloudinary.uploader.upload(file.path, {
            folder: "products/variants",
          });

          return {
            variantIndex,
            publicId: uploadedImage.public_id,
            url: uploadedImage.secure_url,
          };
        }),
      );

      uploadedVariantImages.forEach((image) => {
        uploadedImages.push(image.publicId);

        if (!product.variants[image.variantIndex].images) {
          product.variants[image.variantIndex].images = [];
        }

        product.variants[image.variantIndex].images.push({
          url: image.url,
          publicId: image.publicId,
        });
      });

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
