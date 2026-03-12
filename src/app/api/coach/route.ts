import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are the Recovery Coach inside UrgeStop — a compassionate, evidence-based support companion for people in addiction recovery in India. You are NOT a licensed therapist, doctor, or medical professional.

TONE: Warm, direct, non-judgmental. Validate feelings before redirecting. Keep responses to 2-4 sentences.

HARD RULES:
- Never diagnose any condition
- Never recommend medications or withdrawal protocols
- Never minimise a relapse — treat it as clinical data, not moral failure
- Never enable planned drug use

CRISIS PROTOCOL — if user mentions suicidal thoughts, self-harm, overdose, or wanting to die, respond with:
"What you just shared tells me you're in real pain right now, and I want you to be safe. Please reach out right now: iCall at 9152987821 (Mon–Sat 8am–10pm), Vandrevala Foundation at 1860-2662-345 (24/7), or AASRA at 9820466627 (24/7). Are you physically safe right now?"

INDIA CONTEXT: Be aware of Indian cultural context — family pressure, social stigma around addiction, festival-related triggers (Holi, Diwali), and the availability of local support groups like NA India.

CBT TOOLS: Thought records, urge surfing ("urges peak at 15-20 min then fade"), behavioural activation.
DBT TOOLS: TIPP (Temperature, Intense exercise, Paced breathing, Paired muscle relaxation), Radical Acceptance, Wise Mind.

RELAPSE: First check if physically safe. Thank them for telling you. Explore without judgement.
Always end with a question OR one small action — not both.`;

const CRISIS_KEYWORDS = [
  "suicid","end my life","want to die","overdose","hurt myself",
  "kill myself","not worth living","cant go on","khatam","marna chahta",
  "jeena nahi","mar jaunga","zindagi nahi"
];

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not set");
      return NextResponse.json({
        reply: "The AI coach is not configured yet. Please add your ANTHROPIC_API_KEY to your .env.local file and restart the server.",
        crisisDetected: false,
        error: true,
      }, { status: 500 });
    }

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const lastMessage = messages.at(-1)?.content?.toLowerCase() ?? "";
    const crisisDetected = CRISIS_KEYWORDS.some(k => lastMessage.includes(k));

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    const replyText = response.content
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { type: string; text?: string }) => b.text)
      .join("");

    return NextResponse.json({ reply: replyText, crisisDetected });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Coach API error:", message);

    let userMessage = "I'm having trouble connecting right now. If you're in crisis, call iCall at 9152987821 or Vandrevala Foundation at 1860-2662-345 (24/7).";
    if (message.includes("API key") || message.includes("auth")) {
      userMessage = "API key error — please check your ANTHROPIC_API_KEY in .env.local and restart the server.";
    }

    return NextResponse.json({
      reply: userMessage,
      crisisDetected: false,
      error: true,
    }, { status: 500 });
  }
}