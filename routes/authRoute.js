const { registerPage, register, loginPage, login, logout } = require("../controller/authController");

const router = require("express").Router();

router.route("/register").get(registerPage).post(register); 
router.route("/login").get(loginPage).post(login); 
router.route("/logout").get(logout);

module.exports = router;