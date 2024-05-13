import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";

export async function POST(request: NextRequest) {
    const doc = new PDFDocument();

    return NextResponse.json(
        {
            hello: "yes",
        },
        {
            status: 200,
        }
    );
}
