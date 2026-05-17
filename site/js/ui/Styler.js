import React from "react";
export default function PageStyler({ path }) {
    return (React.createElement("link", { rel: "stylesheet", href: path }));
}
