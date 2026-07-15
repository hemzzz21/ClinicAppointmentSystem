import { body } from "express-validator";

export const registerValidator = [
  body("name").notEmpty().withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .isIn(["PATIENT", "DOCTOR", "ADMIN"])
    .withMessage("Role must be PATIENT, DOCTOR, or ADMIN"),
];

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];