import { Background } from "../Background/Background";
import { CardTable } from "../CardTable/CardTable";
import { DealerHands } from "../../Components/Dealer/DealerHands.tsx";
import { useCardGameContext } from "../Contexts/CardGameContext.tsx";

interface MainContainerProps {
    canvasSize: { width: number; height: number };
    gameStarted: boolean;
}

export const MainContainer = ({
    canvasSize,
    gameStarted,
}: MainContainerProps) => {
    const { handleRightHandClick } = useCardGameContext();

    return (
        <pixiContainer>
            <Background width={canvasSize.width} height={canvasSize.height} />
            {gameStarted && <CardTable canvasSize={canvasSize} />}
            {gameStarted && (
                <DealerHands
                    canvasWidth={canvasSize.width}
                    onRightHandClick={handleRightHandClick}
                />
            )}
        </pixiContainer>
    );
};
