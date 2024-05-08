import { FC } from "react";
import EditableHeading from "../EditableHeading";
import EditableTwoSide from "../EditableTwoSide";
import EditableList from "../EditableList";
import useResumeEditorStore from "@/stores/useResumeEditorStore";

type ContentField<T> = { content: T; setContent: (content: T) => void };
interface Props {
    company: ContentField<string>;
    position: ContentField<string>;
    date: ContentField<string>;
    location: ContentField<string>;
    description: ContentField<string[]>;
}

const Experience: FC<Props> = ({
    company,
    position,
    date,
    location,
    description,
}) => {
    return (
        <article className="mb-1">
            <EditableTwoSide
                left={{
                    placeholder: "Company",
                    content: company.content,
                    setContent: company.setContent,
                    defaultStyle: ["b"],
                }}
                right={{
                    placeholder: "Location",
                    content: location.content,
                    setContent: location.setContent,
                    defaultStyle: ["b"],
                }}
            />
            <EditableTwoSide
                left={{
                    placeholder: "Occupation",
                    content: position.content,
                    setContent: position.setContent,
                    defaultStyle: ["i"],
                }}
                right={{
                    placeholder: "Dates",
                    content: date.content,
                    setContent: date.setContent,
                    defaultStyle: ["i"],
                }}
            />
            <EditableList
                items={description.content}
                setItems={description.setContent}
            />
        </article>
    );
};

interface ExperienceWithIdProps {
    sectionId: string;
    itemId: string;
}

const ExperienceWithId: FC<ExperienceWithIdProps> = ({ sectionId, itemId }) => {
    const state = useResumeEditorStore((state) =>
        state.sections
            .find((s) => s.id === sectionId)
            ?.items.find((i) => i.id === itemId)
    );

    console.log(state);
    const updateItem = useResumeEditorStore((state) => state.updateItem);

    return (
        <Experience
            company={{
                content: state?.value.company,
                setContent: (company) =>
                    updateItem(itemId, { ...state?.value, company }),
            }}
            position={{
                content: state?.value.position,
                setContent: (position) =>
                    updateItem(itemId, { ...state?.value, position }),
            }}
            date={{
                content: state?.value.date,
                setContent: (date) =>
                    updateItem(itemId, { ...state?.value, date }),
            }}
            location={{
                content: state?.value.location,
                setContent: (location) =>
                    updateItem(itemId, { ...state?.value, location }),
            }}
            description={{
                content: state?.value.description,
                setContent: (description) =>
                    updateItem(itemId, { ...state?.value, description }),
            }}
        />
    );
};

export default Experience;
export { ExperienceWithId };
