
const Wishlist = require('../models/wishlistModel');

exports.addToWishlist = async (req, res) => {
  const { invId } = req.body; // Assuming invId is sent in the body
  const accountId = req.user.account_id; // Assuming user is logged in and their ID is available in req.user

  try {
    const item = await Wishlist.addItem(accountId, invId);
    res.status(201).json({ message: 'Item added to wishlist', item });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Failed to add item to wishlist' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  const { wishlistId } = req.params;

  try {
    await Wishlist.removeItem(wishlistId);
    res.status(200).json({ message: 'Item removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Failed to remove item from wishlist' });
  }
};

exports.viewWishlist = async (req, res) => {
  const accountId = req.user.account_id; // Assuming user is logged in

  try {
    const wishlistItems = await Wishlist.getUserWishlist(accountId);
    res.render('wishlist/wishlist', { wishlistItems }); // Render the wishlist view with items
  } catch (error) {
    console.error('Error retrieving wishlist:', error);
    res.status(500).render('error', { message: 'Failed to retrieve wishlist' });
  }
};