import { create } from "zustand";
import fonts from "../app/fonts";

interface DocSettings {
    font: keyof typeof fonts;
    setFont: (font: keyof typeof fonts) => void;

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

    multiplierUnit: "pt" | "px" | "in" | "mm";
    setMultiplierUnit: (unit: "pt" | "px" | "in" | "mm") => void;
}

const useDocSettingsStore = create<DocSettings>((set) => ({
    font: "openSans",
    setFont: (font) => set({ font }),

    titleSize: 28,
    setTitleSize: (size) => set({ titleSize: size }),
    headingSize: 12,
    setHeadingSize: (size) => set({ headingSize: size }),
    contentSize: 10,
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

const convertToUnit = (value: number, unit: "pt" | "px" | "in" | "mm") => {
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

const convertFromUnit = (value: number, unit: "pt" | "px" | "in" | "mm") => {
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
export { convertToUnit, convertFromUnit };
