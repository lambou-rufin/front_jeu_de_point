import React from 'react';
import { ISvgPath } from 'types/Round';

interface ShowPathsProps {
  svgPaths: ISvgPath[];
}

const ShowPaths: React.FC<ShowPathsProps> = ({ svgPaths }) => {
  return (
    <>
      {svgPaths &&
        svgPaths.map(
          (path, index) =>
            path.isShow && (
              <g key={index}>
                <polyline
                  points={path.pathString}
                  fill="transparent"
                  fillOpacity='0.1'
                  stroke={path.player.color}
                  strokeWidth='4'
                  pointerEvents='none'
                />
              </g>
            ),
        )}
    </>
  );
};

export default ShowPaths;
