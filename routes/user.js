const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const Listing = require("../models/listing");
const WrapAsync = require("../utils/WrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

router
  .route("/signup")
  //render signup form route
  .get(userController.renderSignupForm)
  //signup route
  .post(WrapAsync(userController.signupUser));

router
  .route("/login")
  //render login form route
  .get(userController.renderLoginForm)
  //login route
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.loginUser
  );

// const User = require("../models/user");
// const Listing = require("../models/listing");

// User profile page
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  const listings = await Listing.find({ owner: id });

  res.render("users/show", { user, listings });
});

module.exports = router;

//logout route
router.get("/logout", userController.logoutUser);

module.exports = router;
