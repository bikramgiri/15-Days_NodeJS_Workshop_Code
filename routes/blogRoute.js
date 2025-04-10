const { homePage, singleBlog, deleteBlog, editBlog, updateBlog, createBlogPage, createBlog } = require("../controller/blogController");

const router = require("express").Router(); 

router.route("/").get(homePage)
router.route("/blog/:id").get(singleBlog)
router.route("/delete/:id").get(deleteBlog)
router.route("/edit/:id").get(editBlog)
router.route("/update/:id").post(updateBlog)
router.route("/create").get(createBlogPage).post(upload.single("image"), createBlog)

module.exports = router; 