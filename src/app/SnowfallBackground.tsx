"use client";

import React from "react";
import Snowfall from "react-snowfall";

export default function SnowfallBackground() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      <Snowfall
        // Gold color to match the "Ansh" text and "Pro-Tip" badge
        color="#d89c57ff" 
        // Increased count slightly for a celebration vibe
        snowflakeCount={30}
        // Slightly larger particles to look more like confetti
        radius={[1.5, 4.0]} 
        // Adds a bit of wind for movement
        wind={[-0.5, 2.0]}
        speed={[1.0, 3.0]}
      />
    </div>
  );
}