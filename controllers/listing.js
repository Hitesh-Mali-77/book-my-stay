const Listing = require("../models/listing");
const { geocoding } = require("@maptiler/client");
const maptilerClient = require("@maptiler/client");
const { types } = require("joi");
maptilerClient.config.apiKey = process.env.MAP_TOKEN;

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listing/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listing/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing You Requested For Does Not Exist!");
    return res.redirect("/listing");
  }
  res.render("./listing/show.ejs", {
    listing,
    mapToken: process.env.MAP_TOKEN,
  });
};

module.exports.createListing = async (req, res, next) => {
  const { listing } = req.body;

  // Geocode the location text
  const response = await geocoding.forward(listing.location, { limit: 1 });

  console.log(response);
  let coordinates = [0, 0];
  if (response.features && response.features.length > 0) {
    coordinates = response.features[0].geometry.coordinates;
  }

  let url = req.file.path;
  let filename = req.file.filename;

  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = { type: "Point", coordinates };
  let savedlist = await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listing");
};

module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing You Requested For Does Not Exist!");
    return res.redirect("/listing");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listing/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  if (req.body.listing.location) {
    try {
      const response = await maptilerClient.geocoding.forward(
        req.body.listing.location,
        { limit: 1 }
      );
      if (response.features && response.features.length > 0) {
        const coordinates = response.features[0].geometry.coordinates;
        listing.geometry = { type: "Point", coordinates };
      }
    } catch (err) {
      console.error("Geocoding failed:", err);
    }
  }

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  } else {
    await listing.save();
  }

  // console.log(req.body.listing);
  req.flash("success", "Listing Updated");
  res.redirect(`/listing/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Was Deleted");
  res.redirect("/listing");
};

module.exports.searchResult = async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.redirect("/listing");
  }
  const listings = await Listing.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
      { country: { $regex: query, $options: "i" } },
    ],
  });

  res.render("listing/searchlistings.ejs", { listings, query });
};
