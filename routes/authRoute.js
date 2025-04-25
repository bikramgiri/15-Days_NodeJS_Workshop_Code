const { password } = require("../config/dbConfig");
const { registerPage, register, loginPage, login, logout, forgotPassword, checkForgotPassword, verifyOtp, checkVerifyOtp, passwordChange, checkPasswordChange } = require("../controller/authController");
const catchError = require("../services/catchError");

const router = require("express").Router();

router.route("/register").get(catchError(registerPage)).post(catchError(register)); 
router.route("/login").get(catchError(loginPage)).post(catchError(login)); 
router.route("/logout").get(catchError(logout))
router.route("/forgotPassword").get(catchError(forgotPassword)).post(catchError(checkForgotPassword))
router.route("/verifyOtp").get(catchError(verifyOtp))
router.route("/verifyOtp/:id").post(catchError(checkVerifyOtp))
router.route("/passwordChange").get(catchError(passwordChange))
// router.route("/passwordChange/:id1/:id2").post(checkPasswordChange)
// or
router.route("/passwordChange/:email/:otp").post(catchError(checkPasswordChange))


module.exports = router;