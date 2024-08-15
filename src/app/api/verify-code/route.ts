import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { sendResponse } from "@/utils/sendResponse";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";
import { verifyCodeSchema } from "@/schemas/verifyCodeSchema";

const verifyUserSchema = z.object({
  username: usernameValidation,
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email" }),
  code: verifyCodeSchema,
});

export async function POST(request: Request) {
  await dbConnect();
  try {
    const data = await request.json();
    const query = {
      username: data.username,
      email: data.email,
      code: data.code,
    };
    const result = verifyUserSchema.safeParse(query);
    if (!result.success) {
      const validationErrors =
        result.error.format().username?._errors ||
        result.error.format().code?._errors ||
        result.error.format().email?._errors ||
        [];
      return sendResponse(
        false,
        validationErrors.join(", ") || "Invalid details in verifying",
        400
      );
    }

    const { username, code, email } = result.data;
    const user = await UserModel.findOne({ username, email });
    if (!user) {
      return sendResponse(false, "User not found", 404);
    }
    if (user.isVerified) {
      return sendResponse(false, "User already verified", 409);
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isCodeValid && isCodeNotExpired) {
      (user.isVerified = true), user.save();
      return sendResponse(true, "User verified!", 200);
    } else if (!isCodeNotExpired) {
      return sendResponse(false, "Verify Code Expired", 400);
    }
    return sendResponse(false, "Invalid Code", 400);
  } catch (error) {
    console.error("Error is verifying user: ", error);
    return sendResponse(false, "Error is verifying user", 500);
  }
}
