import { FC, useState } from "react";
import Modal from "../Modal";
import Button from "../Button";
import useSavedStore from "@/stores/useSavedStore";

interface Props {
    visible: boolean;
    onClose: () => void;
    snapshotName: string;
}

const SnapshotDeleteModal: FC<Props> = ({ onClose, visible, snapshotName }) => {
    const deleteSavedResume = useSavedStore((state) => state.deleteSavedResume);

    const handleDelete = () => {
        deleteSavedResume(snapshotName);
        onClose();
    };

    return (
        <Modal title="Delete Snapshot" visible={visible} onClose={onClose}>
            <p className="w-full">
                Are you sure you want to delete this snapshot?
            </p>
            <div className="flex gap-2">
                <Button
                    theme="danger"
                    className="py-2 w-full mt-2"
                    onClick={handleDelete}
                >
                    Yes, delete it
                </Button>
                <Button
                    theme="secondary"
                    className="py-2 w-full mt-2"
                    onClick={onClose}
                >
                    Cancel
                </Button>
            </div>
        </Modal>
    );
};

export default SnapshotDeleteModal;
