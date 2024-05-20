import { sanitizeHtml } from "@/utils/sanitizeHtml";

export const text = (text: string) => `<article>
    ${sanitizeHtml(text, true)}
</article>`;
