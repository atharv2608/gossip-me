import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";
import { sendResponse } from "@/utils/sendResponse";

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return new Response(
            JSON.stringify({ success: false, message: "Not authenticated" }),
            { status: 401 }
        );
    }

    const userId = new mongoose.Types.ObjectId(user?._id);
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            {
                $addFields: {
                    messagesCount: { $size: "$messages" },
                },
            },
            {
                $match: {
                    messagesCount: { $gt: 0 },
                },
            },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            {
                $group: {
                    _id: "$_id",
                    messages: { $push: "$messages" },
                },
            },
        ]);

        if (!user || user.length === 0) {
            return sendResponse(false, "No Messages for you", 404)
            
        }
        return new Response(
            JSON.stringify({ success: true, messages: user[0].messages }),
            { status: 200 }
        );  
    } catch (error) {
        console.error("Error getting messages: ", error);
        return new Response(
            JSON.stringify({ success: false, message: "Error getting messages" }),
            { status: 500 }
        );
    }
}
