import { sanitizeHtml } from "@/utils/sanitizeHtml";

const heading = (text: string) =>
    `<div class="heading">${sanitizeHtml(text)}</div>`;
export default heading;
