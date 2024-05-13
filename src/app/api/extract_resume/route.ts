import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    return NextResponse.json(
        { hi: "ok" },
        {
            status: 200,
        }
    );
}
