import { createContext, useContext } from "react";
import type { DialogueKey } from "../../Constants/common";

interface DialogueContextValue {
    triggerDialogue: (key: DialogueKey) => void;
}

export const DialogueContext = createContext<DialogueContextValue | null>(null);

export const useDialogue = () => {
    const context = useContext(DialogueContext);
    if (!context)
        throw new Error("useDialogue must be used within a DialogueProvider");
    return context;
};
