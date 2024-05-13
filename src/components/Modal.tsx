import { FC, PropsWithChildren } from "react";
import { FaX } from "react-icons/fa6";

interface Props {
    title: string;
    visible: boolean;
    onClose: () => void;
}

const Modal: FC<PropsWithChildren<Props>> = ({
    title,
    visible,
    onClose,
    children,
}) => {
    return (
        visible && (
            <div
                className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center z-20 print:hidden"
                onClick={onClose}
            >
                <div
                    className="bg-dark2 max-w-lg text-white p-4 rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                >
                    <p className="border-b border-white mb-2 font-semibold flex items-center justify-between">
                        {title}
                        <FaX
                            className="w-3 h-3 text-danger hover:brightness-150 duration-300 cursor-pointer"
                            onClick={onClose}
                        />
                    </p>
                    {children}
                </div>
            </div>
        )
    );
};

export default Modal;
