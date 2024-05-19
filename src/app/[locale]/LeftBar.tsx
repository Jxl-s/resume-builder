"use client";

import { FC } from "react";
import useResumeEditorStore from "../../stores/useResumeEditorStore";
import useDocSettingsStore, {
    convertFromUnit,
    convertToUnit,
} from "@/stores/useDocSettingsStore";
import { Unit } from "@/types/unit";

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

    // Unit
    const [multiplierUnit, setMultiplierUnit] = useDocSettingsStore((state) => [
        state.multiplierUnit,
        state.setMultiplierUnit,
    ]);

    // New functions that make use of the unit converter
    const setMTop = (size: number) =>
        setMarginTop(convertFromUnit(size, multiplierUnit));
    const setMBottom = (size: number) =>
        setMarginBottom(convertFromUnit(size, multiplierUnit));
    const setMLeft = (size: number) =>
        setMarginLeft(convertFromUnit(size, multiplierUnit));
    const setMRight = (size: number) =>
        setMarginRight(convertFromUnit(size, multiplierUnit));

    const setSTitle = (size: number) =>
        setTitleSize(convertFromUnit(size, multiplierUnit));
    const setSHeading = (size: number) =>
        setHeadingSize(convertFromUnit(size, multiplierUnit));
    const setSContent = (size: number) =>
        setContentSize(convertFromUnit(size, multiplierUnit));

    const spacing = useDocSettingsStore((state) => state.spacing);
    const setSpacing = useDocSettingsStore((state) => state.setSpacing);

    return (
        <section className="w-full">
            <article className="bg-dark1 rounded-lg p-2 w-full print:hidden mb-2 block">
                <div className="grid grid-cols-2 gap-2 justify-between items-center mb-2">
                    <span className="ms-2">Spacing</span>
                    <input
                        className="bg-dark2 w-full rounded-lg py-2 px-4"
                        type="number"
                        value={spacing}
                        onChange={(e) => setSpacing(Number(e.target.value))}
                    />
                </div>
                <div className="grid grid-cols-2 gap-2 justify-between items-center">
                    <span className="ms-2">Unit</span>
                    <div className="bg-dark2 rounded-lg py-2 px-4 flex justify-between gap-2">
                        <select
                            className="bg-inherit w-full"
                            value={multiplierUnit}
                            onChange={(e) =>
                                setMultiplierUnit(
                                    e.target.value as Unit
                                )
                            }
                        >
                            <option value={"pt"}>pt</option>
                            <option value={"px"}>px</option>
                            <option value={"in"}>in</option>
                            <option value={"mm"}>mm</option>
                        </select>
                    </div>
                </div>
            </article>
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
                            value={convertToUnit(marginTop, multiplierUnit)}
                            onChange={(e) => setMTop(Number(e.target.value))}
                        />
                        <span className="opacity-50">{multiplierUnit}</span>
                    </div>
                    <div className="bg-dark2 rounded-lg py-2 px-4 flex gap-2">
                        <input
                            className="bg-inherit w-full"
                            type="number"
                            value={convertToUnit(marginBottom, multiplierUnit)}
                            onChange={(e) => setMBottom(Number(e.target.value))}
                        />
                        <span className="opacity-50">{multiplierUnit}</span>
                    </div>
                </div>
                <p className="mt-2">Left-Right Margins</p>
                <div className="flex w-full mt-1 gap-3">
                    <div className="bg-dark2 rounded-lg py-2 px-4 flex gap-2">
                        <input
                            className="bg-inherit w-full"
                            type="number"
                            value={convertToUnit(marginLeft, multiplierUnit)}
                            onChange={(e) => setMLeft(Number(e.target.value))}
                        />
                        <span className="opacity-50">{multiplierUnit}</span>
                    </div>
                    <div className="bg-dark2 rounded-lg py-2 px-4 flex gap-2 justify-between">
                        <input
                            className="bg-inherit w-full"
                            type="number"
                            value={convertToUnit(marginRight, multiplierUnit)}
                            onChange={(e) => setMRight(Number(e.target.value))}
                        />
                        <span className="opacity-50">{multiplierUnit}</span>
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
                            value={convertToUnit(titleSize, multiplierUnit)}
                            onChange={(e) => setSTitle(Number(e.target.value))}
                        />
                        <span className="opacity-50">{multiplierUnit}</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 justify-between items-center">
                    <span>Heading Size</span>
                    <div className="bg-dark2 rounded-lg py-2 px-4 flex justify-between gap-2">
                        <input
                            className="bg-inherit w-full"
                            type="number"
                            value={convertToUnit(headingSize, multiplierUnit)}
                            onChange={(e) =>
                                setSHeading(Number(e.target.value))
                            }
                        />
                        <span className="opacity-50">{multiplierUnit}</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 justify-between items-center">
                    <span>Content Size</span>
                    <div className="bg-dark2 rounded-lg py-2 px-4 flex justify-between gap-2">
                        <input
                            className="bg-inherit w-full"
                            type="number"
                            value={convertToUnit(contentSize, multiplierUnit)}
                            onChange={(e) =>
                                setSContent(Number(e.target.value))
                            }
                        />
                        <span className="opacity-50">{multiplierUnit}</span>
                    </div>
                </div>
            </article>
        </section>
    );
};

export default LeftBar;
