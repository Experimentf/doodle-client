import { ButtonType } from "./Button.types";
import { getIconButtonVariantClass } from "./Button.utils";

const IconButton = ({
    variant = "primary",
    color = "primary",
    className,
    children,
    ...props
}: ButtonType) => {
    const variantClass = getIconButtonVariantClass(variant, color);

    return (
        <button
            className={`${className} rounded-full transition-all ${variantClass}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default IconButton;
