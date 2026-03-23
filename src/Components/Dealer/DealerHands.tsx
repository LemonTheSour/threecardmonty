import { useEffect, useMemo, useRef } from "react";
import { Assets, Sprite } from "pixi.js";
import dealerLeftAsset from "../../assets/dealer-hand-left.png";
import dealerRightAsset from "../../assets/dealer-hand-right.png";
import queenAsset from "../../Assets/queen.jpg";
import { useCardGameContext } from "../Contexts/CardGameContext";
import gsap from "gsap";

const HAND_WIDTH = 929;
const HAND_HEIGHT = 697;
const TOP_OFFSET = -300;

interface DealerHandsProps {
    canvasWidth: number;
    onRightHandClick: () => void;
}

export const DealerHands = ({
    canvasWidth,
    onRightHandClick,
}: DealerHandsProps) => {
    const leftRef = useRef<Sprite | null>(null);
    const rightRef = useRef<Sprite | null>(null);
    const leftTexture = useMemo(() => Assets.get(dealerLeftAsset), []);
    const rightTexture = useMemo(() => Assets.get(dealerRightAsset), []);
    const queenRef = useRef<Sprite | null>(null);
    const queenTexture = useMemo(() => Assets.get(queenAsset), []);
    const { bossWon } = useCardGameContext();

    useEffect(() => {
        if (!bossWon || !queenRef.current) return;
        gsap.fromTo(
            queenRef.current,
            { y: -200, alpha: 0 },
            {
                x: HAND_WIDTH * 2 + 90,
                y: TOP_OFFSET + 700,
                alpha: 1,
                duration: 0.6,
                ease: "power2.out",
            },
        );
    }, [bossWon]);

    return (
        <pixiContainer>
            <pixiSprite
                ref={leftRef}
                texture={leftTexture}
                x={0}
                y={TOP_OFFSET}
                width={HAND_WIDTH}
                height={HAND_HEIGHT}
                eventMode="static"
            />

            <pixiSprite
                ref={queenRef}
                texture={queenTexture}
                x={canvasWidth / 2 - 100}
                y={-200}
                width={300}
                height={420}
                alpha={0}
            />

            <pixiSprite
                ref={rightRef}
                texture={rightTexture}
                x={canvasWidth - HAND_WIDTH}
                y={TOP_OFFSET}
                width={HAND_WIDTH}
                height={HAND_HEIGHT}
                eventMode="static"
                cursor="pointer"
                onClick={onRightHandClick}
            />
        </pixiContainer>
    );
};
