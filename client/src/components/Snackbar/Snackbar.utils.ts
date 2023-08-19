import { ColorType } from "../../types/color";

export const SnackbarClass = {
    primary: "bg-chalk-white text-board-green",
    secondary: "bg-chalk-blue text-board-green",
    success: "bg-chalk-green text-board-green",
    error: "bg-chalk-pink text-board-green",
    warning: "bg-chalk-yellow text-board-green",
};

export const getSnackbarColorClass = (color: ColorType) => {
    return SnackbarClass[color];
};
