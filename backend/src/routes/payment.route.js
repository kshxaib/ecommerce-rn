import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createRazorpayOrder, verifyRazorpayPayment } from "../controllers/payment.controller.js";

const router = Router();


router.post("/create-order", protectRoute, createRazorpayOrder);
router.post("/verify", protectRoute, verifyRazorpayPayment);

export default router;
