const { password } = require("../config/dbConfig");
const { registerPage, register, loginPage, login, logout, forgotPassword, checkForgotPassword, verifyOtp, checkVerifyOtp, passwordChange, checkPasswordChange } = require("../controller/authController");
const catchError = require("../services/catchError");
const sanitizer = require("../services/sanitizer");

const router = require("express").Router();

router.route("/register").get(catchError(registerPage)).post(sanitizer,catchError(register)); 
router.route("/login").get(catchError(loginPage)).post(sanitizer,catchError(login)); 
router.route("/logout").get(catchError(logout))
router.route("/forgotPassword").get(catchError(forgotPassword)).post(sanitizer,catchError(checkForgotPassword))
router.route("/verifyOtp").get(catchError(verifyOtp))
router.route("/verifyOtp/:id").post(sanitizer,catchError(checkVerifyOtp))
router.route("/passwordChange").get(catchError(passwordChange))
// router.route("/passwordChange/:id1/:id2").post(sanitizer,checkPasswordChange)
// or
router.route("/passwordChange/:email/:otp").post(sanitizer,catchError(checkPasswordChange))


module.exports = router;