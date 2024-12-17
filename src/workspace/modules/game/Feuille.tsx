import React from 'react';
import CircleToClick from './CircleToClick';
import ShowPaths from './ShowPaths';
import ShowPoint from './ShowPoint';
import { IRoundGame } from '../../../shared/models/interface';

interface FeuilleProps {
  round: IRoundGame;
  doubleClickToPlace: boolean;
  handleClick: (x: number, y: number) => void;
}
const Feuille: React.FC<FeuilleProps> = ({
  round,
  doubleClickToPlace,
  handleClick,
}) => {
  return (
    <>
      <svg
        viewBox={`0 0 ${round.gridSize * (round.gridSize - 3) + 2 * round.gridSize} ${(round.gridSize - 3) * round.gridSize + 2 * round.gridSize}`}
        style={{
          width: '100%',
          flex: 1,
          backgroundColor: 'white',
          overflow: 'visible',
          padding: '10px',
          boxSizing: 'border-box',
          zIndex: 10,
        }}
      >
        <defs>
          {/* Définir un motif de grille avec une taille de cellule basée sur `round.gridSize` */}
          <pattern
            id='grid'
            width={round.gridSize}
            height={round.gridSize}
            patternUnits='userSpaceOnUse'
          >
            {/* Définir des lignes horizontales et verticales pour le motif */}
            <path
              d={`M ${round.gridSize} 0 L 0 0 0 ${round.gridSize}`}
              fill='none'
              stroke='grey'
              strokeWidth='3'
            />
          </pattern>
        </defs>

        {/* Le rect qui utilise le motif de grille, ajusté pour couvrir précisément la zone */}
        <rect
          x='0'
          y='0'
          width={round.gridSize * 49.05}
          height={round.gridSize * 49.05}
          fill='url(#grid)'
        />

        {/* Autres éléments comme points et chemins */}
        <ShowPoint round={round} />
        <ShowPaths svgPaths={round.svgPaths} />
        <CircleToClick
          doubleClickToPlace={doubleClickToPlace}
          handleClick={handleClick}
          round={round}
        />

        {/* Texte en haut à gauche */}
        <text
          x='0'
          y='0'
          textAnchor='start'
          dominantBaseline='hanging'
          fill='black'
          fontSize='20'
          dx='10'
          dy='-30'
        >
          IKOPAKA Faritany
        </text>

        {/* Texte en bas à droite */}
        <text
          x='100%'
          y='100%'
          textAnchor='end'
          dominantBaseline='hanging'
          fill='black'
          fontSize='20'
          dx='-10'
          dy='30'
        >
          IKOPAKA Faritany
        </text>
      </svg>
    </>
  );
};

export default Feuille;
