const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const utilities = require('../utilities/')

router.post('/add',  utilities.handleErrors(wishlistController.addToWishlist));
router.post('/remove/:wishlistId', utilities.handleErrors(wishlistController.removeFromWishlist));
router.get('/',  utilities.handleErrors(wishlistController.viewWishlist));

module.exports = router;