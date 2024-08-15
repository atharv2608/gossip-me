import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast of 2 characters")
    .max(20, "Username should not be more tham 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");


export const signupSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid Email"}),
    password: z.string().min(6, {message: "Password must be atleast 6 characters"})
})