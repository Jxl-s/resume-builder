"use client";

import { FC } from "react";
import useResumeEditorStore from "../../stores/useResumeEditorStore";
import useDocSettingsStore from "@/stores/useDocSettingsStore";

const LeftBar: FC = () => {
    const [jobDescription, setJobDescription] = useResumeEditorStore(
        (state) => [state.jobDescription, state.setJobDescription]
    );

    // Margins
    const [marginTop, setMarginTop] = useDocSettingsStore((state) => [
        state.marginTop,
        state.setMarginTop,
    ]);

    const [marginBottom, setMarginBottom] = useDocSettingsStore((state) => [
        state.marginBottom,
        state.setMarginBottom,
    ]);

    const [marginLeft, setMarginLeft] = useDocSettingsStore((state) => [
        state.marginLeft,
        state.setMarginLeft,
    ]);

    const [marginRight, setMarginRight] = useDocSettingsStore((state) => [
        state.marginRight,
        state.setMarginRight,
    ]);

    // Sizes
    const [titleSize, setTitleSize] = useDocSettingsStore((state) => [
        state.titleSize,
        state.setTitleSize,
    ]);

    const [headingSize, setHeadingSize] = useDocSettingsStore((state) => [
        state.headingSize,
        state.setHeadingSize,
    ]);

    const [contentSize, setContentSize] = useDocSettingsStore((state) => [
        state.contentSize,
        state.setContentSize,
    ]);

    return (
        <section className="w-full">
            <article className="bg-dark1 rounded-lg p-4 w-full print:hidden mb-2 block">
                <h1 className="text-2xl font-semibold">Job Description</h1>
                <p className="text-sm">
                    This will give the AI more context when giving suggestions.
                </p>
                <textarea
                    className="bg-dark2 rounded-lg w-full mt-2 p-2"
                    onChange={(e) => setJobDescription(e.target.value)}
                    value={jobDescription}
                />
            </article>
            <article className="bg-dark1 rounded-lg p-4 w-full print:hidden mb-2 block">
                <h1 className="text-2xl font-semibold">Margins</h1>
                <p className="mt-2">Top-Bottom Margins</p>
                <div className="flex w-full mt-1 gap-3">
                    <div className="bg-dark2 rounded-lg py-2 px-4 flex gap-2">
                        <input
                            className="bg-inherit w-full"
                            type="number"
                            value={marginTop}
                            onChange={(e) =>
                                setMarginTop(Number(e.target.value))
                            }
                        />
                        <span className="opacity-50">pt</span>
                    </div>
                    <div className="bg-dark2 rounded-lg py-2 px-4 flex gap-2">
                        <input
                            className="bg-inherit w-full"
                            type="number"
                            value={marginBottom}
                            onChange={(e) =>
                                setMarginBottom(Number(e.target.value))
                            }
                        />
                        <span className="opacity-50">pt</span>
                    </div>
                </div>
                <p className="mt-2">Left-Right Margins</p>
                <div className="flex w-full mt-1 gap-3">
                    <div className="bg-dark2 rounded-lg py-2 px-4 flex gap-2">
                        <input
                            className="bg-inherit w-full"
                            type="number"
                            value={marginLeft}
                            onChange={(e) =>
                                setMarginLeft(Number(e.target.value))
                            }
                        />
                        <span className="opacity-50">pt</span>
                    </div>
                    <div className="bg-dark2 rounded-lg py-2 px-4 flex gap-2 justify-between">
                        <input
                            className="bg-inherit w-full"
                            type="number"
                            value={marginRight}
                            onChange={(e) =>
                                setMarginRight(Number(e.target.value))
                            }
                        />
                        <span className="opacity-50">pt</span>
                    </div>
                </div>
            </article>
            <article className="bg-dark1 rounded-lg p-4 w-full print:hidden mb-2 block">
                <h1 className="text-2xl font-semibold">Font Sizes</h1>
                <div className="grid grid-cols-2 gap-2 mt-2 justify-between items-center">
                    <span>Title Size</span>
                    <div className="bg-dark2 rounded-lg py-2 px-4 flex justify-between gap-2">
                        <input
                            className="bg-inherit w-full"
                            type="number"
                            value={titleSize}
                            onChange={(e) =>
                                setTitleSize(Number(e.target.value))
                            }
                        />
                        <span className="opacity-50">pt</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 justify-between items-center">
                    <span>Heading Size</span>
                    <div className="bg-dark2 rounded-lg py-2 px-4 flex justify-between gap-2">
                        <input
                            className="bg-inherit w-full"
                            type="number"
                            value={headingSize}
                            onChange={(e) =>
                                setHeadingSize(Number(e.target.value))
                            }
                        />
                        <span className="opacity-50">pt</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 justify-between items-center">
                    <span>Content Size</span>
                    <div className="bg-dark2 rounded-lg py-2 px-4 flex justify-between gap-2">
                        <input
                            className="bg-inherit w-full"
                            type="number"
                            value={contentSize}
                            onChange={(e) =>
                                setContentSize(Number(e.target.value))
                            }
                        />
                        <span className="opacity-50">pt</span>
                    </div>
                </div>
            </article>
        </section>
    );
};

export default LeftBar;
