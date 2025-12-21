import RazorpayCheckout from "react-native-razorpay";
import api from "./axios";

export async function payWithRazorpay(cartItems, shippingAddress) {
    const { data } = await api.post("/api/payments/create-order", {
        cartItems,
        shippingAddress,
    });

    if (!data.success) throw new Error(data.message || "Failed to create order")

    const options = {
        key: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Ecommerce-rn",
        order_id: data.razorpayOrderId,
    };

    const payment = await RazorpayCheckout.open(options);

    await api.post("/api/payments/verify", {
        razorpay_order_id: payment.razorpay_order_id,
        razorpay_payment_id: payment.razorpay_payment_id,
        razorpay_signature: payment.razorpay_signature,
        orderData: {
            items: data.validatedItems,
            shippingAddress: data.shippingAddress,
            total: data.grandTotal,
        },
    });

    return { success: true }
}
