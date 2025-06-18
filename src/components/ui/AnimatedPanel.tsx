import React, { useState } from "react";
import "./AnimatedPanel.css";

const AnimatedPanel = ({ children }: { children: React.ReactNode }) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div>
            <button onClick={toggleVisibility}>
                {isVisible ? "Hide Panel" : "Show Panel"}
            </button>
            <div className={`panel ${isVisible ? "fade-in" : "hidden"}`}>
                {children}
            </div>
        </div>
    );
};

export default AnimatedPanel;

