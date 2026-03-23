import { useRef } from "react";
import gsap from "gsap";

interface StartSceneProps {
    onStart: () => void;
}

export const StartScene = ({ onStart }: StartSceneProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleStart = () => {
        gsap.to(containerRef.current, {
            y: -window.innerHeight,
            duration: 0.6,
            ease: "power2.in",
            onComplete: onStart,
        });
    };

    return (
        <div
            ref={containerRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "24px",
                backdropFilter: "blur(8px)",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                zIndex: 10,
            }}
        >
            <h1
                style={{
                    color: "white",
                    fontSize: "48px",
                    fontFamily: "Arial",
                    margin: 0,
                    textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                }}
            >
                Three Card Monte
            </h1>
            <button
                onClick={handleStart}
                style={{
                    padding: "12px 32px",
                    fontSize: "20px",
                    fontFamily: "Arial",
                    background: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
            >
                Start Game
            </button>
        </div>
    );
};
