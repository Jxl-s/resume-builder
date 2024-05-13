import DOMPurify from "isomorphic-dompurify";

export const sanitizeHtml = (html: string, allowBr = false) => {
    const allowedTags = ["b", "i", "u", "a", "br"];
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

export const validateLink = (url: string) => {
    var pattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
            "(\\#[-a-z\\d_]*)?$",
        "i"
    );

    return !!pattern.test(url);
};

export const validateMailto = (url: string) => {
    var pattern = new RegExp(
        "^(mailto:)?[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
        "i"
    );

    return !!pattern.test(url);
};
//