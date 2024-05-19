import { ResumeController } from "@/app_server/controllers/ResumeController";
import { NextRequest } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: { action: string } }
) {
    if (params.action === "import") {
        return ResumeController.importResume(request);
    }

    if (params.action === "export") {
        return ResumeController.exportResume(request);
    }
}
