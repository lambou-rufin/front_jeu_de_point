// import { IPlayer, IRoundGame } from 'types/Round';

import { IPlayer, IRoundGame } from "../../../shared/models/interface";

interface ShowPointProps {
  round: IRoundGame | null;
}

const ShowPoint: React.FC<ShowPointProps> = ({ round }) => {
  /**
   * FUNCTION
   **/
  const getColorOfPlayerById = (id: number) => {
    return round?.players.find((player: IPlayer) => player.id === id);
  };

  return (
    <>
      {round &&
        round.grid &&
        round.grid.map((row, rowIndex: number) =>
          row.map((cell, colIndex: number) =>
            cell ? (
              <g key={`${rowIndex}-${colIndex}`}>
                <circle
                  cx={colIndex * round.gridSize}
                  cy={rowIndex * round.gridSize}
                  r={round.gridSize / 6}
                  fill={getColorOfPlayerById(cell)?.color}
                  className={
                    round.newPoint &&
                      rowIndex === round.newPoint.x &&
                      colIndex === round.newPoint.y
                      ? 'blink'
                      : ''
                  }
                />
                {/* <text
                  x={colIndex * round.gridSize}
                  y={rowIndex * round.gridSize}
                  dy=".3em"
                  textAnchor="middle"
                  fontSize={round.gridSize / 5} // Ajuster la taille du texte si nécessaire
                  fill="black"
                >
                  {`${rowIndex}, ${colIndex}`}
                </text> */}
              </g>
            ) : null,
          ),
        )}
    </>
  );
};

export default ShowPoint;
