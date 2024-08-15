import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import UserModel from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { sendResponse } from "@/utils/sendResponse";

export async function POST(request: Request){
    const {acceptMessages} = await request.json()
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User
    if(!session || !session.user){
        sendResponse(false, "Not authenticated", 401)
    }
    const userId = user?._id;
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: acceptMessages},
            {new: true}
        )
        if(!updatedUser){
            return sendResponse(false, "User not found", 404)
        }
        return sendResponse(true, "Message acceptance status change", 200)
    } catch (error) {
        
    }
}
export async function GET(request: Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if(!session || !session.user){
        return Response.json(
            {success: false, message: "Not authenticated"},
            {status: 401}
        )
    }

    const userId = user?._id;
    try {
        const foundUser = await UserModel.findById(userId)
        if(!foundUser){
            return sendResponse(false, "User not found", 404)

        }
        return sendResponse(true, "Status fetched", 200, foundUser.isAcceptingMessage)
        
    } catch (error) {
        console.error("Failed to get user status")
        return sendResponse(false, "Failed to get user status", 500)

    }
}