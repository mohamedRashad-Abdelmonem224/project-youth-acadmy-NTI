const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/auth-controller");
const authenticateMiddleware = require("../middleware/authenticate-middleware");

// مسارات مفتوحة للكل لتوليد التوكن
router.post("/register", register);
router.post("/login", login);

// مسار محمي بالتوكن فقط لقراءة بيانات المستخدم الحالي
router.get("/me", authenticateMiddleware, getMe);

module.exports = router;


