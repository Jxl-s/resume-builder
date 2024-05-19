import { BaseController } from "@/app_server/controllers/BaseController";
import { BulletsController } from "@/app_server/controllers/BulletsController";
import { NextRequest } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: { action: string } }
) {
    if (params.action === "enhance") {
        return BulletsController.enhanceBullets(request);
    }

    if (params.action === "generate") {
        return BulletsController.generateBullets(request);
    }

    return BaseController.makeStatus(400, "Invalid action");
}
