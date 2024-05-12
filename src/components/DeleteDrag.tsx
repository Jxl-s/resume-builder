import { FC, PropsWithChildren, useRef } from "react";
import { FaArrowDown, FaGripVertical, FaTrash } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa6";

interface Props {
    onDelete: () => void;
    onMoved: (i: "up" | "down") => void;
    className?: string;
    style?: React.CSSProperties;
}

const DeleteDrag: FC<PropsWithChildren<Props>> = ({
    onDelete,
    onMoved,
    className = "",
    style = {},
    children,
}) => {
    const articleRef = useRef<HTMLElement>(null);

    const handleTrashOver = () => {
        if (!articleRef.current) return;
        articleRef.current.style.backgroundColor = "rgb(178 77 77 / 0.2)";
    };

    const handleTrashLeave = () => {
        if (!articleRef.current) return;
        articleRef.current.style.backgroundColor = "white";
    };

    const handleGripOver = () => {
        if (!articleRef.current) return;
        articleRef.current.style.backgroundColor = "rgb(77 77 77 / 0.2)";
    };

    const handleGripLeave = () => {
        if (!articleRef.current) return;
        articleRef.current.style.backgroundColor = "white";
    };

    return (
        <article
            className={`relative ${className} duration-300`}
            style={style}
            ref={articleRef}
        >
            <FaTrash
                className="print:hidden w-3 h-3 absolute text-danger/50 hover:text-danger duration-300 cursor-pointer"
                onClick={onDelete}
                style={{
                    top: "50%",
                    transform: "translate(-1.25rem, -50%)",
                }}
                onMouseOver={handleTrashOver}
                onMouseLeave={handleTrashLeave}
            />
            <div
                className="print:hidden right-0 absolute duration-300 flex flex-col gap-1"
                style={{
                    top: "50%",
                    transform: "translate(1.25rem, -50%)",
                }}
            >
                <FaArrowUp
                    className="w-3 h-3 text-black/50 cursor-pointer hover:text-black duration-300"
                    onClick={() => onMoved("up")}
                    onMouseOver={handleGripOver}
                    onMouseLeave={handleGripLeave}
                />
                <FaArrowDown
                    className="w-3 h-3 text-black/50 cursor-pointer hover:text-black duration-300"
                    onClick={() => onMoved("down")}
                    onMouseOver={handleGripOver}
                    onMouseLeave={handleGripLeave}
                />
            </div>
            {/* <FaGripVertical
                className="print:hidden w-3 h-3 right-0 translate-x-5 absolute text-black/50 hover:text-black duration-300 cursor-grab"
                onClick={onMoved}
                style={{
                    top: "50%",
                    transform: "translate(1.25rem, -50%)",
                }}
                onMouseOver={handleGripOver}
                onMouseLeave={handleGripLeave}
            /> */}
            {children}
        </article>
    );
};

export default DeleteDrag;
