const wishlistSchema = new mongoose.Schema({
  userId: String,
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
});