// controllers/adminDashboardController.js

const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

exports.getDashboardMetrics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalComments = await Comment.countDocuments();
    const recentPosts = await Post.find().sort({ createdAt: -1 }).limit(5);
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalUsers,
      totalPosts,
      totalComments,
      recentPosts,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
