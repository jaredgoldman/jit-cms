const path = require("path");
const { uploadFile, getFilePaths, formatDateToHHmmssSSS } = require("./utils");

/*
 * Pre-seeding logic
 */
async function prepare(strapi) {
  const files = await strapi.entityService.findMany("plugin::upload.file", {});
  for (const file of files) {
    await strapi.entityService.delete("plugin::upload.file", file.id);
  }
  await strapi.entityService.deleteMany("api::staff-member.staff-member");
  await strapi.entityService.deleteMany("api::about.about");
  await strapi.entityService.deleteMany("api::listing.listing");
}

/*
 * Add staff membmers
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
      await strapi.entityService.create("api::staff-member.staff-member", {
        data: item,
      })
    );
  }

  return addedMembers;
}

/*
 * Add all photos in public/assets folder
 */
async function addPhotos() {
  const assetsPath = path.join(process.cwd(), "public", "assets");
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

/*
 * Add /about page content
 */
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
      teamImage: addedPhotos.team,
      imageCollage: addedPhotos.support,
    },
  });
}
/*
 * Add /listings page content
 */

async function addRecurringGigs(strapi, addedPhotos) {
  const gigs = [
    {
      day: "Monday",
      artist: "Test Artist",
      time: formatDateToHHmmssSSS(new Date()),
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      image: addedPhotos.recurring,
      venue: "Test venue",
    },
    {
      day: "Tuesday",
      artist: "Test Artist",
      time: formatDateToHHmmssSSS(new Date()),
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      image: addedPhotos.recurring,
      venue: "Test venue",
    },
    {
      day: "Wednesday",
      artist: "Test Artist",
      time: formatDateToHHmmssSSS(new Date()),
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      image: addedPhotos.recurring,
      venue: "Test venue",
    },
    {
      day: "Thursday",
      artist: "Test Artist",
      time: formatDateToHHmmssSSS(new Date()),
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      image: addedPhotos.recurring,
      venue: "Test venue",
    },
    {
      day: "Friday",
      artist: "Test Artist",
      time: formatDateToHHmmssSSS(new Date()),
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      image: addedPhotos.recurring,
      venue: "Test venue",
    },
    {
      day: "Saturday",
      artist: "Test Artist",
      time: formatDateToHHmmssSSS(new Date()),
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      image: addedPhotos.recurring,
      venue: "Test venue",
    },
    {
      day: "Sunday",
      artist: "Test Artist",
      time: formatDateToHHmmssSSS(new Date()),
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      image: addedPhotos.recurring,
      venue: "Test venue",
    },
  ];

  await strapi.entityService.create("api::listing.listing", {
    data: { Heading: "Recurring Gigs", recurringGig: gigs },
  });
}

module.exports = async ({ strapi }) => {
  try {
    await prepare(strapi);
    const addedMembers = await addStaff(strapi);
    const addedPhotos = await addPhotos();
    await addAboutContent(strapi, addedPhotos, addedMembers);
    await addRecurringGigs(strapi, addedPhotos);
  } catch (error) {
    console.log("ERROR: ", error);
  }
  console.log("Seeding completed!");
};
