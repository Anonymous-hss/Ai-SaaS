import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage } from "openai";
const OpenAI = require("openai").default;

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const instructionMessage: ChatCompletionRequestMessage = {
  role: "system",
  content:
    "You are a code generator, You must answer only in markdown code snippets. Use code comments for explaination.",
};

export default async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    console.log("Request Payload:", messages);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("OpenAIAPI key not configured", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired.", { status: 403 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [instructionMessage, ...messages],
    });

    if (!isPro) {
      await increaseApiLimit();
    }
    console.log("OpenAI Response:", response);

    if (!response.choices || response.choices.length === 0) {
      return new NextResponse("No response from OpenAI", { status: 500 });
    }

    const recommendation = response.choices[0].message;

    console.log("Recommendation:", recommendation);

    return NextResponse.json(recommendation);
  } catch (error) {
    console.error("[CODE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
