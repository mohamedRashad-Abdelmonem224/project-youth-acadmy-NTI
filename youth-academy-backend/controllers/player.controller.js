const fs = require("fs").promises;
const path = require("path");
const Player = require("../models/player.model");

const deletePlayerFile = async (filename) => {
  if (!filename) return;
  try {
    const filePath = path.join(process.cwd(), "uploads/player", filename);
    await fs.unlink(filePath);
  } catch (err) {
    console.error(`Failed to delete old image file: ${err.message}`);
  }
};


const getPlayers = async (req, res) => {
  try {
    const players = await Player.find({ status: "approved" }).lean(); 

   
    const formattedPlayers = players.map(player => ({
      ...player,
      goals: player.stats?.goals || 0,
      assists: player.stats?.assists || 0,
      matches: player.stats?.matches || 0,
      imageUrl: player.img || ""       
    }));

    res.status(200).json({
      status: "success",
      count: formattedPlayers.length,
      data: { players: formattedPlayers },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to fetch players: ${error.message}`,
    });
  }
};


const createPlayer = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).json({ status: "error", message: req.fileValidationError });
    }

    const { status, submittedBy, goals, assists, matches, injuries, video, ...safeBody } = req.body;

    const playerData = {
      ...safeBody,
      video: video || "", 
      status: "pending",
      submittedBy: req.user._id,
    };

 
    playerData.stats = {
      goals: Number(goals) || 0,
      assists: Number(assists) || 0,
      matches: Number(matches) || 0,
      injuries: Number(injuries) || 0,
    };

    if (req.file) {
      playerData.img = `/uploads/player/${req.file.filename}`;
    }

    const newPlayer = await Player.create(playerData);
    res.status(201).json({ status: "success", data: { player: newPlayer } });
  } catch (error) {
    if (req.file) await deletePlayerFile(req.file.filename);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).lean();

    if (!player) {
      return res.status(404).json({ status: "fail", message: "Player not found" });
    }

    const formattedPlayer = {
      ...player,
      goals: player.stats?.goals || 0,
      assists: player.stats?.assists || 0,
      matches: player.stats?.matches || 0,
      imageUrl: player.img || ""
    };

    res.status(200).json({
      status: "success",
      data: { player: formattedPlayer },
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};


const updatePlayer = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).json({ status: "error", message: req.fileValidationError });
    }

    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ status: "fail", message: "Player not found" });
    }

    const { status, submittedBy, goals, assists, matches, injuries, video, ...safeBody } = req.body;
    const updateData = { ...safeBody };

    if (video !== undefined) updateData.video = video;

    if (goals != null || assists != null || matches != null || injuries != null) {
      updateData.stats = {
        goals: goals != null ? Number(goals) : (player.stats?.goals || 0),
        assists: assists != null ? Number(assists) : (player.stats?.assists || 0),
        matches: matches != null ? Number(matches) : (player.stats?.matches || 0),
        injuries: injuries != null ? Number(injuries) : (player.stats?.injuries || 0),
      };
    }

    if (req.file) {
      updateData.img = `/uploads/player/${req.file.filename}`;
      if (player.img) {
        const oldFilename = path.basename(player.img);
        await deletePlayerFile(oldFilename);
      }
    }

    Object.assign(player, updateData);
    const updatedPlayer = await player.save();

    res.status(200).json({
      status: "success",
      message: "Player updated successfully",
      data: { player: updatedPlayer },
    });
  } catch (error) {
    if (req.file) await deletePlayerFile(req.file.filename);
    res.status(400).json({ status: "error", message: error.message });
  }
};


const deletePlayer = async (req, res) => {
  try {
    const deletedPlayer = await Player.findByIdAndDelete(req.params.id);
    if (!deletedPlayer) {
      return res.status(404).json({ status: "fail", message: "Player not found" });
    }

    if (deletedPlayer.img) {
      const filename = path.basename(deletedPlayer.img);
      await deletePlayerFile(filename);
    }

    res.status(200).json({
      status: "success",
      message: "Player deleted successfully",
      data: { player: deletedPlayer },
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

module.exports = {
  getPlayers,
  createPlayer,
  getPlayerById,
  updatePlayer,
  deletePlayer,
};
