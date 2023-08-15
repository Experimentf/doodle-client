import React, { useEffect, useRef, useState } from "react";
import { ColorType } from "../types/color";

const DEFAULT_DURATION = 3000;
const DEFAULT_COLOR = "primary";

const useSnackbar = () => {
    const timerRef = useRef<ReturnType<typeof setTimeout>>();
    const [mount, setMount] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [duration, setDuration] = useState(DEFAULT_DURATION);
    const [color, setColor] = useState<ColorType>(DEFAULT_COLOR);
    const [isInfinite, setIsInfinite] = useState(false);

    const open = ({
        message: newMessage,
        color: newColor,
        duration: newDuration,
        isInfinite: newIsInfinite,
    }: {
        message: string;
        color?: ColorType;
        duration?: number;
        isInfinite?: boolean;
    }) => {
        setMount(!mount);
        setIsOpen(true);
        setMessage(newMessage);
        if (newColor) setColor(newColor);
        if (newDuration) setDuration(newDuration);
        if (newIsInfinite) setIsInfinite(newIsInfinite);
    };

    const close = () => {
        setIsOpen(false);
        setDuration(DEFAULT_DURATION);
        setColor(DEFAULT_COLOR);
        setIsInfinite(false);
    };

    useEffect(() => {
        if (isOpen && !isInfinite)
            timerRef.current = setTimeout(close, duration);
        return () => clearTimeout(timerRef.current);
    }, [isOpen, isInfinite, mount]);

    return { message, color, isOpen, open, close };
};

export default useSnackbar;
