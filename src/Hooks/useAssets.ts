import { useState, useEffect } from "react";
import { Assets } from "pixi.js";
import backgroundAsset from "../assets/background.jpg";
import queenAsset from "../assets/queen.jpg";
import cardBackAsset from "../assets/cardback.png";
import aceAsset from "../assets/ace.png";
import dealerLeftAsset from "../assets/dealer-hand-left.png";
import dealerRightAsset from "../assets/dealer-hand-right.png";

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
