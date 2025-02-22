import { useEffect, useState } from "react";

interface MousePosition {
    x: number;
    y: number;
}

export const mouse = {
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0,
    isDown: false,
    isMoving: false,
    movementX: 0,
    movementY: 0,
    buttons: new Set<number>(),
};

export function setupMouse(): void {
    document.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.movementX = e.movementX;
        mouse.movementY = e.movementY;
        mouse.isMoving = true;
    });

    document.addEventListener("mousedown", (e) => {
        mouse.isDown = true;
        mouse.buttons.add(e.button);
    });

    document.addEventListener("mouseup", (e) => {
        mouse.isDown = false;
        mouse.buttons.delete(e.button);
    });

    document.addEventListener("mouseleave", () => {
        mouse.isDown = false;
        mouse.buttons.clear();
    });
}

export function useMousePosition(): MousePosition {
    const [mousePosition, setMousePosition] = useState<MousePosition>({
        x: 0,
        y: 0,
    });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return mousePosition;
}
