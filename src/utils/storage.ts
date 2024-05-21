import useDocSettingsStore from "@/stores/useDocSettingsStore";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import useSavedStore from "@/stores/useSavedStore";

const STORAGE_KEY = "resume-editor-state";
export const getCurrentState = () => {
    const { sections, header } = useResumeEditorStore.getState();
    const {
        font,
        titleSize,
        headingSize,
        contentSize,
        marginBottom,
        marginLeft,
        marginRight,
        marginTop,
        spacing,
        multiplierUnit,
    } = useDocSettingsStore.getState();

    return {
        sections,
        header,
        settings: {
            font,
            titleSize,
            headingSize,
            contentSize,
            marginBottom,
            marginLeft,
            marginRight,
            marginTop,
            spacing,
            multiplierUnit,
        },
    };
};

export const saveState = () => {
    const currentState = getCurrentState();

    // Write to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
};

export const getState = () => {
    const state = localStorage.getItem(STORAGE_KEY);
    if (state) {
        return JSON.parse(state);
    }

    return null;
};

export const loadState = () => {
    const state = getState();

    if (state) {
        const { sections, header, settings } = state;
        useResumeEditorStore.setState({ sections, header });
        useDocSettingsStore.setState(settings);
    }

    // Also load the saved resumes
    const savedResumes = localStorage.getItem("savedResumes");
    if (savedResumes) {
        useSavedStore.setState({ savedResumes: JSON.parse(savedResumes) });
    } else {
        useSavedStore.setState({ savedResumes: [] });
        localStorage.setItem("savedResumes", "[]");
    }
};
