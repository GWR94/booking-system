import Joi from "joi";
import { RegistrationForm, LoginForm } from "../types/RegistrationForm";

export const registrationSchema = Joi.object<RegistrationForm>({
  email: Joi.string()
    .email({
      tlds: { allow: false },
    })
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
    }),
  name: Joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .min(5)
    .max(50)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.pattern.base": "Name can only contain letters and spaces.",
      "string.min": "Name must be at least 5 characters",
      "string.max": "Name must not be more than 50 characters",
    }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("(?=.*[A-Z])(?=.*[!@#$&*])"))
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain an uppercase letter and a special character",
      "string.empty": "Password is required",
    }),
  confirm: Joi.string().min(1).required().valid(Joi.ref("password")).messages({
    "any.only": "Passwords must match",
    "string.empty": "Confirm password is required",
    "string.min": "Confirm password is required",
  }),
});

export const loginSchema = Joi.object<LoginForm>({
  email: Joi.string()
    .email({
      tlds: { allow: false },
    })
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
    }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("(?=.*[A-Z])(?=.*[!@#$&*])"))
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain an uppercase letter and a special character",
      "string.empty": "Password is required",
    }),
});
