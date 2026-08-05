import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import productRoutes from "./product.routes.js";
import categoryRoutes from "./category.routes.js";
import orderRoutes from "./order.routes.js";
import cartRoutes from "./cart.routes.js";
import wishlistRoutes from "./wishlist.routes.js";
import paymentRoutes from "./payment.routes.js";
import reviewRoutes from "./review.routes.js";
import blogRoutes from "./blog.routes.js";
import recipeRoutes from "./recipe.routes.js";
import supportRoutes from "./support.routes.js";
import newsletterRoutes from "./newsletter.routes.js";
import searchRoutes from "./search.routes.js";
import wholesaleRoutes from "./wholesale.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/products", reviewRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);
router.use("/cart", cartRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/payments", paymentRoutes);
router.use("/reviews", reviewRoutes);
router.use("/blogs", blogRoutes);
router.use("/recipes", recipeRoutes);
router.use("/support", supportRoutes);
router.use("/newsletter", newsletterRoutes);
router.use("/search", searchRoutes);
router.use("/wholesale", wholesaleRoutes);
router.use("/admin", adminRoutes);

export default router;
