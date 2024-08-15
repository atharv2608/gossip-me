import {z} from "zod"

export const signInSchema = z.object({
    identifier: z.string().min(2, "Email/Username is invalid"),
    password: z.string().min(1, "Password is required")
})