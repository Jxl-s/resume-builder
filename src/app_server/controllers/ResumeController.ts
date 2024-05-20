import { NextRequest } from "next/server";
import { z } from "zod";
import { BaseController } from "./BaseController";
import { importPrompt } from "@/utils/server/prompts";
import { promptMetaLlama } from "@/utils/server/prompt_llm";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import pdfParse from "pdf-parse";

const exportSchema = z.object({
    resume: z.string(),
});

// would be so much better if i used OpenAI
export const ResumeController = {
    async importResume(req: NextRequest) {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        if (file.type !== "application/pdf") {
            return BaseController.makeStatus(400, "Invalid file type");
        }

        // Write file to folder
        const uuid = uuidv4();
        const outputPath = path.join(
            process.cwd(),
            "resume_pdf/imports",
            `${uuid}.pdf`
        );

        fs.writeFileSync(outputPath, buffer);

        // Process the written PDF
        const fileBuffer = fs.readFileSync(outputPath);
        let text = "";
        try {
            const data = await pdfParse(fileBuffer);
            text = data.text;
        } catch (e) {
            console.error(e);
            return BaseController.makeStatus(500, "Failed to parse PDF");
        }

        // Make the prompt
        let prompt = importPrompt;
        prompt = prompt.replace("__RESUME_TEXT__", text);

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
