import { sanitizeHtml } from "@/utils/sanitizeHtml";

const heading = (text: string) =>
    `<h1 class="heading">${sanitizeHtml(text)}</h1>`;
export default heading;
