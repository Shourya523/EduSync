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
      <div style={{ width: "100%", height: "100%", filter: "blur(1px)", opacity: 0.95 }}>
        <Snowfall
          color="#d89c57ff"
          snowflakeCount={40}
          radius={[2.0, 5.0]}
          wind={[-0.5, 2.0]}
          speed={[1.0, 3.0]}
        />
      </div>
    </div>
  );
}