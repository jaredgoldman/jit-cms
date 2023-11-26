const path = require("path");
const {
  uploadFile,
  getFilePaths,
  checkDataLoaded,
  typeToNamespace,
} = require("./utils");
const { makeGigs } = require("./data");

const contentTypes = ["about", "listing", "staff-member"];
const pluginNamespace = "plugin::upload.file";
const assetsPath = path.join(process.cwd(), "public", "assets");

/**
 * Prepares the database by clearing existing data.
 * @param {object} strapi - The Strapi instance.
 */
async function clearDb(strapi) {
  const files = await strapi.entityService.findMany(pluginNamespace, {});
  for (const file of files) {
    await strapi.entityService.delete(pluginNamespace, file.id);
  }
  for (const contentType of contentTypes) {
    await strapi.entityService.deleteMany(typeToNamespace(contentType));
  }
}

/**
 * Adds staff members to the database.
 * @param {object} strapi - The Strapi instance.
 * @returns {Promise<object[]>} A promise that resolves to an array of added staff members.
 */
async function addStaff(strapi) {
  const addedMembers = [];
  const staffMembers = [
    { name: "Lina Welch", position: "Founder, Managing Director" },
    { name: "Ori Dagan", position: "Artistic Director" },
    { name: "Mark Lemieux", position: "Communications" },
    { name: "Jared Goldman", position: "Web developer" },
  ];

  for (const item of staffMembers) {
    addedMembers.push(
      await strapi.entityService.create(typeToNamespace("staff-member"), {
        data: item,
      })
    );
  }

  return addedMembers;
}

/**
 * Adds photos from the public/assets folder.
 * @returns {Promise<object>} A promise that resolves to an object mapping file names to their IDs.
 */
async function addPhotos() {
  const addedPhotos = {};
  const filePaths = await getFilePaths(assetsPath);
  for (const filePath of filePaths) {
    const pathParams = filePath.split("/");
    const fileName = pathParams[pathParams.length - 1].replace(".jpeg", "");
    const uploadedFileId = await uploadFile(filePath, fileName);
    addedPhotos[fileName] = uploadedFileId;
  }
  return addedPhotos;
}

/**
 * Adds about page content.
 * @param {object} strapi - The Strapi instance.
 * @param {object} addedPhotos - Object mapping photo names to IDs.
 * @param {object[]} addedMembers - Array of added staff member objects.
 */
async function addAboutContent(strapi, addedPhotos, addedMembers) {
  await strapi.entityService.create(typeToNamespace("about"), {
    data: {
      heading: "ABOUT US",
      description:
        "JazzInToronto is a platform which promotes local jazz artists in the Greater Toronto Area, connecting audiences, musicians, venues and presenters. We offer a platform which bundles all jazz-related information and showcases a complete range of artists from new talents to established jazz musicians to increase the discoverability and access to the works of Canadian musicians.",
      staffMembers: addedMembers.map((member) => member.id),
      teamHeading: "Our Team",
      supportHeading: "Support us",
      supportDescription:
        "JazzInToronto Inc. is a volunteer-fueled community hub connecting Toronto’s jazz audiences, musicians, venues and presenters. Donations are highly appreciated, and support our programming, curation, and operational costs.,,",
      paypalProfileUrl: "paypal.com",
      eTransferAddress: "test@test.com",
      ctaText: "",
      teamImage: addedPhotos.team,
      imageCollage: addedPhotos.support,
    },
  });
}

/**
 * Adds recurring gigs information.
 * @param {object} strapi - The Strapi instance.
 */
//TODO: convert to json
async function addRecurringGigs(strapi, addedPhotos) {
  await strapi.entityService.create(typeToNamespace("listing"), {
    data: { Heading: "Recurring Gigs", recurringGig: makeGigs(addedPhotos) },
  });
}

/*
 * Main seeding functions. Checks if any data is loaded and if not seed
 */
async function main(strapi) {
  try {
    // XXX: you can uncomment to completely clear the db on each strapi boot
    // await clearDb()
    const dataLoaded = await checkDataLoaded(strapi, [
      "about",
      "listing",
      "staff-member",
    ]);
    if (!dataLoaded) {
      const addedMembers = await addStaff(strapi);
      const addedPhotos = await addPhotos();
      await addAboutContent(strapi, addedPhotos, addedMembers);
      await addRecurringGigs(strapi, addedPhotos);
      console.log("Seeding completed!");
    } else {
      console.log("Skipping data seed - data already present in db");
    }
  } catch (error) {
    console.log("ERROR: ", error.details);
  }
}

module.exports = main;
