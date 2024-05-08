import { FC, PropsWithChildren } from "react";
import EditableHeading from "./EditableHeading";

interface SectionProps {
    title: string;
    setTitle: (title: string) => void;
}

const Section: FC<PropsWithChildren<SectionProps>> = ({
    title,
    setTitle,
    children,
}) => {
    return (
        <section>
            <EditableHeading content={title} setContent={setTitle} />
            {children}
        </section>
    );
};

export default Section;
