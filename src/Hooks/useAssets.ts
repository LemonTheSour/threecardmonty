import { useState, useEffect } from "react";
import { Assets } from "pixi.js";
import backgroundAsset from "../Assets/background.jpg";
import queenAsset from "../Assets/queen.jpg";
import cardBackAsset from "../Assets/cardback.png";
import aceAsset from "../Assets/ace.png";
import dealerLeftAsset from "../Assets/dealer-hand-left.png";
import dealerRightAsset from "../Assets/dealer-hand-right.png";

const ASSETS = [
    backgroundAsset,
    queenAsset,
    cardBackAsset,
    aceAsset,
    dealerLeftAsset,
    dealerRightAsset,
];

export const useAssets = () => {
    const [assetsLoaded, setAssetsLoaded] = useState(false);

    useEffect(() => {
        Assets.load(ASSETS).then(() => setAssetsLoaded(true));
    }, []);

    return assetsLoaded;
};
