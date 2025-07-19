const dbConnect = require("../config/db");
const mongoose = require("mongoose");
const Video = require("../models/video");
const Channel = require("../models/channel");

const seedVideos = async () => {
  try {
    await dbConnect(); // ✅ Use your existing function

    // Get or create a test uploader (Channel)
    let uploader = await Channel.findOne();
    if (!uploader) {
      uploader = await Channel.create({
        name: "Seed Channel",
        email: "seed@channel.com",
        avatar: "https://example.com/avatar.jpg",
        // Add other required fields if needed
      });
    }

    // Clear existing videos (optional)
    await Video.deleteMany();

    // Add seed videos
    const videos = [
      {
        uploader: uploader._id,
        title: "Intro to Express.js",
        filename: "express.mp4",
        thumbnailFilename: "express-thumb.jpg",
        description: "Quick guide to Express.js",
        category: 4, // news
        visibility: 0, // public
        videoStoreId: "exp123",
        thumbnailStoreId: "exp-thumb123",
        views: 50000,
        weeklyViews: 25000,
        duration: "7:10",
      },
      {
        uploader: uploader._id,
        title: "Best UI Libraries 2025",
        filename: "ui-libs.mp4",
        thumbnailFilename: "ui-libs-thumb.jpg",
        description: "React component libraries ranked",
        category: 0, // music (your enum)
        visibility: 0,
        videoStoreId: "ui999",
        thumbnailStoreId: "ui-thumb999",
        views: 85000,
        weeklyViews: 40000,
        duration: "12:34",
      },
    ];

    await Video.insertMany(videos);

    console.log("✅ Videos seeded successfully");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
  } finally {
    mongoose.disconnect();
  }
};

// seedVideos(); // Temporarily disabled to fix upload issues
