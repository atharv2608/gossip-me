import {z} from 'zod'

export const messageSchema = z.object({
    content: z.string().min(10, "Too short message").max(300, "Message too long")
})