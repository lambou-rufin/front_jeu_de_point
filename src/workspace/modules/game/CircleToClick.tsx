import React, { useEffect, useRef } from 'react';
import { IRoundGame } from '../../../shared/models/interface';

interface CircleToClickProps {
  round: IRoundGame;
  doubleClickToPlace: boolean;
  handleClick: (x: number, y: number) => void;
}

const CircleToClick: React.FC<CircleToClickProps> = ({
  round,
  doubleClickToPlace,
  handleClick,
}) => {
  const containerRef = useRef<SVGSVGElement>(null);

  const handleSingleClick = (rowIndex: number, colIndex: number) => {
    if (!doubleClickToPlace) {
      handleClick(rowIndex, colIndex);
    }
  };

  const handleDoubleClick = (rowIndex: number, colIndex: number) => {
    if (doubleClickToPlace) {
      handleClick(rowIndex, colIndex);
    }
  };

  return (
    <svg ref={containerRef} width='100%' height='100%'>
      {Array.from({ length: round.gridSize }).map((_, rowIndex) =>
        Array.from({ length: round.gridSize }).map((_, colIndex) => (
          <rect
            key={`${rowIndex}-${colIndex}-click`}
            id={`rect-${rowIndex}-${colIndex}`}
            x={colIndex * round.gridSize - round.gridSize / 4}
            y={rowIndex * round.gridSize - round.gridSize / 4}
            width={round.gridSize / 2}
            height={round.gridSize / 2}
            fill='transparent'
            onClick={() => handleSingleClick(rowIndex, colIndex)}
            onDoubleClick={() => handleDoubleClick(rowIndex, colIndex)} // Use native dbl
            style={{ cursor: 'pointer' }}
          />
        )),
      )}
    </svg>
  );
};

export default CircleToClick;
