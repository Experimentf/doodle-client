import { HTMLAttributes } from "react";
import { ColorType } from "../../types/color";

export type VariantType = "primary" | "secondary";

export interface ButtonType extends HTMLAttributes<HTMLButtonElement> {
    variant?: VariantType;
    color?: ColorType;
}
