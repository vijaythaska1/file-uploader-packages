const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const supportedTypes = {
  'image/jpeg': 'Image',
  'image/png': 'Image',
  'application/pdf': 'pdf',
  'application/msword': 'docs',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docs',
  'audio/mpeg': 'audio',
  'video/mp4': 'video'
};

const getFileType = (mimeType) => supportedTypes[mimeType] || null;

class FileUploadError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}


const uploadFile = async (req, res, options = {}) => {
  const {
    uploadBaseDir = process.env.BASE_URL || './public',
    maxFileSize = 5 * 1024 * 1024 // 5MB
  } = options;

  try {
        if (!req.files || !req.files.file) {
          throw new FileUploadError('No file uploaded', 'NO_FILE');
        }

    const files = Array.isArray(req.files.file) ? req.files.file : [req.files.file];

    const uploadResults = await Promise.all(files.map(async (file) => {
      if (file.size > maxFileSize) {
        throw new FileUploadError(`File size exceeds limit (${maxFileSize} bytes)`, 'FILE_TOO_LARGE');
      }

      const fileType = getFileType(file.mimetype);
      if (!fileType) {
        throw new FileUploadError('Invalid file type', 'INVALID_FILE_TYPE');
      }

      const uploadDir = path.join(uploadBaseDir, fileType);
      await fs.mkdir(uploadDir, { recursive: true });

      const fileNameUnic = `${uuidv4()}-${file.name}`;
      const filePath = path.join(uploadDir, fileNameUnic);

      await fs.writeFile(filePath, file.data);
      
      const returnPath = process.env.BASE_URL 
        ? new URL(path.join(fileType, fileNameUnic), process.env.UPLOAD_BASE_DIR).href
        : path.join(fileType, fileNameUnic);

      return returnPath;
    }));

    return {
      message: 'All files uploaded successfully',
      success: true,
      body: { uploadedFiles: uploadResults.length === 1 ? uploadResults[0] : uploadResults }
    };
  } catch (error) {
    console.error(error);
    if (error instanceof FileUploadError) {
      return {
        message: error.message,
        success: false,
        code: error.code
      };
    }
    throw new Error('Internal server error');
  }
};

module.exports = { uploadFile };
