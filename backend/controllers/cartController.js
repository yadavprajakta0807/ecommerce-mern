import Cart from "../models/Cart.js";


// ==============================
// ADD ITEM TO CART
// ==============================
export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Check if cart already exists
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        userId,
        items: [{ productId, quantity: 1 }],
      });
    } else {
      // Check if product already exists in cart
      const item = cart.items.find(
        (i) => i.productId.toString() === productId
      );

      if (item) {
        item.quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }
    }

    await cart.save();

    res.json({
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add To Cart Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


// ==============================
// REMOVE ITEM FROM CART
// ==============================
export const removeItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== productId
    );

    await cart.save();

    res.json({
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    console.error("Remove Item Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


// ==============================
// UPDATE ITEM QUANTITY
// ==============================
export const updateQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (i) => i.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found in cart",
      });
    }

    item.quantity = quantity;

    await cart.save();

    res.json({
      message: "Item quantity updated",
      cart,
    });
  } catch (error) {
    console.error("Update Quantity Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


// ==============================
// GET CART BY USER ID
// ==============================
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId })
      .populate("items.productId");

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    res.json(cart);
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};