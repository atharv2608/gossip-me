// utils/apiResponse.ts

import { Message } from "postcss";

export function sendResponse(
  success: boolean,
  message: string,
  statusCode: number = success ? 200 : 400, // Default status code
  isAcceptingMessages?: boolean,
  messages?: Array<Message>
) {
  return new Response(
    JSON.stringify({ success, message, isAcceptingMessages, messages }),
    {
      status: statusCode,
    }
  );
}
