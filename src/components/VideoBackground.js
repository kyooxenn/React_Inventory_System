import React from "react";
import "../VideoBackground.css"; // Create a CSS file for styling


const VideoBackground = () => {
    return (
        <video autoPlay loop muted playsInline className="background-video">
            <source src="../assets/background.mp4" type="video/mp4" />
        </video>
    );
};

export default VideoBackground;