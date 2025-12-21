import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

export async function getCart(req, res) {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $setOnInsert: { items: [] } },
      { new: true, upsert: true }
    ).populate("items.product");

    res.status(200).json({ cart });
  } catch (error) {
    console.error("Error in getCart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function addToCart(req, res) {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $setOnInsert: { items: [] } },
      { new: true, upsert: true }
    ).populate("items.product");

    const existingItem = cart.items.find(
      (item) => item.product._id.toString() === productId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({ error: "Insufficient stock" });
      }
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate("items.product");

    res.status(200).json({
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateCartItem(req, res) {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.product");

    res.status(200).json({
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Error in updateCartItem:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function removeFromCart(req, res) {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.product");

    res.status(200).json({
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function clearCart(req, res) {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = [];
    await cart.save();
    await cart.populate("items.product");

    res.status(200).json({
      message: "Cart cleared",
      cart,
    });
  } catch (error) {
    console.error("Error in clearCart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}