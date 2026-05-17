import toast from "react-hot-toast";
import React from "react";
export const ShowMessage = (message) => toast(() => (React.createElement("p", { className: "info-message" }, message)), {
    style: {
        background: "var(--notify-messages-background)",
        border: "var(--border-color)"
    }
});
