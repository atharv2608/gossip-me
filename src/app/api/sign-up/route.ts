import dbConnect from "@/lib/dbConnect";
import { sendVerificationOTP } from "@/lib/sendEmail";
import UserModel from "@/models/User";
import { sendResponse } from "@/utils/sendResponse";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return sendResponse(false, "Username is taken", 409);
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return sendResponse(false, "User with same email exists", 409);
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.username = username;
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }
    const emailResponse = await sendVerificationOTP(username, email, verifyCode);
    console.log("Email response: ", emailResponse);
    
    if (!emailResponse.success) {
      return sendResponse(false, "Failed to send verification email", 500);
    }

    return sendResponse(true, "User registered, Please verify your email", 201);
  } catch (error) {
    return sendResponse(false, "Failed to signup", 500);
  }
}
