import { Container, Sprite } from "pixi.js";
import { Application, extend } from "@pixi/react";

import { Game } from "./Components/Game/Game";
import { StartScene } from "./Components/StartScene/StartScene";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { DealerDialogue } from "./Components/Dealer/DealerDialogue";
import { useGameFlow } from "./Hooks/useGameFlow";
import { DialogueProvider } from "./Components/Contexts/DialogueProvider.tsx";
import { CardGameProvider } from "./Components/Contexts/CardGameProvider.tsx";
import { useAssets } from "./Hooks/useAssets.ts";

gsap.registerPlugin(MotionPathPlugin);

extend({ Container, Sprite });

export default function App() {
    const assetsLoaded = useAssets();
    const {
        gameStarted,
        dialogueKey,
        currentLine,
        handleStart,
        completeDialogue,
        triggerDialogue,
    } = useGameFlow();
    if (!assetsLoaded) return null;

    return (
        <DialogueProvider triggerDialogue={triggerDialogue}>
            <CardGameProvider>
                <Application background={"#1099bb"} resizeTo={window}>
                    <Game gameStarted={gameStarted} />
                </Application>
                {!gameStarted && <StartScene onStart={handleStart} />}
                {dialogueKey && (
                    <DealerDialogue
                        text={currentLine}
                        onComplete={completeDialogue}
                    />
                )}
            </CardGameProvider>
        </DialogueProvider>
    );
}
