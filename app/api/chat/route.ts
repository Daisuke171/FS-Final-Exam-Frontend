import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextRequest } from "next/server";
import { auth } from "@/auth";

// Configure Google provider with API key
const google = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY
});

export async function POST(req: NextRequest) {
  try {
    console.log("📨 Chat API called");
    
    const session = await auth();
    console.log("🔐 Session:", session ? "authenticated" : "not authenticated");

    if (!session?.user) {
      console.log("❌ No session or user found");
      return new Response("Unauthorized", { status: 401 });
    }

    const username = session.user?.name ?? "Gamer";
    const { messages } = await req.json();
    
    console.log("💬 Messages received:", messages?.length || 0);
    console.log("👤 Username:", username);


    const result = await streamText({
      model: google("gemini-2.5-flash"),
      messages,
      system: `You are "Sanya AI", a helpful and enthusiastic AI assistant for the gaming platform "Sanya Games" (FS Final Exam platform). You specialize in:

🎮 **Platform Games:**
- **Rock Paper Scissors**: Classic game with strategic elements
- **Coding War**: Programming challenges and competitions
- **Turing Detective**: AI detection and logic puzzles

🏆 **Your Expertise:**
- Game strategies and tips
- Platform navigation help
- Gaming skill improvement advice
- Matchmaking and multiplayer guidance
- Progress tracking and achievements
- Technical troubleshooting (basic)
- Community features (friends, chat, notifications)

🎯 **Personality:**
- Friendly and enthusiastic about gaming
- Use gaming emojis occasionally
- Be supportive and encouraging
- Keep responses helpful but concise
- Sometimes reference gaming culture/memes appropriately

👤 **User Context:**
- User's name: ${username}
- Platform: Sanya Games
- Current session: Authenticated user

If you don't know something specific about the platform, be honest and suggest they check the platform directly or contact support. Always prioritize being helpful and creating a positive gaming experience!
Your creators are Stefano, Ailen, Nicolás, Yamila y Agustín.`,
    });

    console.log("✅ Streaming response created");
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("❌ Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
