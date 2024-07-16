"use client";

import { FC } from "react";
import useResumeEditorStore from "../../stores/useResumeEditorStore";
import useDocSettingsStore, {
    convertFromUnit,
    convertToUnit,
    units,
} from "@/stores/useDocSettingsStore";
import { Unit } from "@/types/unit";
import { useTranslations } from "next-intl";

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

    const t = useTranslations("Left");
    return (
        <section className="w-full min-w-[306px] print:hidden">
            <article className="bg-dark1 rounded-lg p-2 w-full mb-2 block">
                <LeftInput
                    title={t("spacing")}
                    value={spacing}
                    setValue={setSpacing}
                    className="my-2"
                />
                <div className="grid grid-cols-2 gap-2 justify-between items-center">
                    <span className="ms-2">{t("unit")}</span>
                    <div className="bg-dark2 rounded-lg py-2 px-4 flex justify-between gap-2">
                        <select
                            className="bg-inherit w-full"
                            value={multiplierUnit}
                            onChange={(e) =>
                                setMultiplierUnit(e.target.value as Unit)
                            }
                        >
                            {units.map((unit) => (
                                <option key={unit} value={unit}>
                                    {unit}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </article>
            <article className="bg-dark1 rounded-lg p-4 w-full mb-2 block">
                <h1 className="text-2xl font-semibold">
                    {t("job_description")}
                </h1>
                <p className="text-sm">{t("job_description_desc")}</p>
                <textarea
                    className="bg-dark2 rounded-lg w-full mt-2 p-2 outline-none duration-300"
                    style={{
                        // make the border glow with a fade
                        boxShadow: `0 0 0 2px ${
                            jobDescription.length > 0
                                ? "rgba(0, 255, 255, 0.5)"
                                : "transparent"
                        }`,
                    }}
                    onChange={(e) => setJobDescription(e.target.value)}
                    value={jobDescription}
                />
            </article>
            <article className="bg-dark1 rounded-lg p-4 w-full mb-2 block">
                <h1 className="text-2xl font-semibold">{t("margins")}</h1>
                <TwoInputs
                    title={t("top_bottom_margins")}
                    value1={convertToUnit(marginTop, multiplierUnit)}
                    value2={convertToUnit(marginBottom, multiplierUnit)}
                    setValue1={setMTop}
                    setValue2={setMBottom}
                    unit={multiplierUnit}
                />
                <TwoInputs
                    title={t("left_right_margins")}
                    value1={convertToUnit(marginLeft, multiplierUnit)}
                    value2={convertToUnit(marginRight, multiplierUnit)}
                    setValue1={setMLeft}
                    setValue2={setMRight}
                    unit={multiplierUnit}
                />
            </article>
            <article className="bg-dark1 rounded-lg p-4 w-full mb-2 block">
                <h1 className="text-2xl font-semibold">{t("font_sizes")}</h1>
                <LeftInput
                    title={t("title_size")}
                    value={convertToUnit(titleSize, multiplierUnit)}
                    setValue={setSTitle}
                    unit={multiplierUnit}
                    className="mt-2"
                />
                <LeftInput
                    title={t("heading_size")}
                    value={convertToUnit(headingSize, multiplierUnit)}
                    setValue={setSHeading}
                    unit={multiplierUnit}
                    className="mt-2"
                />
                <LeftInput
                    title={t("content_size")}
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
