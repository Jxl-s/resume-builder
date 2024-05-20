import { sanitizeHtml } from "@/utils/sanitizeHtml";

interface Props {
    position: string;
    dates: string;
    company: string;
    location: string;
    description: string[];
}

const experience = ({
    position,
    dates,
    company,
    location,
    description,
}: Props) => `
<article>
    <div class="twoSide">
        <div>${sanitizeHtml(position)}</div>
        <div>${sanitizeHtml(dates)}</div>
    </div>
    <div class="twoSide">
        <div>${sanitizeHtml(company)}</div>
        <div>${sanitizeHtml(location)}</div>
    </div>
    <div style="padding-left: 0.625rem">
        <ul>
            ${description.map((desc) => `<li>${sanitizeHtml(desc)}</li>`).join("")}
        </ul>
    </div>
</article>
`;

export default experience;
