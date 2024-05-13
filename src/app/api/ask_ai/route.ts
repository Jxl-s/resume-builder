// app/api/route.js 👈🏽
import { Ollama } from "ollama";
import { NextResponse } from "next/server";

const ollama = new Ollama({ host: process.env.OLLAMA_HOST });

export async function GET() {
    const response = await ollama.chat({
        model: process.env.OLLAMA_MODEL as string,
        messages: [{ role: "user", content: "Why is the sky blue?" }],
    });

    return NextResponse.json(response, { status: 200 });
}
