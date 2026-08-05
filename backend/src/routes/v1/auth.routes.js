import { Router } from "express";
import {
  authenticate,
  validate,
  authLimiter,
  otpLimiter,
} from "../../middleware/index.js";
import {
  register,
  login,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
} from "../../validators/auth.validator.js";
import * as authController from "../../controllers/auth.controller.js";

const router = Router();

router.post("/register", authLimiter, validate(register), authController.register);
router.post("/login", authLimiter, validate(login), authController.login);
router.post("/logout", authenticate, authController.logout);
router.post("/logout-all", authenticate, authController.logoutAll);
router.post("/refresh", authController.refreshToken);
router.post("/forgot-password", authLimiter, validate(forgotPassword), authController.forgotPassword);
router.post("/reset-password", validate(resetPassword), authController.resetPassword);
router.post("/change-password", authenticate, validate(changePassword), authController.changePassword);
router.post("/verify-email", validate(verifyEmail), authController.verifyEmail);
router.post("/verify-email/resend", authenticate, authController.resendVerification);
router.post("/otp/send", otpLimiter, validate(sendOTP), authController.sendOTP);
router.post("/otp/verify", otpLimiter, validate(verifyOTP), authController.verifyOTP);
router.post("/google", authController.googleLogin);

export default router;
