const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/auth-controller");
const authenticateMiddleware = require("../middleware/authenticate-middleware");


router.post("/register", register);
router.post("/login", login);


router.get("/me", authenticateMiddleware, getMe);

module.exports = router;


