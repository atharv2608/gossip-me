import nodemailer from "nodemailer"
import { usernameValidation } from "@/schemas/signupSchema"
import { verifyCodeSchema } from "@/schemas/verifyCodeSchema"
import {z} from "zod"
export const sendVerificationOTP = async (username: string, email: string, code: string ) :  Promise<{ success: boolean }>=>{
    const verifyDataSchema = z.object({
        username: usernameValidation,
        email: z.string().email({message: "Invalid Email"}),
        code: verifyCodeSchema
    })

    const parsedResult = verifyDataSchema.safeParse({
        username: username,
        email: email,
        code: code
    })

    if(!parsedResult.success){
        return{success: false};
    }

    const uname = parsedResult.data.username;
    const mail = parsedResult.data.email;
    const otp = parsedResult.data.code;
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const mailOptions = {
        from: "Gossip Me! | Verification Code",
        to: mail,
        subject: `Verify Your Account with This Code`,
        html: `Hi ${uname}, <br>
             <p>Thank you for signing up with Anonymous feedback! Please use the verification code below to complete your registration:</p>
            <div class="code"><b>${otp}</b></div>
            <p>If you didn't request this code, please ignore this email.</p>
        `

    }
    try {
        await transport.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error("Error sending verification email", error);
        return { success: false };
    }
}