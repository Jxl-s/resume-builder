import { Ollama } from "ollama";

const USE_WHICH: "ollama" | "meta" = "meta";
const promptMetaLlama = async ({ message }: { message: string }) => {
    console.log(message);

    const response = await fetch(process.env.META_HOST + "/prompt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message,
        }),
    });

    const resJson = (await response.json()) as { message: string };
    return resJson.message;
};

const ollama = new Ollama({ host: process.env.OLLAMA_HOST });

const promptLlama = async ({ message }: { message: string }) => {
    const response = await ollama.chat({
        model: process.env.OLLAMA_MODEL as string,
        messages: [
            {
                role: "user",
                content: message,
            },
        ],
    });

    return response.message.content;
};

export const promptLLM = async ({ message }: { message: string }) => {
    if (USE_WHICH === "meta") {
        return promptMetaLlama({ message });
    } else if (USE_WHICH === "ollama") {
        return promptLlama({ message });
    }

    return "";
};
