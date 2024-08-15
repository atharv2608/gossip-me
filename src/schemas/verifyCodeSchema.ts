import {z} from "zod"
export const verifyCodeSchema = z.string().length(6, "verification code must be of 6 digits")