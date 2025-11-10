const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  //INDEX ROUTE
  .get(WrapAsync(listingController.index))
  //CREATE LISTING  ROUTE
  .post(
    isLoggedIn,
    validatelisting,
    upload.single("listing[image]"),
    WrapAsync(listingController.createListing)
  );

//NEW ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.get("/search", listingController.searchResult); // ✅ this line

router
  .route("/:id")
  //SHOW ROUTE
  .get(WrapAsync(listingController.showListing))
  //UPDATE POST ROUTE
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validatelisting,
    WrapAsync(listingController.updateListing)
  )
  //DELETE ROUTE
  .delete(isLoggedIn, isOwner, WrapAsync(listingController.deleteListing));

//EDIT ROUTE
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  WrapAsync(listingController.editForm)
);

module.exports = router;
