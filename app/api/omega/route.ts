import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are JARVIS OMEGA, a highly advanced, cinematic, and helpful AI assistant created by Niloy Kar. Respond in a confident, futuristic style."
        },
        {
          role: "user",
          content: text
        }
      ],
      model: "llama3-70b-8192",
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json({ response });

  } catch (error) {
    return NextResponse.json({ 
      response: "Sorry, I'm having trouble connecting to my brain right now." 
    }, { status: 500 });
  }
}