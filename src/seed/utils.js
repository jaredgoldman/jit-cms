const fs = require("fs");
const path = require("path");

/**
 * Asynchronously retrieves all file paths in a given directory.
 * @param {string} directoryPath - The path to the directory.
 * @returns {Promise<string[]>} A promise that resolves to an array of file paths.
 */
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

/**
 * Asynchronously uploads a file.
 * @param {string} filePath - The path of the file to upload.
 * @param {string} name - The name of the file.
 * @param {string} [type="image/jpeg"] - The MIME type of the file.
 * @returns {Promise<number>} A promise that resolves to the ID of the uploaded file.
 */
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

/**
 * Formats a Date object into a string with the format "HH:mm:ss.SSS".
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
function formatDateToHHmmssSSS(date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const milliseconds = date.getMilliseconds().toString().padStart(3, "0");

  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

/**
 * Seeds data if it doesn't already exist.
 * @param {object} strapi - The Strapi instance.
 * @param {string} namespace - The namespace for the data.
 * @param {object} data - The data to seed.
 * @returns {Promise<object|null>} A promise that resolves to the created data, or null if data already exists.
 */
async function maybeSeedData(strapi, namespace, data) {
  const { data: maybeData } = await strapi.entityService.findMany(namespace);
  if (maybeData) return;
  else return await strapi.entityService.create(namespace, { data });
}

/**
 * Checks if data for all content types has been loaded.
 * @param {object} strapi - The Strapi instance.
 * @param {string[]} contentTypes - The content types to check.
 * @returns {Promise<boolean>} A promise that resolves to true if all data is loaded, false otherwise.
 */
async function checkDataLoaded(strapi, contentTypes) {
  let dataLoaded = false;

  for (const type of contentTypes) {
    const data = await strapi.entityService.findMany(typeToNamespace(type));
    if (data) {
      dataLoaded = true;
    }
  }
  return dataLoaded;
}

/**
 * Converts a content type to its corresponding namespace.
 * @param {string} type - The content type.
 * @returns {string} The namespace.
 */
function typeToNamespace(type) {
  return `api::${type}.${type}`;
}

module.exports = {
  getFilePaths,
  uploadFile,
  formatDateToHHmmssSSS,
  maybeSeedData,
  checkDataLoaded,
  typeToNamespace,
};
