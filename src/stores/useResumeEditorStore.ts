import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { IEducationItem, IExperienceItem } from "@/types/items";

// type: education/experience, custom, project
interface SectionTypes {
    experience: IExperienceItem;
    education: IEducationItem;
}

interface SectionItem {
    type: keyof SectionTypes;
    id: string;
    value: Object;
}

interface ResumeEditor {
    name: string;
    subtitle: string;
    contact: string;

    sections: {
        id: string;
        title: string;
        items: SectionItem[];
    }[];

    setSections: (
        sections: { id: string; title: string; items: SectionItem[] }[]
    ) => void;
    addSection: (title: string) => void;
    removeSection: (sectionId: string) => void;
    updateSection: (sectionId: string, title: string) => void;

    setItems: (sectionId: string, items: SectionItem[]) => void;
    addItem: (sectionId: string, item: SectionItem) => void;

    removeItem: (sectionId: string, itemId: string) => void;
    updateItem: (sectionId: string, itemId: string, item: SectionItem) => void;
}

const useResumeEditorStore = create<ResumeEditor>((set) => ({
    name: "John Doe",
    subtitle: "Software Engineer",
    contact:
        "123-456-7890 | email@email.com | linkedin.com/in/john-die | github.com/John-Doe | johndoe.com",

    sections: [],

    setSections: (sections) => set({ sections }),
    addSection: (title) => {
        set((state) => {
            const copy = [...state.sections];

            copy.push({
                title,
                id: uuidv4(),
                items: [],
            });

            return { sections: copy };
        });
    },

    removeSection: (sectionId) => {
        set((state) => ({
            sections: state.sections.filter((s) => s.id !== sectionId),
        }));
    },

    updateSection: (sectionId, title) => {
        set((state) => {
            const copy = [...state.sections];
            const section = copy.find((s) => s.id === sectionId);

            if (section) {
                section.title = title;
            }

            return { sections: copy };
        });
    },

    setItems: (sectionId, items) => {
        set((state) => {
            const copy = [...state.sections];
            const section = copy.find((s) => s.id === sectionId);

            if (section) {
                section.items = items;
            }

            return { sections: copy };
        });
    },

    addItem: (sectionId, item) => {
        set((state) => {
            const copy = [...state.sections];
            const section = copy.find((s) => s.id === sectionId);

            if (section) {
                section.items.push(item);
            }

            return { sections: copy };
        });
    },

    removeItem: (sectionId, itemId) => {
        set((state) => {
            const copy = [...state.sections];
            const section = copy.find((s) => s.id === sectionId);

            if (section) {
                section.items = section.items.filter((i) => i.id !== itemId);
            }

            return { sections: copy };
        });
    },

    updateItem: (sectionId, itemId, item) => {
        set((state) => {
            const copy = [...state.sections];
            const section = copy.find((s) => s.id === sectionId);

            if (section) {
                const itemIndex = section.items.findIndex(
                    (i) => i.id === itemId
                );

                if (itemIndex !== -1) {
                    section.items[itemIndex] = item;
                }
            }

            return { sections: copy };
        });
    },
}));

export default useResumeEditorStore;
