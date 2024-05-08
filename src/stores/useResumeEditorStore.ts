import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

// type: education/experience, custom, project
interface SectionTypes {
    experience: {
        company: string;
        position: string;
        date: string;
        location: string;
        description: string[];
    };
    education: {
        school: string;
        degree: string;
        date: string;
        location: string;
    };
}

type SectionItem = {
    [K in keyof SectionTypes]: {
        type: K;
        id: string;
        value: SectionTypes[K];
    };
}[keyof SectionTypes];

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

    removeItem: (itemId: string) => void;
    updateItem: (itemId: string, item: SectionItem) => void;
}

const useResumeEditorStore = create<ResumeEditor>((set) => ({
    name: "John Doe",
    subtitle: "Software Engineer",
    contact:
        "123-456-7890 | email@email.com | linkedin.com/in/john-die | github.com/John-Doe | johndoe.com",
    sections: [
        {
            title: "Education",
            id: uuidv4(),
            items: [
                {
                    type: "experience",
                    id: uuidv4(),
                    value: {
                        company: "Amazon",
                        position: "Software Engineer",
                        date: "August 2017 - May 2021",
                        location: "Berkeley, CA",
                        description: [
                            "Developed a new feature that increased user retention by 20%",
                            "Implemented a new algorithm that reduced server load by 15%",
                            "Collaborated with a team of 5 to develop a new product from scratch",
                        ],
                    },
                },
                {
                    type: "education",
                    id: uuidv4(),
                    value: {
                        date: "May 2024",
                        degree: "Master of Science in Computer Science",
                        location: "Berkeley, CA",
                        school: "University of California, Berkeley",
                    },
                },
            ],
        },
    ],

    setSections: (sections) => set({ sections }),
    addSection: (title) =>
        set((state) => ({
            sections: [
                ...state.sections,
                {
                    id: uuidv4(),
                    title,
                    items: [],
                },
            ],
        })),

    removeSection: (sectionId) =>
        set((state) => ({
            sections: state.sections.filter((s) => s.id !== sectionId),
        })),

    updateSection: (sectionId, title) =>
        set((state) => ({
            sections: state.sections.map((s) =>
                s.id === sectionId ? { ...s, title } : s
            ),
        })),

    setItems: (sectionId, items) =>
        set((state) => ({
            sections: state.sections.map((s) =>
                s.id === sectionId ? { ...s, items } : s
            ),
        })),

    addItem: (sectionId, item) =>
        set((state) => ({
            sections: state.sections.map((s) =>
                s.id === sectionId ? { ...s, items: [...s.items, item] } : s
            ),
        })),

    removeItem: (itemId) =>
        set((state) => ({
            sections: state.sections.map((s) => ({
                ...s,
                items: s.items.filter((i) => i.id !== itemId),
            })),
        })),

    updateItem: (itemId, item) =>
        set((state) => ({
            sections: state.sections.map((s) => ({
                ...s,
                items: s.items.map((i) => (i.id === itemId ? item : i)),
            })),
        })),
}));

export default useResumeEditorStore;
