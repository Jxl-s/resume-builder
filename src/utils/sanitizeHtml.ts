import DOMPurify from "isomorphic-dompurify";

export const sanitizeHtml = (html: string, allowBr = false) => {
    const allowedTags = ["b", "i", "u", "br"];
    if (!allowBr) {
        allowedTags.splice(allowedTags.indexOf("br"), 1);
    }
    console.log(html, allowedTags);
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: allowedTags,
    });
};
