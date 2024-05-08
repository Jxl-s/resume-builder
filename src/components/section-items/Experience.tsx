import { FC } from "react";
import EditableHeading from "../EditableHeading";
import EditableTwoSide from "../EditableTwoSide";
import EditableList from "../EditableList";

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
        <article>
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

export default Experience;
