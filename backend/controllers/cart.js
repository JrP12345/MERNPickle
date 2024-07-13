import Cart from "../models/cart.js"; // Assuming you have defined the Cart model

// Assuming you have imported the Cart model

export const cartAdd = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const { _id: userId } = req.user;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If the user doesn't have a cart, create a new one
      cart = new Cart({ userId, products: [{ productId, quantity:1 }] });
    } else {
      // Check if the product already exists in the cart
      const existingProduct = cart.products.find(
        (product) => String(product.productId) === String(productId)
      );

      if (existingProduct) {
        existingProduct.quantity += parseInt(quantity, 10);
      } else {
        cart.products.push({ productId, quantity: parseInt(quantity, 10) });
      }
    }

    await cart.save();

    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ message: "Failed to add product to cart" });
  }
};

export const cartItems = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found for the user" });
    }
    // If cart is found, return the products in the cart
    res.status(200).json({ products: cart.products });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Failed to fetch cart items" });
  }
};
export const removeCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const { _id: userId } = req.user;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for the user" });
    }

    // Find the index of the product to remove in the cart
    const productIndex = cart.products.findIndex(
      (product) => String(product.productId) === String(productId)
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }

    // Remove the product from the cart
    cart.products.splice(productIndex, 1);

    await cart.save();

    res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ message: "Failed to remove product from cart" });
  }
};
export const removeAllCartItems = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for the user" });
    }

    // Remove all products from the cart
    cart.products = [];

    // Save the updated cart
    await cart.save();

    res
      .status(200)
      .json({ message: "All products removed from cart successfully" });
  } catch (error) {
    console.error("Error removing all products from cart:", error);
    res
      .status(500)
      .json({ message: "Failed to remove all products from cart" });
  }
};
export const decrementCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const { _id: userId } = req.user;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for the user" });
    }

    const productIndex = cart.products.findIndex(
      (product) => String(product.productId) === String(productId)
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }

    // Decrement the quantity of the product in the cart
    if (cart.products[productIndex].quantity > 1) {
      cart.products[productIndex].quantity -= 1;
    }

    await cart.save();

    res
      .status(200)
      .json({ message: "Product quantity decremented successfully" });
  } catch (error) {
    console.error("Error decrementing product quantity:", error);
    res.status(500).json({ message: "Failed to decrement product quantity" });
  }
};
