const User = require('../models/User');
const Review = require('../models/Review');

/**
 * Update user's average rating and total reviews count
 * @param {string} userId - The user ID to update
 */
exports.updateUserRating = async (userId) => {
  try {
    const reviews = await Review.find({ reviewee: userId });

    if (reviews.length === 0) {
      await User.findByIdAndUpdate(userId, {
        averageRating: 0,
        totalReviews: 0
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await User.findByIdAndUpdate(userId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews: reviews.length
    });
  } catch (error) {
    console.error('Error updating user rating:', error);
    throw error;
  }
};
