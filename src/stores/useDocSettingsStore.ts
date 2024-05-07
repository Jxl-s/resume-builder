import { create } from "zustand";

interface DocSettings {
    titleSize: number;
    headingSize: number;
    contentSize: number;
}

const useDocSettingsStore = create<DocSettings>((set) => ({
    titleSize: 24,
    headingSize: 16,
    contentSize: 11,
}));

export default useDocSettingsStore;
