import { Assets, Container, Sprite } from "pixi.js";
import { Application, extend } from "@pixi/react";
import backgroundAsset from "./assets/background.jpg";
import queenAsset from "./Assets/queen.jpg";
import cardBackAsset from "./Assets/cardback.png";
import aceAsset from "./Assets/ace.png";
import dealerLeftAsset from "./Assets/dealer-hand-left.png";
import dealerRightAsset from "./Assets/dealer-hand-right.png";

import { Game } from "./Components/Game/Game";
import { StartScene } from "./Components/StartScene/StartScene";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { DealerDialogue } from "./Components/Dealer/DealerDialogue";
import { useGameFlow } from "./Hooks/useGameFlow";
import { DialogueProvider } from "./Components/Contexts/DialogueProvider.tsx";
import { CardGameProvider } from "./Components/Contexts/CardGameProvider.tsx";

gsap.registerPlugin(MotionPathPlugin);
await Assets.load([
    backgroundAsset,
    queenAsset,
    cardBackAsset,
    aceAsset,
    dealerLeftAsset,
    dealerRightAsset,
]);
extend({ Container, Sprite });

export default function App() {
    const {
        gameStarted,
        dialogueKey,
        currentLine,
        dialogueComplete,
        handleStart,
        completeDialogue,
        triggerDialogue,
    } = useGameFlow();

    return (
        <DialogueProvider triggerDialogue={triggerDialogue}>
            <CardGameProvider>
                <Application background={"#1099bb"} resizeTo={window}>
                    <Game
                        gameStarted={gameStarted}
                        dialogueComplete={dialogueComplete}
                    />
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
