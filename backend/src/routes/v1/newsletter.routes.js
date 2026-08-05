import { Router } from "express";
import { validate, apiLimiter } from "../../middleware/index.js";
import { subscribe, unsubscribe } from "../../validators/newsletter.validator.js";
import * as newsletterController from "../../controllers/newsletter.controller.js";

const router = Router();

router.post("/subscribe", apiLimiter, validate(subscribe), newsletterController.subscribe);
router.post("/unsubscribe", apiLimiter, validate(unsubscribe), newsletterController.unsubscribe);

export default router;
