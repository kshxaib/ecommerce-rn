import crypto from "crypto";
import { ENV } from "../config/env.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { razorpay } from "../config/razorpay.js"

export async function createRazorpayOrder(req, res) {
    try {
        const { cartItems, shippingAddress } = req.body;
        const user = req.user;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        let total = 0;
        const validatedItems = [];

        for (const item of cartItems) {
            const product = await Product.findById(item.product._id);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            if (product.stock < item.quantity) {
                return res
                    .status(400)
                    .json({ message: `Insufficient stock for ${product.name}` });
            }

            total += product.price * item.quantity;

            validatedItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.images[0],
            });
        }

        if (total <= 0) {
            return res.status(400).json({ message: "Invalid order total" });
        }

        const shipping = 10;
        const tax = total * 0.08;
        const grandTotal = total + shipping + tax;

        const razorpayOrder = await razorpay.orders.create({
            amount: grandTotal * 100, // INR → paise
            currency: "INR",
            receipt: `receipt_${Date.now()}_${user._id}`,
        });

        res.status(200).json({
            success: true,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            validatedItems,
            shippingAddress,
            grandTotal,
        });
    } catch (error) {
        console.error("Create Razorpay order error:", error);
        res.status(500).json({ message: "Failed to create order" });
    }
}

export async function verifyRazorpayPayment(req, res) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderData,
        } = req.body;

        const user = req.user;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", ENV.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Payment verification failed" });
        }

        // ✅ Create Order
        const order = await Order.create({
            user: user._id,
            orderItems: orderData.items,
            shippingAddress: orderData.shippingAddress,
            paymentResult: {
                id: razorpay_payment_id,
                status: "success",
            },
            totalPrice: orderData.total,
        });

        // 📉 Update stock
        for (const item of orderData.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity },
            });
        }

        // 🧹 Clear cart
        await Cart.findOneAndDelete({ user: user._id });

        res.status(201).json({ message: "Payment verified", order });
    } catch (error) {
        console.error("Verify Razorpay error:", error);
        res.status(500).json({ message: "Payment verification failed" });
    }
}