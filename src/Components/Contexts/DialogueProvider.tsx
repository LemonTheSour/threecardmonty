import type { ReactNode } from "react";
import { DialogueContext } from "./DialogueContext.tsx";
import type { DialogueKey } from "../../Constants/common";

interface DialogueProviderProps {
    triggerDialogue: (key: DialogueKey) => void;
    children: ReactNode;
}

export const DialogueProvider = ({
    triggerDialogue,
    children,
}: DialogueProviderProps) => {
    return (
        <DialogueContext.Provider value={{ triggerDialogue }}>
            {children}
        </DialogueContext.Provider>
    );
};
