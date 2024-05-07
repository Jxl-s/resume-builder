import { create } from "zustand";

// type: education/experience, custom, project
interface ResumeEditor {
    name: string;
    subtitle: string;
    contact: string;

    sections: {
        title: string;
        items: {
            type: string;
        }[];
    }[];
}

const useResumeEditorStore = create<ResumeEditor>((set) => ({
    name: "John Doe",
    subtitle: "Software Engineer",
    contact:
        "123-456-7890 | email@email.com | linkedin.com/in/john-die | github.com/John-Doe | johndoe.com",

    sections: [
        {
            title: "Education",
            items: [
                {
                    type: "education",
                },
            ],
        },
    ],
}));

export default useResumeEditorStore;
