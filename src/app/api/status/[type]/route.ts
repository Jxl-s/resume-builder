import { BaseController } from "@/app_server/controllers/BaseController";
import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { type: string } }
) {
    if (params.type === "ai") {
        const res = await fetch(process.env.META_HOST + "/status");
        console.log(res);
        return BaseController.makeSuccess(
            res.status,
            res.status === 200 ? "Online" : "Offline"
        );
    }
}
