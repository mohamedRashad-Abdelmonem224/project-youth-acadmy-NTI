const Player = require("../models/player.model"); 
exports.getPendingPlayers = async (req, res) => {
  try {
    
    const players = await Player.find({ status: "pending" });
    res.status(200).json({ 
      status: "success",
      count: players.length, 
      players 
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.approvePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true } 
    );
    
    if (!player) {
      return res.status(404).json({ status: "fail", message: "This player is not available" });
    }
    
    res.status(200).json({ message: "The player was successfully accepted and transferred to the admin position.", player });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};


exports.rejectPlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    
    if (!player) {
      return res.status(404).json({ status: "fail", message: "This player is not available" });
    }
    
    res.status(200).json({ message: "The player refused and updated his status.", player });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
