import { sanitizeHtml } from "@/utils/sanitizeHtml";

export const heading = (text: string) =>
    `<h1 class="heading">${sanitizeHtml(text)}</h1>`;
