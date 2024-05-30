import fonts, { defaultFont } from "@/app/fonts";
import { validateLink } from "@/utils/sanitizeHtml";
import { FC, useEffect, useRef, useState } from "react";
import {
    FaPenToSquare,
    FaX,
    FaEraser,
    FaCheck,
    FaXmark,
} from "react-icons/fa6";

const TooltipsLink: FC<{
    resumeContainerRef: React.RefObject<HTMLDivElement>;
}> = ({ resumeContainerRef }) => {
    const linkEditorRef = useRef<HTMLDivElement>(null);
    const [linkEditorValue, setLinkEditorValue] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [lastAnchor, setLastAnchor] = useState<HTMLAnchorElement | null>(
        null
    );

    useEffect(() => {
        // When we focus on an anchor tag, we want to show the URL in the bottom left
        if (!linkEditorRef.current) return;
        if (!resumeContainerRef.current) return;

        const linkEditor = linkEditorRef.current;
        const resumeContainer = resumeContainerRef.current;

        // When a <a> is hovered, we want to show the URL in the bottom left
        const onResumeOver = (e: MouseEvent) => {
            if (isEditing) return;
            if (e.target instanceof HTMLAnchorElement) {
                setLinkEditorValue(e.target.href);

                // make the link editor go under the cursor
                const rect = e.target.getBoundingClientRect();
                linkEditor.style.left = rect.left + "px";
                linkEditor.style.top = rect.bottom + "px";
                linkEditor.style.display = "flex";

                setLastAnchor(e.target);
            }
        };

        const onResumeOut = (e: MouseEvent) => {
            if (isEditing) return;
            if (e.target === lastAnchor) {
                const linkEditorBox = linkEditor.getBoundingClientRect();
                const insideLinkEditor =
                    e.clientX >= linkEditorBox.left &&
                    e.clientX <= linkEditorBox.right &&
                    e.clientY >= linkEditorBox.top &&
                    e.clientY <= linkEditorBox.bottom;

                if (!insideLinkEditor) {
                    linkEditor.style.display = "none";
                    setLastAnchor(null);
                }
            }
        };

        const onEditorLeave = (e: MouseEvent) => {
            if (!lastAnchor) return;
            if (isEditing) return;
            const anchorBox = lastAnchor.getBoundingClientRect();
            const insideAnchor =
                e.clientX >= anchorBox.left &&
                e.clientX <= anchorBox.right &&
                e.clientY >= anchorBox.top &&
                e.clientY <= anchorBox.bottom;

            if (!insideAnchor) {
                linkEditor.style.display = "none";
                setLastAnchor(null);
            }
        };
        resumeContainer.addEventListener("mouseover", onResumeOver);
        resumeContainer.addEventListener("mouseout", onResumeOut);
        linkEditor.addEventListener("mouseleave", onEditorLeave);

        return () => {
            resumeContainer.removeEventListener("mouseover", onResumeOver);
            resumeContainer.removeEventListener("mouseout", onResumeOut);
            linkEditor.removeEventListener("mouseleave", onEditorLeave);
        };
    }, [linkEditorRef, resumeContainerRef, lastAnchor, isEditing]);

    const handleEdit = () => {
        setIsEditing(false);
        if (!lastAnchor) return;

        lastAnchor.setAttribute("href", linkEditorValue);

        // Hide the link editor
        if (linkEditorRef.current) {
            linkEditorRef.current.style.display = "none";
        }

        // find first parent with contenteditable
        let parent = lastAnchor.parentElement;
        while (parent && !parent.getAttribute("contenteditable")) {
            parent = parent.parentElement;
        }

        if (parent) {
            parent.focus();
            setTimeout(() => parent.blur(), 10);
        }

        setLastAnchor(null);
    };

    const handleErase = () => {
        if (!lastAnchor) return;
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        // Remove the anchor, replace it with the text inside
        lastAnchor.removeAttribute("href");

        const text = document.createTextNode(lastAnchor.innerText);
        lastAnchor.parentElement?.replaceChild(text, lastAnchor);

        // Hide the link editor
        if (linkEditorRef.current) {
            linkEditorRef.current.style.display = "none";
        }

        // find first parent with contenteditable
        let parent = text.parentElement;
        while (parent && !parent.getAttribute("contenteditable")) {
            parent = parent.parentElement;
        }

        if (parent) {
            parent.focus();
            setTimeout(() => parent.blur(), 10);
        }

        setLastAnchor(null);
    };

    const handleExit = () => {
        setLastAnchor(null);
        setIsEditing(false);

        if (linkEditorRef.current) {
            linkEditorRef.current.style.display = "none";
        }
    };

    return (
        <div
            ref={linkEditorRef}
            className="fixed print:hidden rounded-md bg-black/75 text-white p-2 z-10 flex items-center gap-2 text-xs"
            style={{
                display: "none",
                ...defaultFont.style,
            }}
        >
            <input
                value={linkEditorValue}
                onChange={(e) => setLinkEditorValue(e.target.value)}
                className={`bg-transparent w-full ${
                    isEditing ? "text-yellow-200" : "text-white"
                }`}
                readOnly={!isEditing}
                disabled={!isEditing}
            />
            {isEditing ? (
                <>
                    <FaCheck
                        className={`w-5 h-5 text-primary  hover:brightness-125 duration-300 ${
                            validateLink(linkEditorValue)
                                ? "cursor-pointer"
                                : "opacity-50"
                        }`}
                        onClick={handleEdit}
                        title="Save"
                    />
                    <FaXmark
                        className="w-5 h-5 text-danger cursor-pointer hover:brightness-125 duration-300"
                        onClick={handleExit}
                        title="Cancel"
                    />
                </>
            ) : (
                <>
                    <FaPenToSquare
                        className="w-5 h-5 text-primary cursor-pointer hover:brightness-125 duration-300"
                        onClick={() => setIsEditing(true)}
                        title="Edit"
                    />
                    <FaEraser
                        className="w-5 h-5 text-danger cursor-pointer hover:brightness-125 duration-300"
                        onClick={handleErase}
                        title="Delete"
                    />
                </>
            )}
        </div>
    );
};

export default TooltipsLink;
