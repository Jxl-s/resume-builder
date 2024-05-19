import { NextRequest } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: { action: string } }
) {
    if (params.action === "import") {
    }
    if (params.action === "export") {
    }
}
