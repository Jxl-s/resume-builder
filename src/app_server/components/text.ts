import { sanitizeHtml } from "@/utils/sanitizeHtml";

const text = (text: string) => `<article>
    ${sanitizeHtml(text, true)}
</article>`;

export default text;
