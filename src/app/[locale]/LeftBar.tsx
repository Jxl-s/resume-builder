"use client";

import { FC } from "react";
import useResumeEditorStore from "../../stores/useResumeEditorStore";

const LeftBar: FC = () => {
    const [jobDescription, setJobDescription] = useResumeEditorStore((state) => [
        state.jobDescription,
        state.setJobDescription,
    ]);

    return (
        <article className="h-full bg-dark1 rounded-lg p-4 w-full print:hidden">
            <h1 className="text-2xl font-semibold">Job Description</h1>
            <p>The job description will give the AI more context when giving suggestions.</p>
            <textarea
                className="bg-dark2 rounded-lg w-full mt-2 p-2"
                onChange={(e) => setJobDescription(e.target.value)}
                value={jobDescription}
            />
        </article>
    );
};

export default LeftBar;
