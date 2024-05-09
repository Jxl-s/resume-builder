import { FC, PropsWithChildren, useRef } from "react";
import { FaGripVertical, FaTrash } from "react-icons/fa";

interface Props {
    onDelete: () => void;
    onMoved: (i: number) => void;
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
    }

    const handleGripLeave = () => {
        if (!articleRef.current) return;
        articleRef.current.style.backgroundColor = "white";
    }

    return (
        <article
            className={`relative ${className} duration-300`}
            style={style}
            ref={articleRef}
        >
            <FaTrash
                className="w-3 h-3 absolute text-danger/50 hover:text-danger duration-300 cursor-pointer"
                onClick={onDelete}
                style={{
                    top: "50%",
                    transform: "translate(-1.25rem, -50%)",
                }}
                onMouseOver={handleTrashOver}
                onMouseLeave={handleTrashLeave}
            />
            <FaGripVertical
                className="w-3 h-3 right-0 translate-x-5 absolute text-black/50 hover:text-black duration-300 cursor-pointer"
                onClick={onDelete}
                style={{
                    top: "50%",
                    transform: "translate(1.25rem, -50%)",
                }}
                onMouseOver={handleGripOver}
                onMouseLeave={handleGripLeave}
            />
            {children}
        </article>
    );
};

export default DeleteDrag;
