import { create } from "zustand";

interface StylingStore {
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    isHyperlink: boolean;

    setIsBold: (isBold: boolean) => void;
    setIsItalic: (isItalic: boolean) => void;
    setIsUnderline: (isUnderline: boolean) => void;
    setIsHyperlink: (isHyperlink: boolean) => void;
}

const useStylingStore = create<StylingStore>((set) => ({
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isHyperlink: false,

    setIsBold: (isBold) => set({ isBold }),
    setIsItalic: (isItalic) => set({ isItalic }),
    setIsUnderline: (isUnderline) => set({ isUnderline }),
    setIsHyperlink: (isHyperlink) => set({ isHyperlink }),
}));

export default useStylingStore;
