export interface IEducationItem {
    school: string;
    location: string;
    degree: string;
    date: string;
}

export interface IExperienceItem {
    company: string;
    location: string;
    position: string;
    dates: string;
    description: string[];
}

export interface ITextItem {
    text: string;
}

export interface IProjectItem {
    name: string;
    technologies: string;
    dates: string;
    source?: string;
    demo?: string;
    description: string[];
}
