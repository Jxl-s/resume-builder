import { getCurrentState } from "@/utils/storage";
import { create } from "zustand";
import useResumeEditorStore from "./useResumeEditorStore";
import useDocSettingsStore from "./useDocSettingsStore";

interface SavedStore {
    savedResumes: {
        name: string;
        state: {
            sections: any[];
            header: any;
            settings: any;
        };
    }[];
    addSavedResume: (name: string) => void;
    loadSavedResume: (name: string) => void;
    deleteSavedResume: (name: string) => void;
}

const useSavedStore = create<SavedStore>((set) => ({
    savedResumes: [],
    addSavedResume: (name) => {
        const currentState = getCurrentState();
        set((state) => {
            const savedResumes = [
                ...state.savedResumes,
                {
                    name: name,
                    state: JSON.parse(JSON.stringify(currentState)), // a deep copy
                },
            ];

            localStorage.setItem("savedResumes", JSON.stringify(savedResumes));
            return { savedResumes };
        });
    },
    loadSavedResume: (name) => {
        const savedResume = useSavedStore
            .getState()
            .savedResumes.find((resume) => resume.name === name);

        if (!savedResume) return;

        const { sections, header, settings } = savedResume.state;
        console.log(sections, header, settings);
        useResumeEditorStore.setState({ sections, header });
        useDocSettingsStore.setState(settings);
    },
    deleteSavedResume: (name) => {
        set((state) => {
            const savedResumes = state.savedResumes.filter(
                (resume) => resume.name !== name
            );

            localStorage.setItem("savedResumes", JSON.stringify(savedResumes));
            return { savedResumes };
        });
    },
}));

export default useSavedStore;
