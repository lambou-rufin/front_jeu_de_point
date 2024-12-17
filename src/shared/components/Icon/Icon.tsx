import React, { FC } from 'react';

// Définir les props du composant Icon
interface IconProps {
  svg: React.ReactNode;  // Le SVG à afficher
  size: number;          // Taille de l'icône
  withCircle?: boolean;  // Si l'icône doit être dans un cercle
  circleColor?: string;  // Couleur du cercle (optionnel)
  onClick?: () => void;  // Fonction à appeler lors du clic sur l'icône
}

const Icon: FC<IconProps> = ({ svg, size, withCircle = false, circleColor, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: size,
        height: size,
        borderRadius: withCircle ? '50%' : 'none',
        backgroundColor: withCircle ? circleColor || '#ccc' : 'transparent',
        cursor: onClick ? 'pointer' : 'default',
        padding: withCircle ? '5px' : '0',  // Un peu de padding si avec cercle
      }}
    >
      <div style={{ width: size, height: size }}>
        {svg}
      </div>
    </div>
  );
};

export default Icon;
