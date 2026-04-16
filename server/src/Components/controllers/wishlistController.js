exports.addToWishlist = async (req, res) => {
  const { userId, productId } = req.body;

  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    wishlist = new Wishlist({ userId, products: [] });
  }

  if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
  }

  await wishlist.save();
  res.json(wishlist);
};