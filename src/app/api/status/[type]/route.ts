import { BaseController } from "@/app_server/controllers/BaseController";
import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { type: string } }
) {
    if (params.type === "ai") {
        try {
            const res = await fetch(process.env.META_HOST + "/status");
            return BaseController.makeSuccess(
                res.status,
                res.status === 200 ? "Online" : "Offline"
            );
        } catch (e) {
            return BaseController.makeStatus(500, "Offline");
        }
    }
}
