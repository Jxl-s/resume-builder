import useDocSettingsStore from "@/stores/useDocSettingsStore";
import useResumeEditorStore from "@/stores/useResumeEditorStore";

const STORAGE_KEY = "resume-editor-state";
export const saveState = () => {
    // Get content
    const { sections, header } = useResumeEditorStore.getState();

    // Get settings
    const {
        font,
        titleSize,
        headingSize,
        contentSize,
        marginBottom,
        marginLeft,
        marginRight,
        marginTop,
    } = useDocSettingsStore.getState();

    // Write to local storage
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
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
            },
        })
    );
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
};
