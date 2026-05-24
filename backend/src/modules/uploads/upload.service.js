const cloudinary = require("../../configs/cloudDinary");
const fs = require("fs/promises");

class UploadService {
  async uploadImage({ file, folder = "uploads" }) {
    const uploaded = await cloudinary.uploader.upload(file.path, { folder });

    await fs.unlink(file.path).catch(() => {});

    return {
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
    };
  }
}

module.exports = new UploadService();
