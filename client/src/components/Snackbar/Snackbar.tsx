import { X } from "react-feather";
import { ColorType } from "../../types/color";
import { getSnackbarColorClass } from "./Snackbar.utils";
import Button from "../Button/Button";

interface SnackbarOptions {
    open: boolean;
    message: string;
    handleClose: () => void;
    color?: ColorType;
}

const Snackbar = ({
    open,
    message,
    handleClose,
    color = "primary",
}: SnackbarOptions) => {
    const colorClass = getSnackbarColorClass(color);
    return (
        <div
            className={`fixed left-0 bottom-0 m-5 max-w-full  transition-all ${colorClass} ${
                open
                    ? "visible opacity-100 scale-100"
                    : "invisible opacity-0 scale-0"
            }`}
        >
            <div className="relative">
                <button
                    className="absolute right-0 top-0 m-2"
                    onClick={handleClose}
                >
                    <X className="stroke-board-green" size={18} />
                </button>
            </div>
            <p className="py-5 px-8">{message}</p>
        </div>
    );
};

export default Snackbar;
