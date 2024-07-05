import { FC, useState } from "react";
import Modal from "../Modal";
import Button from "../Button";
import useSavedStore from "@/stores/useSavedStore";

interface Props {
    visible: boolean;
    onClose: () => void;
}

const SnapshotModal: FC<Props> = ({ onClose, visible }) => {
    const [snapshotName, setSnapshotName] = useState("");
    const [formError, setFormError] = useState("");

    const savedResumes = useSavedStore((state) => state.savedResumes);
    const addSavedResume = useSavedStore((state) => state.addSavedResume);

    const reset = () => {
        onClose();
        setSnapshotName("");
        setFormError("");
    };

    const handleSaveSnapshot = () => {
        if (savedResumes.find((resume) => resume.name === snapshotName)) {
            setFormError("Snapshot names must be unique");
            return;
        }

        addSavedResume(snapshotName);
        reset();
    };

    return (
        <Modal title="Create Snapshot" onClose={reset} visible={visible}>
            <p className="w-full">Enter the new snapshot&apos;s name</p>
            <input
                className="block bg-dark3 disabled:opacity-50 rounded-md py-1 px-2 mt-2 w-80"
                value={snapshotName}
                onChange={(e) => setSnapshotName(e.target.value)}
            />
            {formError && <p className="text-danger">{formError}</p>}
            <Button
                theme="primary"
                className="py-2 w-full mt-2"
                onClick={handleSaveSnapshot}
            >
                Save Snapshot
            </Button>
        </Modal>
    );
};

export default SnapshotModal;
