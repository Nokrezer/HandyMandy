import toast from "react-hot-toast";
import React from "react";

export const ShowMessage = (message) => toast(() => (
                <p className="info-message">
                    {message}
                </p>
                ), {
                    style:{
                        background: "var(--notify-messages-background)",
                        border: "var(--border-color)"
                    }
                });