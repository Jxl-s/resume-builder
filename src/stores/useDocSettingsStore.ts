import { create } from "zustand";
import fonts from "../app/fonts";

interface DocSettings {
    font: keyof typeof fonts;
    setFont: (font: keyof typeof fonts) => void;

    titleSize: number;
    headingSize: number;
    contentSize: number;
}

const useDocSettingsStore = create<DocSettings>((set) => ({
    font: "openSans",
    setFont: (font) => set({ font }),

    titleSize: 28,
    headingSize: 12,
    contentSize: 10,
}));

export default useDocSettingsStore;
