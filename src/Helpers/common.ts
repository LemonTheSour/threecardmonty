import { Sprite } from "pixi.js";
import { CardType } from "../Types/common";
import gsap from "gsap";

export const calculateCanvasSize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return { width, height };
};

export const getCardPositions = (canvasWidth: number, canvasHeight: number) => {
    const spacing = 400;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 1.5;

    return [
        { id: 0, x: centerX - spacing, y: centerY },
        { id: 1, x: centerX, y: centerY },
        { id: 2, x: centerX + spacing, y: centerY },
    ];
};

export const assignCards = (): CardType[] => {
    const cards: CardType[] = ["ace", "ace", "queen"];
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
};

export const flipCard = (
    sprite: Sprite,
    onMidpoint: () => void,
): Promise<void> => {
    return new Promise((resolve) => {
        const proxy = { scaleX: 1 };
        gsap.to(proxy, {
            scaleX: 0,
            duration: 0.15,
            ease: "power1.in",
            onUpdate: () => {
                sprite.scale.x = proxy.scaleX;
            },
            onComplete: () => {
                onMidpoint();
                gsap.to(proxy, {
                    scaleX: 1,
                    duration: 0.15,
                    ease: "power1.out",
                    onUpdate: () => {
                        sprite.scale.x = proxy.scaleX;
                    },
                    onComplete: resolve,
                });
            },
        });
    });
};
