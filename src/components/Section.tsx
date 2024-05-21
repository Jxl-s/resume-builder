import { FC, PropsWithChildren, useContext, createContext } from "react";
import EditableHeading from "./editable/EditableHeading";

interface SectionProps {
    sectionId: string;
    title: string;
    setTitle: (title: string) => void;
}

const SectionContext = createContext({
    sectionId: "",
});

const Section: FC<PropsWithChildren<SectionProps>> = ({
    sectionId,
    title,
    setTitle,
    children,
}) => {
    return (
        <SectionContext.Provider value={{ sectionId }}>
            <section className="mb-2">
                <EditableHeading content={title} setContent={setTitle} />
                {children}
            </section>
        </SectionContext.Provider>
    );
};

const useSection = () => {
    const context = useContext(SectionContext);
    if (!context) {
        throw new Error("Option should be used inside Select");
    }

    return context;
};

export default Section;
export { useSection };
