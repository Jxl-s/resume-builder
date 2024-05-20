import path from "path";
import fs from "fs";
import fonts from "@/app/fonts";
import { education, experience, heading, project, text } from "./components";
import { z } from "zod";

const pdfBase = fs.readFileSync(
    path.join(process.cwd(), "resume_pdf/pdf_base.html"),
    "utf8"
);

export const pdfSchema = z.object({
    header: z.object({
        name: z.string(),
        subtitle: z.string(),
        contact: z.string(),
    }),
    settings: z.object({
        // font: z.string(),
        font: z.enum(Object.keys(fonts) as [keyof typeof fonts]),
        titleSize: z.number(),
        headingSize: z.number(),
        contentSize: z.number(),
        marginTop: z.number(),
        marginBottom: z.number(),
        marginLeft: z.number(),
        marginRight: z.number(),
    }),
    sections: z.array(
        z.object({
            title: z.string(),
            items: z.array(
                z.object({
                    type: z.string(),
                    value: z.any(),
                })
            ),
        })
    ),
});

export function transformPdf(body: z.infer<typeof pdfSchema>) {
    let transformedPdf = pdfBase;
    // Transform the PDF
    transformedPdf = transformedPdf.replace("__NAME__", body.header.name);
    transformedPdf = transformedPdf.replace(
        "__SUBTITLE__",
        body.header.subtitle
    );
    transformedPdf = transformedPdf.replace("__CONTACT__", body.header.contact);

    // Settings
    const font = body.settings.font;
    transformedPdf = transformedPdf.replace(
        "__FONT_EXPORT__",
        fonts[font].export
    );
    transformedPdf = transformedPdf.replace(
        "__FONT_FAMILY__",
        fonts[font].display
    );

    transformedPdf = transformedPdf.replace(
        "__TITLE_SIZE__",
        body.settings.titleSize.toString()
    );

    transformedPdf = transformedPdf.replace(
        "__TITLE_HEIGHT__",
        ((body.settings.titleSize as number) * 1.1).toString()
    );

    transformedPdf = transformedPdf.replace(
        "__HEADING_SIZE__",
        body.settings.headingSize.toString()
    );

    transformedPdf = transformedPdf.replace(
        "__CONTENT_SIZE__",
        body.settings.contentSize.toString()
    );

    transformedPdf = transformedPdf.replace(
        "__MARGIN_TOP__",
        body.settings.marginTop.toString()
    );

    transformedPdf = transformedPdf.replace(
        "__MARGIN_BOTTOM__",
        body.settings.marginBottom.toString()
    );

    transformedPdf = transformedPdf.replace(
        "__MARGIN_LEFT__",
        body.settings.marginLeft.toString()
    );

    transformedPdf = transformedPdf.replace(
        "__MARGIN_RIGHT__",
        body.settings.marginRight.toString()
    );

    // Make the sections
    let sectionString = "";
    for (const section of body.sections) {
        sectionString += `<section>`;
        sectionString += heading(section.title);
        // Add the articles
        for (const item of section.items) {
            if (item.type === "education") {
                sectionString += education(item.value);
            }

            if (item.type === "experience") {
                sectionString += experience(item.value);
            }

            if (item.type === "project") {
                sectionString += project(item.value);
            }

            if (item.type === "project-nolinks") {
                sectionString += project({ ...item.value, hideLinks: true });
            }

            if (item.type === "text") {
                sectionString += text(item.value.text);
            }
        }

        sectionString += `</section>`;
    }

    transformedPdf = transformedPdf.replace("__SECTIONS__", sectionString);
    return transformedPdf;
}
