const fs = require("fs");
const path = require("path");

async function getFilePaths(directoryPath) {
  try {
    const fileNames = await fs.promises.readdir(directoryPath);
    const filePaths = fileNames.map((fileName) =>
      path.join(directoryPath, fileName)
    );
    return filePaths;
  } catch (err) {
    throw new Error(`Unable to scan directory: ${err.message}`);
  }
}

async function uploadFile(filePath, name, type = "image/jpeg") {
  const size = fs.statSync(filePath);
  const uploadedFile = await strapi
    .plugin("upload")
    .service("upload")
    .upload({
      data: {
        fileInfo: {
          name,
          type,
        },
      },
      files: {
        path: filePath,
        name,
        type,
        size,
      },
    });

  return uploadedFile[0].id;
}

module.exports = {
  getFilePaths,
  uploadFile,
};
