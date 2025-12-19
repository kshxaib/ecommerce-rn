import { Router } from "express";
import {
  createProduct,
  getAllCustomers,
  getAllOrders,
  getAllProducts,
  getDashboardStats,
  updateOrderStatus,
  updateProduct,
  deleteProduct,
} from "../controllers/admin.controller.js";
import { adminOnly, protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

// optimization - DRY
// router.use();

router.post("/products", protectRoute, adminOnly, upload.array("images", 3), createProduct);
router.get("/products", protectRoute, adminOnly, getAllProducts);
router.put("/products/:id", protectRoute, adminOnly, upload.array("images", 3), updateProduct);
router.delete("/products/:id", protectRoute, adminOnly, deleteProduct);

router.get("/orders", protectRoute, adminOnly, getAllOrders);
router.patch("/orders/:orderId/status", protectRoute, adminOnly, updateOrderStatus);

router.get("/customers", protectRoute, adminOnly, getAllCustomers);

router.get("/stats", protectRoute, adminOnly, getDashboardStats);

// PUT: Used for full resource replacement, updating the entire resource
// PATCH: Used for partial resource updates, updating a specific part of the resource

export default router;
