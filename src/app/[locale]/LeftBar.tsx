"use client";

import { FC } from "react";
import useResumeEditorStore from "../../stores/useResumeEditorStore";
import useDocSettingsStore, {
    convertFromUnit,
    convertToUnit,
} from "@/stores/useDocSettingsStore";
import { Unit } from "@/types/unit";

interface LeftInputProps {
    title: string;
    value: number;
    setValue: (value: number) => void;
    unit?: string;
    className?: string;
}

const LeftInput: FC<LeftInputProps> = ({
    title,
    value,
    setValue,
    unit,
    className,
}) => {
    return (
        <div
            className={`grid grid-cols-2 gap-2 justify-between items-center ${className}`}
        >
            <span className={unit ? "" : "ms-2"}>{title}</span>
            <div className="bg-dark2 rounded-lg py-2 px-4 flex justify-between gap-2">
                <input
                    className="bg-inherit w-full"
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                />
                {unit && <span className="opacity-50">{unit}</span>}
            </div>
        </div>
    );
};

interface TwoInputsProps {
    title: string;
    value1: number;
    value2: number;
    setValue1: (value: number) => void;
    setValue2: (value: number) => void;
    unit?: string;
    className?: string;
}

const TwoInputs: FC<TwoInputsProps> = ({
    title,
    value1,
    value2,
    setValue1,
    setValue2,
    unit,
}) => {
    return (
        <>
            <p className="mt-2">{title}</p>
            <div className="flex w-full mt-1 gap-3">
                <div className="bg-dark2 rounded-lg py-2 px-4 flex gap-2">
                    <input
                        className="bg-inherit w-full"
                        type="number"
                        value={value1}
                        onChange={(e) => setValue1(Number(e.target.value))}
                    />
                    <span className="opacity-50">{unit}</span>
                </div>
                <div className="bg-dark2 rounded-lg py-2 px-4 flex gap-2">
                    <input
                        className="bg-inherit w-full"
                        type="number"
                        value={value2}
                        onChange={(e) => setValue2(Number(e.target.value))}
                    />
                    <span className="opacity-50">{unit}</span>
                </div>
            </div>
        </>
    );
};

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
        <section className="w-full min-w-[306px] print:hidden">
            <article className="bg-dark1 rounded-lg p-2 w-full mb-2 block">
                <LeftInput
                    title="Spacing"
                    value={spacing}
                    setValue={setSpacing}
                    className="my-2"
                />
                <div className="grid grid-cols-2 gap-2 justify-between items-center">
                    <span className="ms-2">Unit</span>
                    <div className="bg-dark2 rounded-lg py-2 px-4 flex justify-between gap-2">
                        <select
                            className="bg-inherit w-full"
                            value={multiplierUnit}
                            onChange={(e) =>
                                setMultiplierUnit(e.target.value as Unit)
                            }
                        >
                            {["pt", "px", "in", "mm"].map((unit) => (
                                <option key={unit} value={unit}>
                                    {unit}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </article>
            <article className="bg-dark1 rounded-lg p-4 w-full mb-2 block">
                <h1 className="text-2xl font-semibold">Job Description</h1>
                <p className="text-sm">
                    This will give the AI more context when giving suggestions.
                </p>
                <textarea
                    className={`bg-dark2 rounded-lg w-full mt-2 p-2 outline-none ${
                        jobDescription.length > 0
                            ? "border-2 border-primary"
                            : ""
                    }`}
                    onChange={(e) => setJobDescription(e.target.value)}
                    value={jobDescription}
                />
            </article>
            <article className="bg-dark1 rounded-lg p-4 w-full mb-2 block">
                <h1 className="text-2xl font-semibold">Margins</h1>
                <TwoInputs
                    title="Top-Bottom Margins"
                    value1={convertToUnit(marginTop, multiplierUnit)}
                    value2={convertToUnit(marginBottom, multiplierUnit)}
                    setValue1={setMTop}
                    setValue2={setMBottom}
                    unit={multiplierUnit}
                />
                <TwoInputs
                    title="Left-Right Margins"
                    value1={convertToUnit(marginLeft, multiplierUnit)}
                    value2={convertToUnit(marginRight, multiplierUnit)}
                    setValue1={setMLeft}
                    setValue2={setMRight}
                    unit={multiplierUnit}
                />
            </article>
            <article className="bg-dark1 rounded-lg p-4 w-full mb-2 block">
                <h1 className="text-2xl font-semibold">Font Sizes</h1>
                <LeftInput
                    title="Title Size"
                    value={convertToUnit(titleSize, multiplierUnit)}
                    setValue={setSTitle}
                    unit={multiplierUnit}
                    className="mt-2"
                />
                <LeftInput
                    title="Heading Size"
                    value={convertToUnit(headingSize, multiplierUnit)}
                    setValue={setSHeading}
                    unit={multiplierUnit}
                    className="mt-2"
                />
                <LeftInput
                    title="Content Size"
                    value={convertToUnit(contentSize, multiplierUnit)}
                    setValue={setSContent}
                    unit={multiplierUnit}
                    className="mt-2"
                />
            </article>
        </section>
    );
};

export default LeftBar;
