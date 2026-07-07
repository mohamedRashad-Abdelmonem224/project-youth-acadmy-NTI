const express = require("express");
const router = express.Router();

const adminRoutes = require("./adminRoutes");
const authRoutes = require("./authRoutes");
const upload = require("../middleware/multer-middleware");
const controlls = require("../controllers/player.controller");
const authenticateMiddleware = require("../middleware/authenticate-middleware");
const authorizeMiddleware = require("../middleware/authorize-middleware");


router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);

router
  .route("/players")
  .get(controlls.getPlayers) 
  .post(
    authenticateMiddleware,
    authorizeMiddleware("player"), 
    upload.single("imageUrl"),
    controlls.createPlayer
  );

router
  .route("/players/:id")
  .get(controlls.getPlayerById)
  .patch(
    authenticateMiddleware,
    authorizeMiddleware("admin"), 
    upload.single("imageUrl"),
    controlls.updatePlayer
  )
  .delete(authenticateMiddleware, authorizeMiddleware("admin"), controlls.deletePlayer);

module.exports = router;
