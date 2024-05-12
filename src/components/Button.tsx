import { FC, PropsWithChildren } from "react";

interface Props {
    onClick?: () => void;
    theme?: keyof typeof themes;
    className?: string;
}

const themes = {
    primary: "bg-primary text-white",
    danger: "bg-danger text-white",
};

const Button: FC<PropsWithChildren<Props>> = ({
    onClick,
    theme = "primary",
    className = "",
    children,
}) => {
    return (
        <button
            onClick={onClick}
            className={`${themes[theme]} ${className} rounded-md shadow-md hover:brightness-110 duration-300`}
        >
            {children}
        </button>
    );
};

export default Button;
