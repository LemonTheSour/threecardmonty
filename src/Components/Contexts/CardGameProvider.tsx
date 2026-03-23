import type { ReactNode } from "react";
import { CardGameContext } from "./CardGameContext";
import { useCardGame } from "../../Hooks/useCardGame";

export const CardGameProvider = ({ children }: { children: ReactNode }) => {
    const cardGame = useCardGame();

    return (
        <CardGameContext.Provider value={cardGame}>
            {children}
        </CardGameContext.Provider>
    );
};
