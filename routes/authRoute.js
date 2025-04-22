const { password } = require("../config/dbConfig");
const { registerPage, register, loginPage, login, logout, forgotPassword, checkForgotPassword, verifyOtp, checkVerifyOtp, passwordChange } = require("../controller/authController");

const router = require("express").Router();

router.route("/register").get(registerPage).post(register); 
router.route("/login").get(loginPage).post(login); 
router.route("/logout").get(logout);
router.route("/forgotPassword").get(forgotPassword).post(checkForgotPassword)
router.route("/verifyOtp").get(verifyOtp)
router.route("/verifyOtp/:id").post(checkVerifyOtp)
router.route("/passwordChange").get(passwordChange)

module.exports = router;