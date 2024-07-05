"use client";

import Button from "@/components/Button";
import SnapshotDeleteModal from "@/components/modals/SnapshotDeleteModal";
import SnapshotModal from "@/components/modals/SnapshotModal";
import useSavedStore from "@/stores/useSavedStore";
import { FC, useState } from "react";

const RightBar: FC = () => {
    const savedResumes = useSavedStore((state) => state.savedResumes);
    const loadSavedResume = useSavedStore((state) => state.loadSavedResume);

    const [snapModalVisible, setSnapModalVisible] = useState(false);
    const [deletingModal, setDeletingModal] = useState("");

    return (
        <article className="h-full bg-dark1 rounded-lg p-4 w-full min-w-[306pt] print:hidden">
            <h1 className="text-2xl font-semibold">My Resumes</h1>
            <ol className="list-decimal list-outside px-2">
                {savedResumes.map((resume, i) => (
                    <li className="mt-4 flex gap-2" key={i}>
                        <span className="me-2">{i + 1}.</span>
                        {resume.name}
                        <div className="flex-grow flex justify-end">
                            <span
                                className="text-primary underline cursor-pointer ms-2"
                                onClick={() => {
                                    loadSavedResume(resume.name);
                                }}
                            >
                                Load
                            </span>
                            <span
                                className="text-danger underline cursor-pointer ms-2"
                                onClick={() => {
                                    setDeletingModal(resume.name);
                                }}
                            >
                                Delete
                            </span>
                        </div>
                    </li>
                ))}
            </ol>
            <Button
                onClick={() => setSnapModalVisible(true)}
                theme="primary"
                className="font-semibold w-full py-2 mt-4"
            >
                Take Snapshot
            </Button>
            <SnapshotModal
                visible={snapModalVisible}
                onClose={() => setSnapModalVisible(false)}
            />
            <SnapshotDeleteModal
                visible={deletingModal !== ""}
                onClose={() => setDeletingModal("")}
                snapshotName={deletingModal}
            />
        </article>
    );
};

export default RightBar;
