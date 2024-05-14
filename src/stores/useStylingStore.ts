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

    toggleBold: () => void;
    toggleItalic: () => void;
    toggleUnderline: () => void;
    toggleHyperlink: () => void;
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

    toggleBold: () => set((state) => ({ isBold: !state.isBold })),
    toggleItalic: () => set((state) => ({ isItalic: !state.isItalic })),
    toggleUnderline: () =>
        set((state) => ({ isUnderline: !state.isUnderline })),
    toggleHyperlink: () =>
        set((state) => ({ isHyperlink: !state.isHyperlink })),
}));

export default useStylingStore;

export const queryIsLink = () => {
    let isLink = false;
    try {
        const range = window.getSelection()?.getRangeAt(0);
        if (range) {
            let container: any = range.commonAncestorContainer;
            if (container.nodeType == 3) {
                container = container.parentNode;
            }

            if (container.nodeName === "A") {
                isLink = true;
            }
        }
    } catch (e) {}

    return isLink;
};

export const updateDisplayStyle = () => {
    useStylingStore.setState({
        isBold: document.queryCommandState("bold"),
        isItalic: document.queryCommandState("italic"),
        isUnderline: document.queryCommandState("underline"),
        isHyperlink: queryIsLink(),
    });
};
