const { registerPage, register, loginPage, login, logout, forgotPassword, checkForgotPassword } = require("../controller/authController");

const router = require("express").Router();

router.route("/register").get(registerPage).post(register); 
router.route("/login").get(loginPage).post(login); 
router.route("/logout").get(logout);
router.route("/forgotPassword").get(forgotPassword).post(checkForgotPassword)

module.exports = router;