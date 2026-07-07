﻿const fs = require("fs").promises;
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

// Get all players
const getPlayers = async (req, res) => {
  try {
    const players = await Player.find({ status: "approved" });

    res.status(200).json({
      status: "success",
      count: players.length,
      data: { players },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to fetch players: ${error.message}`,
    });
  }
};

// Create player
const createPlayer = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).json({ status: "error", message: req.fileValidationError });
    }

    // امنع العميل يتحكم في الحالة أو صاحب الطلب بنفسه
    const { status, submittedBy, ...safeBody } = req.body;

    const playerData = {
      ...safeBody,
      status: "pending",
      submittedBy: req.user._id, // جاي من authenticateMiddleware
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


// Get player by ID
const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({
        status: "fail",
        message: "Player not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: { player },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Update player

const updatePlayer = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).json({
        status: "error",
        message: req.fileValidationError,
      });
    }

    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({
        status: "fail",
        message: "Player not found",
      });
    }

    // ⚠️ تعديل أمني: منع العميل من تعديل الحالة أو صاحب الحساب أثناء التحديث
    const { status, submittedBy, ...safeBody } = req.body;
    const updateData = { ...safeBody };

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
    if (req.file) {
      await deletePlayerFile(req.file.filename);
    }
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};


// Delete player
const deletePlayer = async (req, res) => {
  try {
    const deletedPlayer = await Player.findByIdAndDelete(req.params.id);

    if (!deletedPlayer) {
      return res.status(404).json({
        status: "fail",
        message: "Player not found",
      });
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
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  getPlayers,
  createPlayer,
  getPlayerById,
  updatePlayer,
  deletePlayer,
};