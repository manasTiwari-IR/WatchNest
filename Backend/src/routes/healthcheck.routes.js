import { Router } from "express";
import { healthcheck } from "../controllers/healthcheck.controller.js";

const router = Router();

// /api/v1/healthcheck
router.route("/").get(healthcheck);

// /api/v1/healthcheck/test
// router.route("/test").get(healthcheck);

export default router;
