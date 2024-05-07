import DOMPurify from "isomorphic-dompurify";

export const sanitizeHtml = (html: string) => {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ["b", "i", "u"],
    });
};
