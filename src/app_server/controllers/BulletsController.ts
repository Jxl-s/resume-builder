import { NextRequest } from "next/server";
import { z } from "zod";
import { BaseController } from "./BaseController";
import {
    generatePrompt,
    improvePrompt,
    jobDescriptionPrompt,
} from "@/utils/server/prompts";
import { promptLLM } from "@/utils/server/prompt_llm";

const enhanceBulletSchema = z.object({
    point: z.string(),
    header: z.string(),
    otherPoints: z.string(),
    job: z.string(),
    allPoints: z.string(),
});

const generateBulletSchema = z.object({
    header: z.string(),
    otherPoints: z.string(),
    job: z.string(),
    allPoints: z.string(),
});

export const BulletsController = {
    async enhanceBullets(req: NextRequest) {
        const data = BaseController.checkSchema(
            enhanceBulletSchema,
            await req.json()
        );
        if (!data) {
            return BaseController.makeStatus(400, "Invalid data");
        }

        // Build the prompt
        let prompt = improvePrompt;
        if (data.job.length > 0) {
            prompt = jobDescriptionPrompt + "\n\n" + prompt;
        }

        // Build the final prompt
        prompt = prompt
            .replace("__JOB_DESCRIPTION__", data.job)
            .replace("__BULLET_POINT__", data.point)
            .replace("__HEADER__", data.header)
            .replace("__OTHER_POINTS__", data.otherPoints)
            .replace("__OTHER_ITEMS_POINTS__", data.allPoints);

        const aiResponse = await promptLLM({
            message: prompt,
        });

        const responseLines = aiResponse
            .split("\n")
            .filter((line) => line.length > 0);

        if (responseLines[0] === "OK") {
            responseLines.shift();
            return BaseController.makeSuccess(200, responseLines);
        }

        return BaseController.makeStatus(500, "Error enhancing bullet points");
    },
    async generateBullets(req: NextRequest) {
        const data = BaseController.checkSchema(
            generateBulletSchema,
            await req.json()
        );
        if (!data) {
            return BaseController.makeStatus(400, "Invalid data");
        }

        // Build the prompt
        let prompt = generatePrompt;
        if (data.job.length > 0) {
            prompt = jobDescriptionPrompt + "\n\n" + prompt;
        }

        prompt = prompt
            .replace("__JOB_DESCRIPTION__", data.job)
            .replace("__HEADER__", data.header)
            .replace("__OTHER_POINTS__", data.otherPoints)
            .replace("__OTHER_ITEMS_POINTS__", data.allPoints);

        const aiResponse = await promptLLM({
            message: prompt,
        });

        const responseLines = aiResponse
            .split("\n")
            .filter((line) => line.length > 0);

        if (responseLines[0] === "OK") {
            responseLines.shift();
            return BaseController.makeSuccess(200, responseLines);
        }

        return BaseController.makeStatus(500, "Error generating bullet points");
    },
};
