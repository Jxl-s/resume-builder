import { sanitizeHtml } from "@/utils/sanitizeHtml";

interface Props {
    school: string;
    date: string;
    degree: string;
    location: string;
}

const education = ({ school, date, degree, location }: Props) => `
<article>
    <div class="twoSide">
        <div>${sanitizeHtml(school)}</div>
        <div>${sanitizeHtml(date)}</div>
    </div>
    <div class="twoSide">
        <div>${sanitizeHtml(degree)}</div>
        <div>${sanitizeHtml(location)}</div>
    </div>
</article>`;

export default education;
