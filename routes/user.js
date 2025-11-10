const express = require("express");
const router = express.Router({ mergeParams: true });
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

//logout route
router.get("/logout", userController.logoutUser);

module.exports = router;
