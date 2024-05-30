"use client";

import { FC, useEffect, useRef, useState } from "react";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { EducationItemWithId } from "../../components/items/Education";
import { ExperienceItemWithId } from "@/components/items/Experience";
import Section from "@/components/Section";
import { FaPlusCircle } from "react-icons/fa";
import Button from "@/components/Button";
import { TextItemWithId } from "@/components/items/Text";
import { ProjectItemWithId } from "@/components/items/Project";
import useDocSettingsStore from "@/stores/useDocSettingsStore";
import Header from "@/components/items/Header";
import "./Editor.css";
import fonts, { defaultFont } from "../fonts";
import { loadState, saveState } from "@/utils/storage";
import { FaPenToSquare, FaX } from "react-icons/fa6";
import TooltipsLink from "@/components/TooltipsLink";

const Editor: FC = () => {
    const resumeContainerRef = useRef<HTMLDivElement>(null);
    
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
                // document.body.style.zoom = scaleFactor;
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
            className={`bg-white text-black w-[612pt] print:w-full rounded-lg`}
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
                id="resume-container"
                ref={resumeContainerRef}
            >
                <TooltipsLink resumeContainerRef={resumeContainerRef} />
                <style>
                    {`
                        @page {
                            size: Letter portrait;
                            margin-top: ${marginTop}pt;
                            margin-bottom: ${marginBottom}pt;
                            margin-left: ${marginLeft}pt;
                            margin-right: ${marginRight}pt;
                        }

                        @media print {
                            #resume-container {
                                padding: 0 !important;
                                margin: 0 !important;
                            }
                        }
                    `}
                </style>
                <Header />
                {sections.map((section, i) => (
                    <Section
                        key={section.id}
                        sectionId={section.id}
                        title={section.title}
                        setTitle={(t) => updateSection(section.id, t)}
                    >
                        {section.items.map((item, i) => {
                            let Component: FC<{ itemId: string }> | null = null;

                            switch (item.type) {
                                case "education":
                                    Component = EducationItemWithId;
                                    break;
                                case "experience":
                                    Component = ExperienceItemWithId;
                                    break;
                                case "text":
                                    Component = TextItemWithId;
                                    break;
                                case "project":
                                case "project-nolinks":
                                    Component = ProjectItemWithId;
                                    break;
                            }

                            if (!Component) return null;
                            return <Component key={item.id} itemId={item.id} />;
                        })}
                    </Section>
                ))}
                <Button
                    onClick={() => addSection("<b></b>")}
                    className="flex items-center justify-center gap-2 w-full text-sm mt-4 print:hidden"
                >
                    <FaPlusCircle className="w-4 h-4" />
                    <span
                        className="font-semibold py-2"
                        style={defaultFont.style}
                    >
                        Add a New Section
                    </span>
                </Button>
            </div>
        </div>
    );
};

export default Editor;
