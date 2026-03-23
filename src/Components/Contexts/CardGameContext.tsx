import { createContext, useContext, type RefObject } from "react";
import type { CardType } from "../../Types/common";
import type { Container, Sprite } from "pixi.js";

interface CardGameContextValue {
    canClick: boolean;
    cardTypes: CardType[];
    cardRefs: RefObject<(Container | null)[]>;
    spriteRefs: RefObject<(Sprite | null)[]>;
    resetTextureFns: RefObject<(() => void)[]>;
    revealTextureFns: RefObject<(() => void)[]>;
    bossWon: boolean;
    startGame: (queenIndex: number) => Promise<void>;
    handleCardClick: (id: number, cardType: CardType) => Promise<void>;
    handleRightHandClick: () => Promise<void>;
}

export const CardGameContext = createContext<CardGameContextValue | null>(null);

export const useCardGameContext = () => {
    const context = useContext(CardGameContext);
    if (!context)
        throw new Error(
            "useCardGameContext must be used within a CardGameProvider",
        );
    return context;
};
