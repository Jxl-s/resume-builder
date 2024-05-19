import { NextRequest } from "next/server";
import { z } from "zod";
import { BaseController } from "./BaseController";
import { importPrompt } from "@/utils/server/prompts";
import { promptMetaLlama } from "@/utils/server/prompt_llm";

const exportSchema = z.object({
    resume: z.string(),
});

// would be so much better if i used OpenAI
export const ResumeController = {
    async importResume(req: NextRequest) {
        const body = await req.text();

        // Make the prompt
        let prompt = importPrompt;
        prompt = prompt.replace("__RESUME_TEXT__", body);

        const response = await promptMetaLlama({
            message: prompt,
        });

        return BaseController.makeSuccess(200, JSON.parse(response));
    },
    async exportResume(req: NextRequest) {
        const data = BaseController.checkSchema(exportSchema, await req.json());
        if (!data) {
            return BaseController.makeStatus(400, "Invalid data");
        }
    },
};
