import { Router } from "express";
import {
  authenticate,
  validate,
  uploadAvatar,
  validateObjectId,
} from "../../middleware/index.js";
import { updateProfile, address } from "../../validators/user.validator.js";
import * as userController from "../../controllers/user.controller.js";

const router = Router();

router.get("/me", authenticate, userController.getProfile);
router.put("/me", authenticate, validate(updateProfile), userController.updateProfile);
router.put("/me/avatar", authenticate, uploadAvatar.single("avatar"), userController.uploadAvatar);
router.get("/me/addresses", authenticate, userController.getAddresses);
router.post("/me/addresses", authenticate, validate(address), userController.addAddress);
router.put("/me/addresses/:id", authenticate, validateObjectId, validate(address), userController.updateAddress);
router.delete("/me/addresses/:id", authenticate, validateObjectId, userController.deleteAddress);
router.put("/me/addresses/:id/default", authenticate, validateObjectId, userController.setDefaultAddress);
router.get("/me/sessions", authenticate, userController.getSessions);
router.delete("/me/sessions/:id", authenticate, validateObjectId, userController.revokeSession);
router.post("/me/delete", authenticate, userController.deleteAccount);

export default router;
