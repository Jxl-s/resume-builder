import { FC, useState } from "react";
import Button from "../Button";
import { FaFileImport } from "react-icons/fa";
import Modal from "../Modal";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { v4 as uuidv4 } from "uuid";
import ImportModal from "../modals/ImportModal";
import { useTranslations } from "next-intl";

const ImportResume: FC<{ enabled: boolean }> = ({ enabled }) => {
    const t = useTranslations("ToolBar");
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <ImportModal
                onClose={() => setShowModal(false)}
                visible={showModal}
            />
            <Button
                theme="secondary"
                className="text-sm font-semibold px-5 flex items-center gap-2"
                onClick={() => setShowModal(true)}
                disabled={!enabled}
                title={
                    enabled
                        ? ""
                        : "Run the project locally to be able to import"
                }
            >
                <FaFileImport className="w-4 h-4" />
                {t("import")}
            </Button>
        </>
    );
};

export default ImportResume;
