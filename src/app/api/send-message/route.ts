import { Message } from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { sendResponse } from "@/utils/sendResponse";
export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return sendResponse(false, "User not found", 404);
    }
    if (!user.isAcceptingMessage) {
      return sendResponse(false, "User not accepting messsages", 403);
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();
    return sendResponse(true, "Message sent successfully", 200);
  } catch (error) {
    console.error("Error sending message: ", error);
    return sendResponse(false, "Failed to send message", 500);
  }
}
