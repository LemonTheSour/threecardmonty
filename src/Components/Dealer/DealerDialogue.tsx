import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

interface DealerDialogueProps {
    text: string;
    onComplete?: () => void;
}

export const DealerDialogue = ({ text, onComplete }: DealerDialogueProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const tweenRef = useRef<gsap.core.Tween | null>(null);

    const playDialogue = useCallback(() => {
        if (!textRef.current || !containerRef.current) return;

        gsap.set(containerRef.current, { opacity: 1 });

        const chars = text.split("");
        const proxy = { index: 0 };

        if (tweenRef.current) tweenRef.current.kill();

        tweenRef.current = gsap.to(proxy, {
            index: chars.length,
            duration: chars.length * 0.05,
            ease: "none",
            onUpdate: () => {
                if (textRef.current) {
                    textRef.current.textContent = chars
                        .slice(0, Math.round(proxy.index))
                        .join("");
                }
            },
            onComplete: () => {
                gsap.delayedCall(2, () => {
                    gsap.to(containerRef.current, {
                        opacity: 0,
                        duration: 0.5,
                        onComplete,
                    });
                });
            },
        });
    }, [onComplete, text]);

    useEffect(() => {
        playDialogue();
    }, [playDialogue]);

    return (
        <div
            ref={containerRef}
            style={{
                position: "fixed",
                top: 80,
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(0, 0, 0, 0.75)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "12px",
                padding: "16px 28px",
                color: "white",
                fontFamily: "Arial",
                fontSize: "18px",
                minWidth: "320px",
                maxWidth: "500px",
                textAlign: "center",
                zIndex: 10,
                pointerEvents: "none",
            }}
        >
            <span ref={textRef} />
        </div>
    );
};
