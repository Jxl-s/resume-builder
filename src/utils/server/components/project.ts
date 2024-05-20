import { sanitizeHtml } from "@/utils/sanitizeHtml";

interface Props {
    name: string;
    technologies: string;
    dates: string;
    source: string;
    demo: string;
    description: string[];
    hideLinks?: boolean;
}

export const project = ({
    name,
    technologies,
    dates,
    source,
    demo,
    description,
    hideLinks = false,
}: Props) => `
<article>
    <div class="twoSide">
        <div class="project-left">
            ${sanitizeHtml(name)}
            <span style="margin: 0 0.25rem 0 0.25rem">|</span>
            ${sanitizeHtml(technologies)}
        </div>
        <div>${sanitizeHtml(dates)}</div>
    </div>
    ${
        !hideLinks
            ? `<div class="twoSide">
            <div>${sanitizeHtml(source ?? "<i>Source Unavailable</i>")}</div>
            <div>${sanitizeHtml(demo ?? "<i>Source Unavailable</i>")}</div>
        </div>`
            : ""
    }
    <div style="padding-left: 0.625rem">
        <ul>
            ${description
                .map((desc) => `<li>${sanitizeHtml(desc)}</li>`)
                .join("")}
        </ul>
    </div>
</article>
`;
