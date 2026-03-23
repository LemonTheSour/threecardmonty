import { Card } from "../Cards/Card";
import { getCardPositions } from "../../Helpers/common";
import { useEffect, useRef } from "react";
import { Container, Sprite } from "pixi.js";
import { useCardGameContext } from "../Contexts/CardGameContext";

interface CardTableProps {
    canvasSize: { width: number; height: number };
}

export const CardTable = ({ canvasSize }: CardTableProps) => {
    const positions = getCardPositions(canvasSize.width, canvasSize.height);
    const {
        canClick,
        cardTypes,
        cardRefs,
        spriteRefs,
        resetTextureFns,
        revealTextureFns,
        startGame,
        handleCardClick,
    } = useCardGameContext();

    const queenIndex = cardTypes.indexOf("queen");
    const hasStarted = useRef(false);

    const containerCallbackRefs = useRef(
        positions.map((_, index) => (el: Container | null) => {
            cardRefs.current[index] = el;
        }),
    );

    const spriteCallbackRefs = useRef(
        positions.map((_, index) => (el: Sprite | null) => {
            spriteRefs.current[index] = el;
        }),
    );

    useEffect(() => {
        if (hasStarted.current) return;
        hasStarted.current = true;
        startGame(queenIndex);
    }, []); // eslint-disable-line

    return (
        <pixiContainer>
            {positions.map((pos, index) => (
                <Card
                    key={index}
                    x={pos.x}
                    y={pos.y}
                    id={index}
                    cardType={cardTypes[index] ?? "ace"}
                    canClick={canClick}
                    onCardClick={handleCardClick}
                    containerRef={containerCallbackRefs.current[index]}
                    spriteRef={spriteCallbackRefs.current[index]}
                    onResetTexture={(fn) => {
                        resetTextureFns.current[index] = fn;
                    }}
                    onRevealTexture={(fn) => {
                        revealTextureFns.current[index] = fn;
                    }}
                />
            ))}
        </pixiContainer>
    );
};
