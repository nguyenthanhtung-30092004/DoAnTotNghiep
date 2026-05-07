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

const { Created, OK } = require("../core/success.response");

class ProductController {
  async createProduct(req, res) {
    const uploadedImages = [];

    try {
      const { name, description, category, brand } = req.body;

      let { variants } = req.body;

      // ================= VALIDATE BASIC =================

      if (!name || !category || !brand) {
        throw new BadRequestError("Vui lòng điền đầy đủ thông tin bắt buộc");
      }

      // ================= PARSE VARIANTS =================

      if (typeof variants === "string") {
        try {
          variants = JSON.parse(variants);
        } catch (error) {
          throw new BadRequestError("Dữ liệu variants không hợp lệ");
        }
      }

      if (!Array.isArray(variants)) {
        throw new BadRequestError("Variants phải là mảng");
      }

      if (variants.length === 0) {
        throw new BadRequestError("Sản phẩm phải có ít nhất 1 variant");
      }

      // ================= CHECK CATEGORY =================

      const foundCategory = await categoryModel.findById(category);

      if (!foundCategory) {
        throw new NotFoundError("Danh mục không tồn tại");
      }

      // ================= CHECK BRAND =================

      const foundBrand = await brandModel.findById(brand);

      if (!foundBrand) {
        throw new NotFoundError("Thương hiệu không tồn tại");
      }

      // ================= CHECK PRODUCT NAME =================

      const existingProduct = await productModel.findOne({
        name: name.trim(),
        isDeleted: false,
      });

      if (existingProduct) {
        throw new ConflictRequestError("Tên sản phẩm đã tồn tại");
      }

      // ================= VALIDATE VARIANTS =================

      const variantKeys = new Set();

      for (const variant of variants) {
        // price
        if (variant.price === undefined || variant.price === null) {
          throw new BadRequestError("Variant phải có giá");
        }

        if (variant.price < 0) {
          throw new BadRequestError("Giá sản phẩm không hợp lệ");
        }

        // sale price
        if (
          variant.salePrice !== undefined &&
          variant.salePrice > variant.price
        ) {
          throw new BadRequestError("Giá khuyến mãi phải nhỏ hơn giá gốc");
        }

        // stock
        if (variant.stock !== undefined && variant.stock < 0) {
          throw new BadRequestError("Số lượng tồn kho không hợp lệ");
        }

        // duplicate variant
        const color = variant.color || "";
        const size = variant.size || "";

        const variantKey = `${color}-${size}`;

        if (variantKeys.has(variantKey)) {
          throw new ConflictRequestError("Variant bị trùng màu và kích thước");
        }

        variantKeys.add(variantKey);

        // check sku
        if (variant.sku) {
          const existingSku = await productModel.findOne({
            "variants.sku": variant.sku,
          });

          if (existingSku) {
            throw new ConflictRequestError(`SKU ${variant.sku} đã tồn tại`);
          }
        }

        // init images
        variant.images = [];
      }

      // ================= VALIDATE FILE FIELD =================

      for (const file of req.files || []) {
        const isThumbnail = file.fieldname === "thumbnail";

        const isVariantImage = /^variantImages-\d+$/.test(file.fieldname);

        if (!isThumbnail && !isVariantImage) {
          throw new BadRequestError(
            `Field upload không hợp lệ: ${file.fieldname}`,
          );
        }
      }

      // ================= UPLOAD THUMBNAIL =================

      let thumbnail = null;

      const thumbnailFile = req.files?.find(
        (file) => file.fieldname === "thumbnail",
      );

      if (thumbnailFile) {
        const uploadedThumbnail = await cloudinary.uploader.upload(
          thumbnailFile.path,
          {
            folder: "products/thumbnail",
            public_id: `thumbnail-${Date.now()}`,
          },
        );

        uploadedImages.push(uploadedThumbnail.public_id);

        thumbnail = {
          url: uploadedThumbnail.secure_url,
          publicId: uploadedThumbnail.public_id,
        };
      }

      // ================= UPLOAD VARIANT IMAGES =================

      if (req.files?.length > 0) {
        for (const file of req.files) {
          const match = file.fieldname.match(/variantImages-(\d+)/);

          if (!match) continue;

          const variantIndex = Number(match[1]);

          if (!variants[variantIndex]) {
            continue;
          }

          const uploadedImage = await cloudinary.uploader.upload(file.path, {
            folder: "products/variants",
            public_id: `variant-${Date.now()}`,
          });

          uploadedImages.push(uploadedImage.public_id);

          variants[variantIndex].images.push({
            url: uploadedImage.secure_url,
            publicId: uploadedImage.public_id,
          });
        }
      }

      // ================= CREATE PRODUCT =================

      const newProduct = await productModel.create({
        name: name.trim(),
        description,
        category,
        brand,
        thumbnail,
        variants,
      });

      // ================= RESPONSE =================

      return new Created({
        message: "Tạo sản phẩm thành công",
        metadata: newProduct,
      }).send(res);
    } catch (error) {
      console.log("CREATE PRODUCT ERROR ====>");
      console.log(error);
      console.log(error.stack);

      if (uploadedImages.length > 0) {
        await Promise.all(
          uploadedImages.map((publicId) =>
            cloudinary.uploader.destroy(publicId).catch(() => {}),
          ),
        );
      }

      throw error;
    } finally {
      if (req.files?.length > 0) {
        await Promise.all(
          req.files.map((file) => fs.unlink(file.path).catch(() => {})),
        );
      }
    }
  }
  async getAllProducts(req, res) {
    try {
      let {
        page = 1,
        limit = 10,
        search = "",
        category,
        brand,
        isPublished,
        sort = "newest",
      } = req.query;

      page = Number(page);
      limit = Number(limit);

      if (page < 1 || limit < 1) {
        throw new BadRequestError("Page hoặc limit không hợp lệ");
      }

      const skip = (page - 1) * limit;

      const filter = {
        isDeleted: false,
      };
      if (search) {
        filter.$text = {
          $search: search,
        };
      }
      if (category) {
        filter.category = category;
      }
      if (brand) {
        filter.brand = brand;
      }
      if (isPublished !== undefined) {
        filter.isPublished = isPublished === "true";
      }

      let sortOption = {
        createdAt: -1,
      };

      switch (sort) {
        case "oldest":
          sortOption = {
            createdAt: 1,
          };
          break;

        case "name_asc":
          sortOption = {
            name: 1,
          };
          break;

        case "name_desc":
          sortOption = {
            name: -1,
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
          .populate("category", "nameCategory")
          .populate("brand", "nameBrand")
          .sort(sortOption)
          .skip(skip)
          .limit(limit)
          .lean(),

        productModel.countDocuments(filter),
      ]);

      return new OK({
        message: "Lấy danh sách sản phẩm thành công",

        metadata: {
          products,

          pagination: {
            currentPage: page,
            totalPage: Math.ceil(total / limit),
            totalProduct: total,
            limit,
          },
        },
      }).send(res);
    } catch (error) {
      throw error;
    }
  }
  async getDetailProduct(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError("Thiếu id sản phẩm");
      }
      const product = await productModel;
    } catch (error) {}
  }
}

module.exports = new ProductController();
