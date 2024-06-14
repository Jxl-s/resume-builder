import { create } from "zustand";
import fonts, { defaultEditorFont } from "../app/fonts";
import { Unit } from "@/types/unit";

interface DocSettings {
    font: keyof typeof fonts;
    setFont: (font: keyof typeof fonts) => void;

    spacing: number;
    setSpacing: (size: number) => void;

    titleSize: number;
    setTitleSize: (size: number) => void;
    headingSize: number;
    setHeadingSize: (size: number) => void;
    contentSize: number;
    setContentSize: (size: number) => void;

    marginTop: number;
    setMarginTop: (size: number) => void;
    marginBottom: number;
    setMarginBottom: (size: number) => void;
    marginLeft: number;
    setMarginLeft: (size: number) => void;
    marginRight: number;
    setMarginRight: (size: number) => void;

    multiplierUnit: Unit;
    setMultiplierUnit: (unit: Unit) => void;
}

const useDocSettingsStore = create<DocSettings>((set) => ({
    font: defaultEditorFont,
    setFont: (font) => set({ font }),

    spacing: 1.5,
    setSpacing: (size) => set({ spacing: size }),

    titleSize: 28,
    setTitleSize: (size) => set({ titleSize: size }),
    headingSize: 12,
    setHeadingSize: (size) => set({ headingSize: size }),
    contentSize: 11,
    setContentSize: (size) => set({ contentSize: size }),

    marginTop: 28,
    setMarginTop: (size) => set({ marginTop: size }),
    marginBottom: 28,
    setMarginBottom: (size) => set({ marginBottom: size }),
    marginLeft: 28,
    setMarginLeft: (size) => set({ marginLeft: size }),
    marginRight: 28,
    setMarginRight: (size) => set({ marginRight: size }),

    multiplierUnit: "pt",
    setMultiplierUnit: (unit) => set({ multiplierUnit: unit }),
}));

const fixFloating = (value: number) => {
    return Math.round(value * 100) / 100;
};

const units = ["pt", "px", "in", "mm"] as const;
const convertToUnit = (value: number, unit: Unit) => {
    switch (unit) {
        case "pt":
            return fixFloating(value);
        case "px":
            return fixFloating(value / 1.333);
        case "in":
            return fixFloating(value / 72);
        case "mm":
            return fixFloating(value / 2.835);
    }
};

const convertFromUnit = (value: number, unit: Unit) => {
    switch (unit) {
        case "pt":
            return fixFloating(value);
        case "px":
            return fixFloating(value * 1.333);
        case "in":
            return fixFloating(value * 72);
        case "mm":
            return fixFloating(value * 2.835);
    }
};

export default useDocSettingsStore;
export { units, convertToUnit, convertFromUnit };
