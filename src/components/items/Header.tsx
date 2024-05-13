import { FC, useEffect, useState } from "react";
import EditableItem from "../EditableItem";
import useDocSettingsStore from "@/stores/useDocSettingsStore";
import useResumeEditorStore from "@/stores/useResumeEditorStore";

const Header: FC = () => {
    const [didMount, setDidMount] = useState(false);
    useEffect(() => {
        setDidMount(true);
    }, []);

    const titleSize = useDocSettingsStore((state) => state.titleSize);
    const contentSize = useDocSettingsStore((state) => state.contentSize);

    const header = useResumeEditorStore((state) => state.header);
    const setHeader = useResumeEditorStore((state) => state.setHeader);

    const { name, subtitle, contact } = header;

    const setName = (name: string) => setHeader({ ...header, name });
    const setSubtitle = (subtitle: string) => setHeader({ ...header, subtitle });
    const setContact = (contact: string) => setHeader({ ...header, contact });

    useEffect(() => {
        const savedHeader = window.localStorage.getItem("header");
        if (savedHeader) {
            setHeader(JSON.parse(savedHeader));
        }
    }, [setHeader]);

    useEffect(() => {
        if (didMount) {
            window.localStorage.setItem("header", JSON.stringify(header));
        }
    }, [header, didMount]);

    return (
        <>
            <EditableItem
                content={name}
                setContent={setName}
                Component={"span"}
                defaultStyle={["bold"]}
                className="text-center block"
                fontSize={titleSize}
                style={{
                    lineHeight: (titleSize * 1.1) + "pt",
                }}
            />
            <EditableItem
                content={subtitle}
                setContent={setSubtitle}
                Component={"span"}
                defaultStyle={["italic"]}
                className="text-center block"
                fontSize={contentSize}
            />
            <EditableItem
                content={contact}
                setContent={setContact}
                Component={"span"}
                className="text-center block mb-2"
                fontSize={contentSize}
            />
        </>
    );
};

export default Header;
