import DOMPurify from "isomorphic-dompurify";

export const sanitizeHtml = (html: string, allowBr = false) => {
    const allowedTags = ["b", "i", "u", "br"];
    if (!allowBr) {
        allowedTags.splice(allowedTags.indexOf("br"), 1);
    }

    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: allowedTags,
    }).trim();
};

export const removeTags = (html: string) => {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [],
    }).trim();
};
