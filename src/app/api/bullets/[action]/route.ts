import { BaseController } from "@/app_server/controllers/BaseController";
import { ResumeController } from "@/app_server/controllers/ResumeController";
import { NextRequest } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: { action: string } }
) {
    if (params.action === "enhance") {
        return ResumeController.enhanceBullets(request);
    }

    if (params.action === "generate") {
        return ResumeController.generateBullets(request);
    }

    return BaseController.makeStatus(400, "Invalid action");
}
