const { registerPage, register, loginPage, login } = require("../controller/authController");

const router = require("express").Router();

router.route("/register").get(registerPage).post(register); 
router.route("/login").get(loginPage).post(login); 

module.exports = router;