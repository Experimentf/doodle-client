import { ColorType } from "../../types/color";

export const SnackbarClass = {
    primary: "bg-chalk-white text-board-green rounded-lg",
    secondary: "bg-chalk-blue text-board-green rounded-lg",
    success: "bg-chalk-green text-board-green rounded-lg",
    error: "bg-chalk-pink text-board-green rounded-lg",
    warning: "bg-chalk-yellow text-board-green rounded-lg",
};

export const getSnackbarColorClass = (color: ColorType) => {
    return SnackbarClass[color];
};
