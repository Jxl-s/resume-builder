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
}));

export default useResumeEditorStore;
