import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Convert messages to the format expected by the AI SDK
  const formattedMessages = messages.map((message: { role: string; content: string }) => ({
    role: message.role,
    content: message.content,
  }))

  const result = streamText({
    model: openai("gpt-4o"),
    messages: formattedMessages,
  })

  return result.toDataStreamResponse()
}
