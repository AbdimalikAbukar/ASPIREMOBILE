const Goal = require("../models/goal");
const { validationResult } = require("express-validator");

// Add a new goal
const addGoal = async (req, res) => {
  const errors = validationResult(req);
  const formData = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      formData,
    });
  }

  try {
    const { title, description, deadline } = req.body;
    const newGoal = await Goal.create({
      title,
      description,
      deadline,
      user: req.user.id,
    });

    res.status(201).json(newGoal);
  } catch (err) {
    console.error("Error adding goal:", err);
    res.status(500).json({ message: "Error adding goal" });
  }
};

// Fetch goals for the authenticated user
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id });
    res.json(goals);
  } catch (err) {
    console.error("Error fetching goals:", err);
    res.status(500).json({ message: "Error fetching goals" });
  }
};

// Share a goal with another user
const shareGoal = async (req, res) => {
  try {
    const { goalId } = req.params;
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(400).json({ message: "Friend ID is required" });
    }

    const goal = await Goal.findById(goalId);

    if (!goal || goal.user.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ message: "Goal not found or not authorized" });
    }

    if (!goal.sharedWith.includes(friendId)) {
      goal.sharedWith.push(friendId);
    }

    await goal.save();

    res.json({ message: "Goal shared successfully", goal });
  } catch (err) {
    console.error("Error sharing goal:", err);
    res.status(500).json({ message: "Error sharing goal" });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const { goalId } = req.params;

    const goal = await Goal.findById(goalId);

    if (!goal || goal.user.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ message: "Goal not found or unauthorized" });
    }

    await Goal.findByIdAndDelete(goalId);
    res.status(200).json({ message: "Goal successfully deleted" });
  } catch (err) {
    console.error("Error deleting goal:", err);
    res.status(500).json({ message: "Error deleting goal", error: err });
  }
};

const getGoalById = async (req, res) => {
  try {
    const { goalId } = req.params;
    const goal = await Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.json(goal);
  } catch (error) {
    console.error("Error fetching goal:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addGoal,
  getGoals,
  shareGoal,
  deleteGoal,
  getGoalById,
};
