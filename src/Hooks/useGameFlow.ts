import { useCallback, useState } from "react";
import { DIALOGUE, type DialogueKey } from "../Constants/common";

const getRandomLine = (key: DialogueKey): string => {
    const lines = DIALOGUE[key] as readonly string[];
    return lines[Math.floor(Math.random() * lines.length)];
};

export const useGameFlow = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [dialogueKey, setDialogueKey] = useState<DialogueKey | null>(null);
    const [currentLine, setCurrentLine] = useState<string>("");

    const handleStart = useCallback(() => {
        setGameStarted(true);
        setCurrentLine(getRandomLine("intro"));
        setDialogueKey("intro");
    }, []);

    const completeDialogue = useCallback(() => {
        setDialogueKey(null);
        setCurrentLine("");
    }, []);

    const triggerDialogue = useCallback((key: DialogueKey) => {
        setCurrentLine(getRandomLine(key));
        setDialogueKey(key);
    }, []);

    return {
        gameStarted,
        dialogueKey,
        currentLine,
        dialogueComplete: dialogueKey === null,
        handleStart,
        completeDialogue,
        triggerDialogue,
    };
};
