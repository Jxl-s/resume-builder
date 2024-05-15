"use client";

import { FC, useEffect, useRef, useState } from "react";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { EducationItemWithId } from "../../components/items/Education";
import { ExperienceItemWithId } from "@/components/items/Experience";
import Section from "@/components/Section";
import { FaPlusCircle } from "react-icons/fa";
import Button from "@/components/Button";
import TextItem, { TextItemWithId } from "@/components/items/Text";
import { ProjectItemWithId } from "@/components/items/Project";
import EditableItem from "@/components/EditableItem";
import useDocSettingsStore from "@/stores/useDocSettingsStore";
import Header from "@/components/items/Header";
import useStylingStore from "@/stores/useStylingStore";
import Modal from "@/components/Modal";
import "./Editor.css";
import fonts from "../fonts";
import { loadState, saveState } from "@/utils/storage";

const Editor: FC = () => {
    const sections = useResumeEditorStore((state) => state.sections);
    const header = useResumeEditorStore((state) => state.header);

    const addSection = useResumeEditorStore((state) => state.addSection);
    const updateSection = useResumeEditorStore((state) => state.updateSection);
    const [mounted, setMounted] = useState(false);

    const font = useDocSettingsStore((state) => state.font);

    // spacing
    const spacing = useDocSettingsStore((state) => state.spacing);
    const multiplierUnit = useDocSettingsStore((state) => state.multiplierUnit);

    // get margins
    const marginTop = useDocSettingsStore((state) => state.marginTop);
    const marginBottom = useDocSettingsStore((state) => state.marginBottom);
    const marginLeft = useDocSettingsStore((state) => state.marginLeft);
    const marginRight = useDocSettingsStore((state) => state.marginRight);

    // get sizes
    const titleSize = useDocSettingsStore((state) => state.titleSize);
    const headingSize = useDocSettingsStore((state) => state.headingSize);
    const contentSize = useDocSettingsStore((state) => state.contentSize);

    // Initial load
    useEffect(() => {
        loadState();
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            saveState();
        }
    }, [
        sections,
        mounted,

        font,
        spacing,

        header,
        multiplierUnit,

        marginTop,
        marginBottom,
        marginLeft,
        marginRight,

        titleSize,
        headingSize,
        contentSize,
    ]);

    useEffect(() => {
        // Handler for the resize event
        function handleResize() {
            const desiredWidth = 1500; // Set this to your desired width
            const scaleFactor = window.innerWidth / desiredWidth;

            if (scaleFactor < 1) {
                // @ts-ignore Zooming to fit the content
                document.body.style.zoom = scaleFactor;
            }
        }

        // Resize it once
        const dpr = window.devicePixelRatio;
        window.addEventListener("resize", (e) => {
            if (window.devicePixelRatio === dpr) {
                handleResize();
            }
        });

        handleResize();
    }, []);

    return (
        <div
            className={`bg-white text-black w-[612pt] rounded-lg`}
            style={{
                ...fonts[font].style,
                lineHeight: spacing,
            }}
        >
            <div
                style={{
                    marginTop: marginTop,
                    marginBottom: marginBottom,
                    marginLeft: marginLeft,
                    marginRight: marginRight,
                }}
            >
                <Header />
                {sections.map((section, i) => (
                    <Section
                        key={section.id}
                        sectionId={section.id}
                        title={section.title}
                        setTitle={(t) => updateSection(section.id, t)}
                    >
                        {section.items.map((item, i) => {
                            if (item.type === "education") {
                                return (
                                    <EducationItemWithId
                                        key={item.id}
                                        itemId={item.id}
                                    />
                                );
                            }

                            if (item.type === "experience") {
                                return (
                                    <ExperienceItemWithId
                                        key={item.id}
                                        itemId={item.id}
                                    />
                                );
                            }

                            if (item.type === "text") {
                                return (
                                    <TextItemWithId
                                        key={item.id}
                                        itemId={item.id}
                                    />
                                );
                            }

                            if (
                                item.type === "project" ||
                                item.type === "project-nolinks"
                            ) {
                                return (
                                    <ProjectItemWithId
                                        key={item.id}
                                        itemId={item.id}
                                    />
                                );
                            }
                        })}
                    </Section>
                ))}
                <Button
                    onClick={() => addSection("<b></b>")}
                    className="flex items-center justify-center gap-2 w-full text-sm print:hidden mt-4"
                >
                    <FaPlusCircle className="w-4 h-4" />
                    <span className="font-semibold py-2">
                        Add a New Section
                    </span>
                </Button>
            </div>
        </div>
    );
};

export default Editor;
