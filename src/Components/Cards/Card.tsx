import { useEffect, useMemo, useRef, useState } from "react";
import { Assets, Container, Sprite } from "pixi.js";
import cardBackAsset from "../../Assets/cardback.png";
import queenAsset from "../../Assets/queen.jpg";
import aceAsset from "../../Assets/ace.png";
import type { CardType } from "../../Types/common";
import { flipCard } from "../../Helpers/common";

interface CardProps {
    x: number;
    y: number;
    id: number;
    cardType: CardType;
    canClick: boolean;
    onCardClick: (id: number, cardType: CardType) => void;
    containerRef: (el: Container | null) => void;
    spriteRef: (el: Sprite | null) => void;
    onResetTexture: (fn: () => void) => void;
    onRevealTexture: (fn: () => void) => void;
}

export const Card = ({
    x,
    y,
    id,
    cardType,
    canClick,
    onCardClick,
    containerRef,
    spriteRef,
    onResetTexture,
    onRevealTexture,
}: CardProps) => {
    const localSpriteRef = useRef<Sprite | null>(null);
    const backTexture = useMemo(() => Assets.get(cardBackAsset), []);
    const frontTexture = useMemo(
        () => Assets.get(cardType === "queen" ? queenAsset : aceAsset),
        [cardType],
    );
    const [texture, setTexture] = useState(backTexture);

    useEffect(() => {
        onResetTexture(() => setTexture(backTexture));
        onRevealTexture(() => setTexture(frontTexture));
    }, []); // eslint-disable-line

    const handleClick = () => {
        if (!canClick) return;
        const sprite = localSpriteRef.current;
        if (!sprite) return;
        flipCard(sprite, () => {
            setTexture(frontTexture);
        }).then(() => {
            onCardClick(id, cardType);
        });
    };

    return (
        <pixiContainer ref={containerRef} x={x} y={y}>
            <pixiSprite
                ref={(el) => {
                    localSpriteRef.current = el;
                    spriteRef(el);
                }}
                texture={texture}
                anchor={0.5}
                eventMode="static"
                cursor={canClick ? "pointer" : "default"}
                onClick={handleClick}
            />
        </pixiContainer>
    );
};
