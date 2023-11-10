const path = require("path");
const { uploadFile, getFilePaths } = require("./utils");

async function prepare(strapi) {
  const files = await strapi.entityService.findMany("plugin::upload.file", {});
  for (const file of files) {
    await strapi.entityService.delete("plugin::upload.file", file.id);
  }
  await strapi.entityService.deleteMany("api::staff-member.staff-member");
  await strapi.entityService.deleteMany("api::about.about");
}

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
      await strapi.entityService.create("api::staff-member.staff-member", {
        data: item,
      })
    );
  }

  return addedMembers;
}

async function addPhotos() {
  const assetsPath = path.join(process.cwd(), "public", "assets");
  const addedPhotos = [];
  const filePaths = await getFilePaths(assetsPath);
  for (const path of filePaths) {
    const uploadedFileId = await uploadFile(path, "title");
    addedPhotos.push(uploadedFileId);
  }
}

async function addAboutContent(strapi, addedPhotos, addedMembers) {
  await strapi.entityService.create("api::about.about", {
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
      teamImage: addedPhotos[0],
      imageCollage: addedPhotos[1],
    },
  });
}

module.exports = async ({ strapi }) => {
  try {
    await prepare();
    const addedMembers = await addStaff(strapi);
    const addedPhotos = await addPhotos(strapi);
    await addAboutContent(strapi, addedPhotos, addedMembers);
    // Add about page
  } catch (error) {
    console.log("ERROR: ", error.details ?? error);
  }
  console.log("Seeding completed!");
};
