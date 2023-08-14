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

    const open = (
        newMessage: string,
        newColor?: ColorType,
        newDuration?: number
    ) => {
        setMount(!mount);
        setIsOpen(true);
        setMessage(newMessage);
        if (newColor) setColor(newColor);
        if (newDuration) setDuration(newDuration);
    };

    const close = () => {
        setIsOpen(false);
        setDuration(DEFAULT_DURATION);
        setColor(DEFAULT_COLOR);
    };

    useEffect(() => {
        if (isOpen) timerRef.current = setTimeout(close, duration);
        return () => clearTimeout(timerRef.current);
    }, [isOpen, mount]);

    return { message, color, isOpen, open, close };
};

export default useSnackbar;
