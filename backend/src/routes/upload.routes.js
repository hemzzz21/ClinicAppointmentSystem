import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { uploadProfileImage } from "../controllers/upload.controller.js";

const router = express.Router();

router.post(
  "/profile-image",
  protect,
  upload.single("profileImage"),
  uploadProfileImage
);

export default router;