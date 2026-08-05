import wishlistService from '../services/wishlist.service.js';

class WishlistController {
  async getWishlist(req, res, next) {
    try {
      const data = await wishlistService.getWishlist(req.user);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async addToWishlist(req, res, next) {
    try {
      const { productId } = req.body;
      const data = await wishlistService.addToWishlist(req.user, { productId });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async removeFromWishlist(req, res, next) {
    try {
      const data = await wishlistService.removeFromWishlist(req.user, req.params.productId);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async moveToCart(req, res, next) {
    try {
      const data = await wishlistService.moveToCart(req.user, req.params.productId);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const wishlistController = new WishlistController();

export const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  moveToCart,
} = wishlistController;

export default wishlistController;