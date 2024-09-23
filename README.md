# file-uploader

A robust Node.js package for handling file uploads with support for various file types, designed to integrate seamlessly with Express.js applications.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Requirements](#requirements)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Supported File Types](#supported-file-types)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## Features

- 📁 Supports multiple file types: JPEG, PNG, PDF, DOC, DOCX, MP3, and MP4
- 🆔 Generates unique filenames using UUID
- 🗂️ Organizes uploaded files into type-specific directories
- 🔢 Handles single and multiple file uploads
- ⚠️ Built-in error handling and validation
- 🔒 File size limit enforcement
- 🛠️ Customizable upload directory

## Installation

```bash
npm install file-uploader
```

## Requirements

- Node.js >= 12.0.0
- Express.js >= 4.17.1
- express-fileupload >= 1.2.1

## Usage

### Uploading Files

When sending a file upload request to your server, include the file in the request body with the key `'file'`. This key is currently hardcoded in the implementation.

For example, if you're using a form:

```html
<form action="/upload" method="post" enctype="multipart/form-data">
  <input type="file" name="file">
  <input type="submit" value="Upload">
</form>
```

When using JavaScript to send the request:

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('/upload', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(result => {
  console.log('Success:', result);
})
.catch(error => {
  console.error('Error:', error);
});
```

### CommonJS

```javascript
const express = require('express');
const fileUpload = require('express-fileupload');
const { uploadFile } = require('file-uploader');

const app = express();

app.use(fileUpload());

app.post('/upload', async (req, res) => {
  try {
    const result = await uploadFile(req, res);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

### ES6 Module

```javascript
import express from 'express';
import fileUpload from 'express-fileupload';
import { uploadFile } from 'file-uploader';

const app = express();

app.use(fileUpload());

app.post('/upload', async (req, res) => {
  try {
    const result = await uploadFile(req, res);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

## Configuration

You can configure the file upload behavior using environment variables or by passing options to the `uploadFile` function:

- `BASE_URL`: Set the base URL for the uploaded files. If not set, it defaults to the relative path.
- `UPLOAD_BASE_DIR`: Set the base upload directory. If not set, it defaults to `'./public'`.

Example using environment variables:

```bash
BASE_URL=https://example.com/uploads
UPLOAD_BASE_DIR=/path/to/uploads
```

Example passing options to `uploadFile`:

```javascript
const result = await uploadFile(req, res, {
  uploadBaseDir: '/custom/upload/path',
  maxFileSize: 10 * 1024 * 1024 // 10MB
});
```

## API Reference

### `uploadFile(req, res, options)`

Handles file upload(s) from a multipart form data request.

#### Parameters

- `req` (Object): Express request object
- `res` (Object): Express response object
- `options` (Object, optional):
  - `uploadBaseDir` (String): Base directory for uploads (default: `process.env.UPLOAD_BASE_DIR || './public'`)
  - `maxFileSize` (Number): Maximum file size in bytes (default: 5MB)

#### Returns

Promise that resolves to an object with the following structure:

```javascript
{
  message: String,
  success: Boolean,
  body: {
    uploadedFiles: String | Array
  }
}
```

For single file uploads, `uploadedFiles` will be a string. For multiple file uploads, it will be an array of strings.

## Supported File Types

- Images: JPEG, PNG
- Documents: PDF, DOC, DOCX
- Audio: MP3
- Video: MP4

## Error Handling

The package includes built-in error handling for common issues:

- `NO_FILE`: No file was uploaded
- `FILE_TOO_LARGE`: File size exceeds the specified limit
- `INVALID_FILE_TYPE`: Uploaded file type is not supported

If an error occurs, the function will return an object with `success: false` and details about the error.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/vijaythaska1/file-upload/issues) if you want to contribute.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

Vijay Sharma

- GitHub: [@vijaythaska1](https://github.com/vijaythaska1)
- npm: [file-uploader](https://www.npmjs.com/package/file-upload-api)

---

For any questions or support, please open an issue in the [GitHub repository](https://github.com/vijaythaska1/file-upload-api).