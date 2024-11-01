const pool = require("../database/")


class Wishlist {
    static async addItem(accountId, invId) {
      const result = await pool.query(
        'INSERT INTO public.wishlist (account_id, inv_id) VALUES ($1, $2) RETURNING *',
        [accountId, invId]
      );
      return result.rows[0];
    }
  
    static async removeItem(wishlistId) {
      await pool.query('DELETE FROM public.wishlist WHERE wishlist_id = $1', [wishlistId]);
    }
  
    static async getUserWishlist(accountId) {
      const result = await pool.query(
        `SELECT w.wishlist_id, w.inv_id, i.inv_make, i.inv_model 
         FROM public.wishlist w 
         JOIN public.inventory i ON w.inv_id = i.inv_id 
         WHERE w.account_id = $1`, 
        [accountId]
      );
      return result.rows;
    }
  }
  
  module.exports = Wishlist;