import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Rect } from "react-native-svg";

const BackgroundSVG = () => {
  return (
    <Svg style={StyleSheet.absoluteFillObject} height="100%" width="100%">
      {Array.from({ length: 10 }).map((_, index) => (
        <Rect
          key={index}
          x={`${index * 10}%`} // Adjust spacing
          y="0"
          width="5%" // Adjust width of stripes
          height="100%"
          fill={index % 2 === 0 ? "#14121C" : "#1C131E"} // Alternating dark shades
        />
      ))}
    </Svg>
  );
};

export default BackgroundSVG;
