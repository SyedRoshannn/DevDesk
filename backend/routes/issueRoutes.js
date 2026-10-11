
const express = require("express");
const Issue = require("../models/Issue");

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const issue = await Issue.create(req.body);

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: issue,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});


router.get("/", async (req, res) => {
  try {
    const issues = await Issue.find();

    res.status(200).json({
      success: true,
      data: issues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


router.get("/stats", async (req, res) => {
  try {
    const [total, open, in_progress, resolved, closed] = await Promise.all([
      Issue.countDocuments(),
      Issue.countDocuments({ status: "open" }),
      Issue.countDocuments({ status: "in_progress" }),
      Issue.countDocuments({ status: "resolved" }),
      Issue.countDocuments({ status: "closed" }),
    ]);

    res.status(200).json({
      success: true,
      data: { total, open, in_progress, resolved, closed },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    res.status(200).json({
      success: true,
      data: issue,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid issue ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    // Only allow fields that exist in the schema
    const allowedFields = ["title", "description", "type", "priority", "status"];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedIssue,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid issue ID format",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid issue ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


module.exports = router;
