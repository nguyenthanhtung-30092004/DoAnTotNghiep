const { OK } = require('../core/success.response');
const uploadService = require('../services/upload.service');

class UploadController {
  uploadSingleImage = async (req, res) => {
    new OK({
      message: "Upload ảnh thành công",
      metadata: await uploadService.uploadImage({
        file: req.file,
        folder: req.body.folder || "uploads",
      }),
    }).send(res);
  };
}

module.exports = new UploadController();
