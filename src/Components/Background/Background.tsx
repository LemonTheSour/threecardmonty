import { useMemo } from "react";
import { Assets } from "pixi.js";
import backgroundAsset from "../../Assets/background.jpg";

interface BackgroundProps {
    width: number;
    height: number;
}

export const Background = ({ width, height }: BackgroundProps) => {
    const texture = useMemo(() => Assets.get(backgroundAsset), []);
    return <pixiSprite texture={texture} width={width} height={height} />;
};
