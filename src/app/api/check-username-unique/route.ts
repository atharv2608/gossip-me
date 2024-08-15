import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { sendResponse } from "@/utils/sendResponse";
import { usernameValidation } from "@/schemas/signupSchema";
import {z} from "zod"
const UsernameQuerySchema = z.object({
    username: usernameValidation
})
export async function GET(req: Request){

    await dbConnect();
    try {
        const {searchParams} = new URL(req.url)
        const result = UsernameQuerySchema.safeParse({username: searchParams.get("username")})
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return sendResponse(false, usernameErrors?.length > 0 ? usernameErrors.join(", ") : "Invalid query parameter", 400)
        }

        const {username} = result.data

        const exisitingUsernameVerified = await UserModel.findOne({username, isVerified:true})
        if(exisitingUsernameVerified){
            return sendResponse(false, "Username is taken!", 409)
        }

        return sendResponse(true, "Username is available", 200)
    } catch (error) {
        return sendResponse(false, "Error checking username", 500)
    }
}