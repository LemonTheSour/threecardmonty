export const SHUFFLE_COUNT = 6;
export const CARD_SPACING = 200;
export const INITIAL_DELAY = 2;
export const ARC_HEIGHT = -150;

export const DIFFICULTY = {
    easy: { shuffleCount: 5, speed: 1 },
    medium: { shuffleCount: 10, speed: 1.2 },
    hard: { shuffleCount: 15, speed: 1.5 },
};

export type Difficulty = keyof typeof DIFFICULTY;

export const DIALOGUE = {
    intro: [
        "Welcome to Three Card Monte...",
        "Find the queen and you win!",
        "Think you can keep up?",
    ],
    win: [
        "Lucky guess...",
        "Don't get too comfortable.",
        "Even a blind squirrel finds a nut.",
    ],
    lose: [
        "Ha! Better luck next time.",
        "The hand is quicker than the eye.",
        "Want to try again?",
    ],
    hardWin: ["This isn't even my final form!"],
    bossIntro: [
        "You think you're good enough for this?",
        "Let's see how you handle this...",
    ],
    earlyHandClick: ["Hey, no touching!", "Keep your eyes on the cards..."],
    bossWin: ["...How did you know?", "Impossible..."],
};

export type DialogueKey = keyof typeof DIALOGUE;
