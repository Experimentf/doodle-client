import { ColorType } from "../../types/color";
import { VariantType } from "./Button.types";

const PrimaryVariantClasses = {
    primary:
        "border-4 btn-primary border-chalk-white bg-chalk-white text-board-green hover:bg-dark-chalk-white hover:border-dark-chalk-white",
    secondary:
        "border-4 btn-primary border-chalk-blue bg-chalk-blue text-board-green hover:bg-dark-chalk-blue hover:border-dark-chalk-blue",
    success:
        "border-4 btn-primary border-chalk-green bg-chalk-green text-board-green hover:bg-dark-chalk-green hover:border-dark-chalk-green",
    error: "border-4 btn-primary border-chalk-pink bg-chalk-pink text-board-green hover:bg-dark-chalk-pink hover:border-dark-chalk-pink",
    warning:
        "border-4 btn-primary border-chalk-yellow bg-chalk-yellow text-board-green hover:bg-dark-chalk-yellow hover:border-dark-chalk-yellow",
};

const SecondaryVariantClasses = {
    primary:
        "border-t-2 border-l-2 border-r-8 border-b-8 bg-transparent border-chalk-white text-chalk-white hover:text-board-green focus:text-board-green hover:bg-chalk-white focus:bg-chalk-white",
    secondary:
        "border-t-2 border-l-2 border-r-8 border-b-8 bg-transparent border-chalk-blue text-chalk-blue hover:text-board-green focus:text-board-green hover:bg-chalk-blue focus:bg-chalk-blue",
    success:
        "border-t-2 border-l-2 border-r-8 border-b-8 bg-transparent border-chalk-green text-chalk-green hover:text-board-green focus:text-board-green hover:bg-chalk-green focus:bg-chalk-green",
    error: "border-t-2 border-l-2 border-r-8 border-b-8 bg-transparent border-chalk-pink text-chalk-pink hover:text-board-green focus:text-board-green hover:bg-chalk-pink focus:bg-chalk-pink",
    warning:
        "border-t-2 border-l-2 border-r-8 border-b-8 bg-transparent border-chalk-yellow text-chalk-yellow hover:text-board-green focus:text-board-green hover:bg-chalk-yellow focus:bg-chalk-yellow",
};

export const getVariantClass = (variant: VariantType, color: ColorType) => {
    if (variant === "primary") {
        return PrimaryVariantClasses[color];
    }

    return SecondaryVariantClasses[color];
};
