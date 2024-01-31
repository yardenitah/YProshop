// server/controllers/productController.js
import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1; // return the page number in the url

  // Construct a search keyword for filtering products based on the 'name' field.
  // The keyword only needs to be contained within a name in the database to match. In addition, mack the keyword into lowercase letters using the i
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await Product.countDocuments({ ...keyword }); // mongoose method that returns the total number of documents (Product in this case)
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // Send a JSON response to the client containing:
  // - Fetched products from the database.
  // - Current page number.
  // - Total number of pages, calculated based on the total count of products and the specified page size.
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch all product
// @route GET /api/products/:id
// @access public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc Create a products
// @route POST /api/products
// @access private/admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "sample brand",
    category: "sample category",
    countInStock: 0,
    numReviews: 0,
    description: "sample description",
  });

  const createdProduct = await product.save();
  res.status(200).json(createdProduct);
});

// @desc Update a products
// @route PUT /api/products/:id
// @access private/admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.category = category;
    product.countInStock = countInStock;
    product.image = image;
    product.brand = brand;

    const updateProduct = await product.save();
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc Delete a products
// @route DELETE /api/products/:id
// @access private/admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ message: "Product deleted " });
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      // This is the testing function. It checks each element (r represents an individual review object) in the reviews array.
      // It converts r.user and req.user._id to strings using toString() and compares them. It's looking for a review where the user property of the
      // review matches the _id property of the currently authenticated user (req.user).
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Edit review
// @route   PUT /api/products/:id/reviews
// @access  Private
const editProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const foundReviewedIndex = product.reviews.findIndex(
      (r) => r.user.toString() === req.user._id.toString()
    );

    res.json(foundReviewedIndex);

    if (foundReviewedIndex !== -1) {
      // Remove the existing review
      product.reviews.splice(foundReviewedIndex, 1);

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      // Add the updated review
      product.reviews.push(review);

      // Update numReviews and rating
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(200).json({ message: "Edit review successfully" });
    } else {
      res.status(404);
      throw new Error("Review not found");
    }
  } else {
    res.status(404);
    throw new Error("Product not found for update review");
  }
});

// @desc    Delete review
// @route   PUT /api/products/:id/reviews
// @access  Private
const deleteProductReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.body; // Assuming you pass the reviewId from the client
  const product = await Product.findById(req.params.id);

  if (product && reviewId) {
    product.reviews.pull({ _id: reviewId }); // Use $pull to remove the review..
    // $pull is MongoDB operator is used to remove elements from an array that match a specified condition. It is particularly useful when dealing with arrays within documents.

    //! if i what to search manually
    // const reviewIndex = product.reviews.findIndex(
    //   (review) => review._id.toString() === reviewId
    // );

    // if (reviewIndex !== -1) {
    //   product.reviews.splice(reviewIndex, 1);
    //   await product.save();
    // }
    // !

    // Update numReviews and rating
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          product.reviews.length
        : 0;

    // Save the product after changes
    await product.save();
    res.json({ message: "Review deleted successfully" });
  } else {
    res.status(404);
    throw new Error("Product not found or reviewId not provided");
  }
});

// @desc    Get top 3 products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  editProductReview,
  deleteProductReview,
  getTopProducts,
};
