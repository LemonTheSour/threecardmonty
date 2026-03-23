import { useCallback, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
    ARC_HEIGHT,
    INITIAL_DELAY,
    Difficulty,
    DIFFICULTY,
} from "../Constants/common.ts";
import { BlurFilter, type Sprite, type Container, Assets } from "pixi.js";
import { assignCards, flipCard } from "../Helpers/common.ts";
import { CardType } from "../Types/common.ts";
import { useDialogue } from "../Components/Contexts/DialogueContext.tsx";
import aceAsset from "../Assets/ace.png";

export const useCardGame = () => {
    const [canClick, setCanClick] = useState(false);
    const [cardTypes] = useState<CardType[]>(() => assignCards());
    const { triggerDialogue } = useDialogue();
    const aceTexture = useMemo(() => Assets.get(aceAsset), []);
    const [bossWon, setBossWon] = useState(false);

    const resetTextureFns = useRef<(() => void)[]>([]);
    const revealTextureFns = useRef<(() => void)[]>([]);
    const faceUpCardsRef = useRef<boolean[]>([false, false, false]);
    const cardRefs = useRef<(Container | null)[]>([]);
    const spriteRefs = useRef<(Sprite | null)[]>([]);
    const gameWonRef = useRef(false);
    const roundResolverRef = useRef<(() => void) | null>(null);
    const isBossRoundRef = useRef(false);

    const flipAllAces = useCallback(async () => {
        for (let i = 0; i < 3; i++) {
            const sprite = spriteRefs.current[i];
            if (!sprite) continue;
            await flipCard(sprite, () => {
                sprite.texture = aceTexture;
                faceUpCardsRef.current[i] = true;
            });
            await new Promise((resolve) => gsap.delayedCall(0.5, resolve));
        }
    }, [aceTexture]);

    const resetCards = useCallback(async () => {
        const flips = spriteRefs.current.map((sprite, index) => {
            if (!sprite || !faceUpCardsRef.current[index])
                return Promise.resolve();
            return flipCard(sprite, () => {
                resetTextureFns.current[index]?.();
            });
        });
        faceUpCardsRef.current = [false, false, false];
        await Promise.all(flips);
    }, []);

    const waitForPlayerInput = useCallback((): Promise<void> => {
        return new Promise((resolve) => {
            roundResolverRef.current = resolve;
        });
    }, []);

    const handleRightHandClick = useCallback(async () => {
        if (!isBossRoundRef.current) {
            triggerDialogue("earlyHandClick");
            return;
        }

        setBossWon(true);
        isBossRoundRef.current = false;
        setCanClick(false);
        await flipAllAces();
        triggerDialogue("bossWin");
        roundResolverRef.current?.();
        roundResolverRef.current = null;
    }, [flipAllAces, triggerDialogue]);

    const handleCardClick = useCallback(
        async (id: number, cardType: CardType) => {
            setCanClick(false);
            gameWonRef.current = cardType === "queen";
            faceUpCardsRef.current[id] = true;
            if (cardType === "queen") {
                triggerDialogue("win");
            } else {
                triggerDialogue("lose");
            }
            await new Promise((resolve) => gsap.delayedCall(1, resolve));
            roundResolverRef.current?.();
            roundResolverRef.current = null;
        },
        [triggerDialogue],
    );

    const swapCards = useCallback(
        (
            indexA: number,
            indexB: number,
            speed: number = 1,
            blur: boolean = false,
        ): Promise<void> => {
            return new Promise((resolve) => {
                const containerA = cardRefs.current[indexA];
                const containerB = cardRefs.current[indexB];
                if (!containerA || !containerB) return resolve();

                const posA = { x: containerA.x, y: containerA.y };
                const posB = { x: containerB.x, y: containerB.y };
                const duration = 0.2 / speed;

                if (blur) {
                    const blurA = new BlurFilter();
                    const blurB = new BlurFilter();
                    blurA.blur = 0;
                    blurB.blur = 0;
                    containerA.filters = [blurA];
                    containerB.filters = [blurB];

                    const proxy = { blur: 0 };
                    gsap.to(proxy, {
                        blur: 12,
                        duration: duration / 2,
                        onUpdate: () => {
                            blurA.blur = proxy.blur;
                            blurB.blur = proxy.blur;
                        },
                    });
                    gsap.to(proxy, {
                        blur: 0,
                        duration: duration / 2,
                        delay: duration / 2,
                        onUpdate: () => {
                            blurA.blur = proxy.blur;
                            blurB.blur = proxy.blur;
                        },
                        onComplete: () => {
                            containerA.filters = [];
                            containerB.filters = [];
                        },
                    });
                }

                const tl = gsap.timeline({ onComplete: () => resolve() });

                tl.to(
                    containerA,
                    {
                        x: (posA.x + posB.x) / 2,
                        y: posA.y + ARC_HEIGHT,
                        duration,
                        ease: "power1.out",
                    },
                    0,
                ).to(
                    containerA,
                    {
                        x: posB.x,
                        y: posB.y,
                        duration,
                        ease: "power1.in",
                    },
                    duration,
                );

                tl.to(
                    containerB,
                    {
                        x: (posA.x + posB.x) / 2,
                        y: posB.y - ARC_HEIGHT,
                        duration,
                        ease: "power1.out",
                    },
                    0,
                ).to(
                    containerB,
                    {
                        x: posA.x,
                        y: posA.y,
                        duration,
                        ease: "power1.in",
                    },
                    duration,
                );
            });
        },
        [],
    );

    const shuffleCards = useCallback(
        async (difficulty: Difficulty) => {
            const { shuffleCount, speed } = DIFFICULTY[difficulty];
            for (let i = 0; i < shuffleCount; i++) {
                const indexA = Math.floor(Math.random() * 3);
                let indexB = Math.floor(Math.random() * 3);
                while (indexB === indexA) {
                    indexB = Math.floor(Math.random() * 3);
                }
                await swapCards(indexA, indexB, speed);
            }
        },
        [swapCards],
    );

    const revealQueen = useCallback(async (queenIndex: number) => {
        const queenSprite = spriteRefs.current[queenIndex];
        if (!queenSprite) return;
        await flipCard(queenSprite, () => {
            revealTextureFns.current[queenIndex]?.();
            faceUpCardsRef.current[queenIndex] = true;
        });
        await new Promise((resolve) => gsap.delayedCall(1, resolve));
        await flipCard(queenSprite, () => {
            resetTextureFns.current[queenIndex]?.();
            faceUpCardsRef.current[queenIndex] = false;
        });
    }, []);

    const playRound = useCallback(
        async (difficulty: Difficulty): Promise<boolean> => {
            gameWonRef.current = false;
            setCanClick(false);
            await resetCards();
            await shuffleCards(difficulty);
            await new Promise((resolve) => gsap.delayedCall(1, resolve));
            setCanClick(true);
            await waitForPlayerInput();
            await new Promise((resolve) => gsap.delayedCall(2, resolve));
            return gameWonRef.current;
        },
        [resetCards, shuffleCards, waitForPlayerInput],
    );

    const playBossRound = useCallback(async (): Promise<boolean> => {
        isBossRoundRef.current = true;
        await new Promise((resolve) => gsap.delayedCall(2, resolve));
        triggerDialogue("bossIntro");
        await resetCards();
        setCanClick(true);
        for (let i = 0; i < 40; i++) {
            const indexA = Math.floor(Math.random() * 3);
            let indexB = Math.floor(Math.random() * 3);
            while (indexB === indexA) {
                indexB = Math.floor(Math.random() * 3);
            }
            await swapCards(indexA, indexB, 5, true);
        }
        await new Promise((resolve) => gsap.delayedCall(1, resolve));
        await waitForPlayerInput();
        return gameWonRef.current;
    }, [resetCards, triggerDialogue, waitForPlayerInput, swapCards]);

    const restartGame = useCallback(async () => {
        roundResolverRef.current?.();
        roundResolverRef.current = null;
        await resetCards();
        gameWonRef.current = false;
    }, [resetCards]);

    const startGame = useCallback(
        async (queenIndex: number) => {
            setCanClick(false);
            await new Promise((resolve) =>
                gsap.delayedCall(INITIAL_DELAY, resolve),
            );
            triggerDialogue("intro");
            await revealQueen(queenIndex);
            const wonRound1 = await playRound("easy");
            if (!wonRound1) {
                await revealQueen(queenIndex);
                await restartGame();
                await startGame(queenIndex);
                return;
            }

            const wonRound2 = await playRound("medium");
            if (!wonRound2) {
                await revealQueen(queenIndex);
                await restartGame();
                await startGame(queenIndex);
                return;
            }

            const wonRound3 = await playRound("hard");
            if (!wonRound3) {
                await revealQueen(queenIndex);
                await restartGame();
                await startGame(queenIndex);
                return;
            }
            await playBossRound();
        },
        [triggerDialogue, playRound, playBossRound, revealQueen, restartGame],
    );

    return {
        canClick,
        cardTypes,
        cardRefs,
        spriteRefs,
        resetTextureFns,
        revealTextureFns,
        isBossRoundRef,
        bossWon,
        startGame,
        handleCardClick,
        handleRightHandClick,
    };
};
