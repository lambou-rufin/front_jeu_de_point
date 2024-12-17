import React, { ReactNode, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { TransformComponent, TransformWrapper, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import 'styles/interactiveSVG.css';
import { IRoundGame } from '../../../shared/models/interface';

interface InteractiveSVGProps {
  children: ReactNode;
  doubleClickToPlace?: boolean;
  round?: IRoundGame;
}

const InteractiveSVG = forwardRef<{
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}, InteractiveSVGProps>(({
  doubleClickToPlace,
  children,
  round
}, ref) => {
  const transformWrapperRef = useRef<ReactZoomPanPinchRef | null>(null);

  // Fonction pour zoomer
  const zoomIn = () => {
    if (transformWrapperRef.current) {
      transformWrapperRef.current.zoomIn();
    }
  };

  // Fonction pour dézoomer
  const zoomOut = () => {
    if (transformWrapperRef.current) {
      transformWrapperRef.current.zoomOut();
    }
  };

  // Fonction pour réinitialiser le zoom
  const resetZoom = () => {
    if (transformWrapperRef.current) {
      if (round && round?.newPoint) {
        const { newPoint } = round;
        const elementId = `rect-${newPoint.x}-${newPoint.y}`;
        zoomToElement(elementId);
      } else {
        transformWrapperRef.current.resetTransform();
      }
    }
  };

  // Expose les fonctions au composant parent via la ref
  useImperativeHandle(ref, () => ({
    zoomIn,
    zoomOut,
    resetZoom,
  }));

  // Utiliser zoomToElement avec l'ID de l'élément
  const zoomToElement = (elementId: string) => {
    if (transformWrapperRef.current) {
      const element = document.getElementById(elementId);
      if (element) {
        transformWrapperRef.current.zoomToElement(element);
      }
    }
  };

  useEffect(() => {
    if (round && round?.newPoint) {
      const { newPoint } = round;
      const elementId = `rect-${newPoint.x}-${newPoint.y}`;
      zoomToElement(elementId);
    }
  }, [round]);

  return (
    <TransformWrapper
      initialScale={3}
      initialPositionX={50}
      initialPositionY={50}
      minScale={1}
      maxScale={6}
      alignmentAnimation={{ animationType: "easeInOutCubic" }}
      limitToBounds={true}
      centerOnInit={true}
      centerZoomedOut={true}
      smooth={true}
      doubleClick={{ disabled: doubleClickToPlace }}
      zoomAnimation={{ disabled: true }}
      velocityAnimation={{ disabled: true }}
      ref={transformWrapperRef}
    >
      <TransformComponent
        wrapperStyle={{
          width: '100%',
          height: '100%'
        }}
      >
        {children}
      </TransformComponent>
    </TransformWrapper>
  );
});

export default InteractiveSVG;
