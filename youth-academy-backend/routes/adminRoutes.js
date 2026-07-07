const express = require("express");
const router = express.Router();
const adminControllers = require("../controllers/admin-controller");
const authenticateMiddleware = require("../middleware/authenticate-middleware");
const authorizeMiddleware = require("../middleware/authorize-middleware");
router
  .route("/players/pending")
  .get(authenticateMiddleware, authorizeMiddleware("admin"), adminControllers.getPendingPlayers);

router
  .route("/players/:id/approve")
  .patch(authenticateMiddleware, authorizeMiddleware("admin"), adminControllers.approvePlayer);

router
  .route("/players/:id/reject")
  .patch(authenticateMiddleware, authorizeMiddleware("admin"), adminControllers.rejectPlayer);

module.exports = router;
