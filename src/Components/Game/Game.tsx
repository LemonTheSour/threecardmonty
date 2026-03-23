import { useCallback, useEffect, useState } from "react";
import { calculateCanvasSize } from "../../Helpers/common.ts";
import { MainContainer } from "../MainContainer/MainContainer.tsx";

interface GameProps {
    gameStarted: boolean;
    dialogueComplete: boolean;
}

export const Game = ({ gameStarted, dialogueComplete }: GameProps) => {
    const [canvasSize, setCanvasSize] = useState(calculateCanvasSize);

    const updateCanvasSize = useCallback(() => {
        setCanvasSize(calculateCanvasSize());
    }, []);

    useEffect(() => {
        window.addEventListener("resize", updateCanvasSize);
        return () => window.removeEventListener("resize", updateCanvasSize);
    }, [updateCanvasSize]);

    return (
        <MainContainer
            canvasSize={canvasSize}
            gameStarted={gameStarted}
            dialogueComplete={dialogueComplete}
        />
    );
};
