import { FC, PropsWithChildren } from "react";

interface Props {
    onClick?: () => void;
    disabled?: boolean;
    theme?: keyof typeof themes;
    className?: string;
    onMouseDown?: (e: React.MouseEvent) => void;
}

const themes = {
    primary: "bg-primary text-white",
    primaryOutline: "bg-transparent text-primary border border-primary enabled:hover:bg-primary enabled:hover:text-white",
    danger: "bg-danger text-white",
    secondary: "bg-secondary text-white",
};

const Button: FC<PropsWithChildren<Props>> = ({
    onClick,
    disabled = false,
    theme = "primary",
    className = "",
    children,
    onMouseDown,
}) => {
    return (
        <button
            onClick={onClick}
            className={`${themes[theme]} ${className} rounded-md shadow-md duration-300 enabled:hover:brightness-110 disabled:opacity-50`}
            disabled={disabled}
            onMouseDown={onMouseDown}
        >
            {children}
        </button>
    );
};

export default Button;
