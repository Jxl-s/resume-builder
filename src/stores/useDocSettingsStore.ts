import { create } from "zustand";
import fonts from "../app/fonts";

interface DocSettings {
    font: keyof typeof fonts;
    setFont: (font: keyof typeof fonts) => void;

    titleSize: number;
    headingSize: number;
    contentSize: number;

    marginTop: number;
    marginBottom: number;
    marginLeft: number;
    marginRight: number;
}

const useDocSettingsStore = create<DocSettings>((set) => ({
    font: "openSans",
    setFont: (font) => set({ font }),

    titleSize: 28,
    headingSize: 12,
    contentSize: 10,

    marginTop: 28,
    marginBottom: 28,
    marginLeft: 28,
    marginRight: 28,
}));

export default useDocSettingsStore;
