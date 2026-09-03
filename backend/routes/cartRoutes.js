const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const {protect} = require("../middleware/authMiddleware")

const router = express.Router();

//helper function to get cart based on userId or guestId    
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({user: userId});  
    } else if (guestId) {
        return await Cart.findOne({guestId: guestId});
    }
    return null;
}

//@route POST /api/cart
// @desc Add product to cart
// @access Public
router.post("/", async (req, res) => {
    const {productId, quantity, size, color, guestId, userId} = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({message: "Product not found"});
        
        // Determine if user is logged in or guest
        let cart = await getCart(userId, guestId);

        //if cart exists, update it, 
        if (cart) {
            const productIndex = cart.products.findIndex((p) => 
            p.productId.toString() === productId && 
            p.size === size && 
            p.color === color);
        

        //if product exists in cart, update its quantity, otherwise add it to the cart
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({
                productId: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                size,
                color,
                quantity
            });
        }

        //update total price
        cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
        await cart.save();
        return res.status(200).json(cart);

        } else {
            //if cart does not exist, create a new one
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                products: [{
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity
                }],
                totalPrice: product.price * quantity
            });
            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Server error"});
    }
})
    
// @route PUT /api/cart
// @desc Update product quantity in cart
// @access Public
router.put("/", async (req, res) => {
    const {productId, quantity, size, color, guestId, userId} = req.body;
    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({message: "Cart not found"});

        const productIndex = cart.products.findIndex((p) => 
            p.productId.toString() === productId && 
            p.size === size && 
            p.color === color);

        if (productIndex > -1) {
            if (quantity > 0) {
                cart.products[productIndex].quantity = quantity;
            } else {
                cart.products.splice(productIndex, 1); // remove product if quantity is 0
            }
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({message: "Product not found in cart"});
        }
} catch (error) {
        console.error(error);
        return res.status(500).json({message: "Server error"});
    } 

});

// @route DELETE /api/cart
// @desc Remove product from cart
// @access Public
router.delete("/", async (req, res) => {
    const {productId, size, color, guestId, userId} = req.body;
    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({message: "Cart not found"});

        const productIndex = cart.products.findIndex((p) => 
            p.productId.toString() === productId && 
            p.size === size && 
            p.color === color);

        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);
            //update total price
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({message: "Product not found in cart"});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Server error"});
    }
});

// @route GET /api/cart
// @desc Get cart for user or guest
// @access Public
router.get("/", async (req, res) => {
    const {guestId, userId} = req.query;
    try {
        const cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({message: "Cart not found"});
        return res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Server error"});
    }
});

// @route POST /api/cart/merge
// @desc Merge guest cart into user cart upon login
// @access Private
router.post("/merge", protect, async (req, res) => {
    const {guestId} = req.body;

    try {
        const guestCart = await Cart.findOne({guestId});
        const userCart = await Cart.findOne({user: req.user._id});

        if (guestCart) {
            if (guestCart.products.length === 0) {
                return res.status(400).json({message: "Guest cart is empty"});
            }

            if (userCart) {
                // Merge guest cart into user cart
                guestCart.products.forEach((guestItem) => {
                    const productIndex = userCart.products.findIndex((userProduct) => 
                        userProduct.productId.toString() === guestItem.productId.toString() &&
                        userProduct.size === guestItem.size &&
                        userProduct.color === guestItem.color
                    );  

                    if (productIndex > -1) {
                        // If product exists in user cart, update quantity
                        userCart.products[productIndex].quantity += guestItem.quantity;
                    } else {
                        // If product does not exist in user cart, add it
                        userCart.products.push(guestItem);
                    }
                });

                userCart.totalPrice = userCart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
                await userCart.save();
                
                // Clear guest cart
                try{
                    await Cart.findOneAndDelete({guestId});
                }catch (error) {
                    console.error("Error clearing guest cart:", error);
                }
                res.status(200).json(userCart);
            } else {
                // If user cart does not exist, assign guest cart to user
                guestCart.user = req.user._id;
                guestCart.guestId = undefined; // Clear guestId since it's now a user cart
                await guestCart.save();
                res.status(200).json(guestCart);
            }
        } else {
            if (userCart) {
                res.status(200).json(userCart);
            } else {
                res.status(404).json({message: "guest cart not found"});
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Server error"});
    }
});

module.exports = router;