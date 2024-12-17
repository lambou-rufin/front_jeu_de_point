// src/pages/Faritany.tsx

import { ReactComponent as LogOut } from 'assets/icons/logout.svg';
import { ReactComponent as Settings } from 'assets/icons/settings.svg';
import { ReactComponent as Info } from 'assets/icons/info.svg';
import { ReactComponent as ZoomIn } from 'assets/icons/zoom_in.svg';
import { ReactComponent as ZoomOut } from 'assets/icons/zoom_out.svg';
import { ReactComponent as RestartAlt } from 'assets/icons/restart_alt.svg';
// import Icon from 'components/Icon/Icon';
import Icon from '../../../shared/components/Icon/Icon';
// import { useToast } from 'contexts/ToastContext';
// import { useUser } from 'contexts/UserContext';
import { useToast } from '../../../contexts/ToastContext';
import { useUser } from '../../../contexts/UserContext';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux.toolkit/hooks';
import { setRound, updateRound } from 'redux.toolkit/state/round/reducers';
import { selectRoundState } from 'redux.toolkit/state/round/selectors';
import { socket } from 'socket/socket';
import 'styles/faritany.css';
// import { IPlayer, IPoint, IRoundGame, ISvgPath } from 'types/Round';
import { localStorageService } from 'utils/localStorage';
import FaritanyHeader from './components/FaritanyHeader';
import Feuille from './components/Feuille';
import GameOver from './components/GameOver';
import InteractiveSVG from './components/InteractiveSVG';
import QuitteGame from './components/QuitteGame';
import Setting from './components/Setting';
import RoundInfo from "./components/RoundInfo";
import { IPlayer, IPoint, IRoundGame, ISvgPath } from '../../../shared/models/interface';

const Faritany: React.FC = () => {
  /**
   * REDUX
   */
  const dispatch = useAppDispatch();
  const { round } = useAppSelector(selectRoundState);

  /**
   * CONTEXT
   */
  const { showToast } = useToast();
  const { user } = useUser();
  const navigate = useNavigate();
  const { roomName } = useParams();

  /**
   * VARIABLE
   */
  const [confirmQuite, setConfirmQuite] = useState<boolean>(false);
  const [doubleClickToPlace, setDoubleClickToPlace] = useState<boolean>(true);
  const [timerTurnPlayer, setTimerTurnPlayer] = useState<number>(0);
  const [timerGlobal, setTimerGlobal] = useState<number>(0);
  const [timerDisconected, setTimerDisconected] = useState<number>(0);
  const roundRef = useRef<IRoundGame | null>(null);
  const [alreadyClicked, setAlreadyClicked] = useState<boolean>(false);
  const [showTimerDisconected, setShowTimerDisconected] =
    useState<boolean>(false);
  const [alreadyJoinGame, setAlreadyJoinGame] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isOpenSetting, setIsOpenSetting] = useState<boolean>(false);
  const [isShowRoundInfo, setIsShowRoundInfo] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const interactiveSVGRef = useRef<{ zoomIn: () => void; zoomOut: () => void; resetZoom: () => void }>(null);

  /**
   * LIFECYCLE
   */
  useEffect(() => {
    const handleClickedPoint = (updatedRound: IRoundGame) => {
      if (!roundRef.current) return;

      // Créez une copie de la grille actuelle pour éviter les mutations directes
      const currentGrid = roundRef.current.grid.map((row) => [...row]);

      // Mettez à jour la copie de la grille avec le nouvel ID de propriétaire du point
      currentGrid[updatedRound.newPoint.x][updatedRound.newPoint.y] =
        updatedRound.newPoint.owner.id;

      // Créez une nouvelle liste de chemins SVG en combinant les anciens chemins avec les nouveaux
      let newSvgPaths = [
        ...roundRef.current.svgPaths,
        ...updatedRound.newSvgPaths,
      ];

      const updatedSvgPaths = updatedRound.updatedSvgPaths;
      if (updatedSvgPaths) {
        newSvgPaths = newSvgPaths.map((value: ISvgPath) => {
          return value.id === updatedSvgPaths.id
            ? { ...updatedSvgPaths, isShow: true }
            : { ...value };
        });
      }
      // Mettez à jour les joueurs avec les nouvelles informations
      const updatedPlayersList = roundRef.current.players.map((player) => {
        const updatedPlayer = updatedRound.updatedPlayers.find(
          (p) => p.id === player.id,
        );
        return updatedPlayer ? { ...player, ...updatedPlayer } : player;
      });

      // Créez l'objet updatedRound avec les nouvelles informations des joueurs et chemins SVG
      const newUpdatedRound = {
        ...updatedRound,
        players: updatedPlayersList,
        svgPaths: newSvgPaths,
      };

      // Vérifiez si le point appartient à l'utilisateur connecté
      const isUserPoint = updatedRound.newPoint.owner.userId === user?.id;

      // Mettez à jour le round avec les nouvelles informations
      const updatedRoundData = isUserPoint
        ? { ...newUpdatedRound }
        : { ...newUpdatedRound, grid: currentGrid };

      dispatch(updateRound(updatedRoundData));

      // Mettez à jour la référence du round courant
      roundRef.current = { ...roundRef.current, ...updatedRoundData };

      // Affichez une notification si un nouveau chemin SVG a été ajouté par l'utilisateur connecté
      if (
        updatedRound.newSvgPaths.length > 0 &&
        updatedRound.newSvgPaths[0].isShow &&
        isUserPoint
      ) {
        showToast('Bravo !', 'info', 3000);
      }

      console.timeEnd('test');
      setAlreadyClicked(false);
    };

    const handlePointAlreadyOccupied = (value: boolean) => {
      if (value) {
        showToast('Point deja occuper !', 'info', 3000);
      }
    };

    const handleUpdateTimer = (value: number) => {
      if (value && roundRef.current) {
        if (value % 10 === 0) {
          if (roundRef.current.playerTurn.userId === user?.id && value > 2) {
            showToast("C'est votre tour", 'info', 2000);
          }
        }
        setTimerTurnPlayer(value);
      }
    };

    const handleTimerExpired = (updatedRound: IRoundGame) => {
      dispatch(updateRound(updatedRound));
      roundRef.current = { ...roundRef.current, ...updatedRound };
      if (updatedRound.playerTurn.userId === user?.id) {
        setAlreadyClicked(false);
        showToast("C'est votre tour", 'info', 3000);
      }
    };

    const handleGameOver = (value: boolean) => {
      if (value) {
        showToast('Le jeu est déjà terminé !', 'info', 3000);
      }
    };

    const handlePlayerDisconnected = (idUserDisconnected: number) => {
      if (!roundRef.current) return;

      // Mettez à jour la liste des joueurs en marquant le joueur déconnecté comme absent
      const updatedPlayers = roundRef.current.players.map((player: IPlayer) =>
        player.userId === idUserDisconnected
          ? { ...player, isAbsent: true }
          : player,
      );

      // Créez une copie mise à jour de roundRef.current avec les joueurs mis à jour
      const updatedRound = { ...roundRef.current, players: updatedPlayers };

      // Trouvez un joueur qui est absent dans la liste des joueurs mis à jour
      const absentPlayer = updatedRound.players.find((p) => p.isAbsent);

      // Affichez un message d'information avec le pseudo du joueur absent et le temps restant pour gagner la partie
      if (absentPlayer) {
        showToast(
          `${absentPlayer.pseudo} a quitté la partie ! Vous avez ${roundRef.current.durationWhenPlayerIsAbsent} secondes pour gagner le jeu`,
          'info',
          5000,
        );
      }

      // Mettez à jour le round dans le store Redux avec les nouvelles informations
      dispatch(updateRound(updatedRound));

      // Mettez à jour la référence du round courant avec les nouvelles informations
      roundRef.current = updatedRound;
    };

    const handleAlreadyGameOver = (value: boolean) => {
      if (value) {
        showToast('Le jeu est déjà terminé !', 'info', 5000);
        navigate('/round');
      }
    };

    const handleQuitRound = (room: string) => {
      if (room === roomName) {
        navigate('/round');
      }
    };

    const handleJoinGame = (round: IRoundGame) => {
      dispatch(setRound({ ...round, grid: round.gridNumber }));
      roundRef.current = { ...round, grid: round.gridNumber };
      if (round?.players.every((value: IPlayer) => !value.isAbsent)) {
        setShowTimerDisconected(false);
      }
      setTimerGlobal(round.globalReamingTimeLeft);
    };

    const onTimerGlobalChange = (timerLeft: number) => {
      setTimerGlobal(timerLeft);
    };

    const handleTimerGlobalExpired = (updatedRound: IRoundGame) => {
      if (updatedRound) {
        dispatch(updateRound(updatedRound));
        roundRef.current = { ...roundRef.current, ...updatedRound };
      }
    };

    const onTimerDisconnectedChange = (timerLeft: number) => {
      if (timerLeft) {
        setShowTimerDisconected(true);
        setTimerDisconected(timerLeft);
      }
    };

    const handleTimerDisconectedExpired = (updatedRound: IRoundGame) => {
      if (updatedRound) {
        dispatch(updateRound(updatedRound));
        roundRef.current = { ...roundRef.current, ...updatedRound };
      }
    };

    const handleQuitGame = (updatedRound: IRoundGame) => {
      if (!roundRef.current) return;
      // Mettez à jour les joueurs avec les nouvelles informations
      const updatedPlayersList = roundRef.current.players.map((player) => {
        const updatedPlayer = updatedRound.updatedPlayers.find(
          (p) => p.id === player.id,
        );
        return updatedPlayer ? { ...player, ...updatedPlayer } : player;
      });

      dispatch(updateRound({ ...updatedRound, players: updatedPlayersList }));
      roundRef.current = { ...roundRef.current, ...updatedRound };
    };

    const handleDeletePoint = (point: { x: number, y: number }) => {
      if (!roundRef.current) return;
      const currentGrid = roundRef.current.grid.map((row) => [...row]);
      currentGrid[point.x][point.y] = null;
      const updatedRound = { ...roundRef.current, grid: currentGrid };
      dispatch(updateRound(updatedRound));
      roundRef.current = { ...roundRef.current, grid: currentGrid };
    }

    if (socket) {
      socket.on('clickedPoint', handleClickedPoint);
      socket.on('pointAlreadyOccupied', handlePointAlreadyOccupied);
      socket.on('timerUpdate', handleUpdateTimer);
      socket.on('timerExpired', handleTimerExpired);
      socket.on('gameOver', handleGameOver);
      socket.on('playerDisconnected', handlePlayerDisconnected);
      socket.on('alreadyGameOver', handleAlreadyGameOver);
      socket.on('quitRound', handleQuitRound);
      socket.on('quitGame', handleQuitGame);
      socket.on('joinedGame', handleJoinGame);
      socket.on('timerGlobal', onTimerGlobalChange);
      socket.on('timerGlobalExpired', handleTimerGlobalExpired);
      socket.on('timerDisconected', onTimerDisconnectedChange);
      socket.on('timerDisconectedExpired', handleTimerDisconectedExpired);
      socket.on('deletePoint', handleDeletePoint);

    }

    return () => {
      if (socket) {
        socket.off('clickedPoint');
        socket.off('pointAlreadyOccupied');
        socket.off('timerUpdate');
        socket.off('timerExpired');
        socket.off('gameOver');
        socket.off('playerDisconnected');
        socket.off('alreadyGameOver');
        socket.off('quitGame');
        socket.off('joinedGame');
        socket.off('timerGlobal');
        socket.off('timerGlobalExpired');
        socket.off('timerDisconected');
        socket.off('timerDisconectedExpired');
      }
    };
  }, []);

  useEffect(() => {
    if (roomName && user?.id && !alreadyJoinGame) {
      if (!socket) return;
      socket.emit('joinGame', { roomName: roomName, userId: user?.id });
      setAlreadyJoinGame(true);
    }
  }, [roomName, user]);

  useEffect(() => {
    const doubleClickToPlace = localStorageService.getItem('doubleClickToPlace');
    setDoubleClickToPlace(doubleClickToPlace === "true");
  }, []);

  useEffect(() => {
    if (round?.isGameOver && round.winner) {
      if (round.winner.userId === user?.id) {
        setShowConfetti(true)
      }
    }
  }, [round])

  /**
   * FUNCTION
   */
  const handleClick = (row: number, col: number) => {
    console.time('test');
    if (showTimerDisconected) {
      showToast("On doit attendre qu'un autre joueur rejoigne !", 'info', 3000);
      return;
    }

    if (alreadyClicked) {
      showToast("Ce n'est pas votre tour de jouer !", 'info', 3000);
      return;
    }

    if (!round || round.players.length !== 2) {
      showToast("On doit attendre qu'un autre joueur rejoigne !", 'info', 3000);
      return;
    }

    if (round.isGameOver) {
      showToast('Le jeu est déjà terminé !', 'info', 3000);
      return;
    }

    const userId = user?.id;
    const currentTurnPlayerId = round.playerTurn?.userId;

    if (!(userId && currentTurnPlayerId === userId)) {
      showToast("Ce n'est pas votre tour de jouer !", 'info', 3000);
      return;
    }

    const isOccupiedPoint = round.grid[row][col];

    if (isOccupiedPoint) {
      showToast('Point déjà occupé !', 'info', 3000);
      return;
    }

    const pointsAlreadyCaptured = filterSvgPathsByPointsCaptured(row, col);

    if (pointsAlreadyCaptured && pointsAlreadyCaptured.isShow) {
      showToast(
        "Vous ne pouvez pas ajouter votre point à l'interieur !",
        'info',
        3000,
      );
      return;
    }

    if (!roundRef.current) return;

    const currentGrid = round.grid.map((row) => [...row]); // Créez une copie profonde de la grille pour éviter la mutation directe
    currentGrid[row][col] = round.playerTurn.id; // Affectez le joueur courant au point sélectionné

    const updatedRound = { ...round, grid: currentGrid };
    dispatch(updateRound(updatedRound)); // Mise à jour de l'état avec la nouvelle grille
    roundRef.current = { ...roundRef.current, grid: currentGrid };
    if (!socket) return;

    socket.emit('clickedPoint', { x: row, y: col });
    setAlreadyClicked(true);
  };

  const filterSvgPathsByPointsCaptured = (
    x: number,
    y: number,
  ): ISvgPath | null | undefined => {
    return (
      round &&
      round.svgPaths.find((paths: ISvgPath) => {
        return paths.pointsCaptured.some(
          (p: IPoint) => p.x === x && p.y === y && p.isCaptured === false,
        );
      })
    );
  };

  const logOutGame = () => {
    setConfirmQuite(true);
  };

  const onConfirmQuit = () => {
    if (round?.isGameOver) {
      navigate('/round');
      return;
    }

    if (!socket) return;
    socket.emit('quitGame', roomName);
    navigate('/round');
  };


  const handleOpenSetting = () => {
    setIsOpenSetting(true);
  };

  const onChangeDoubleClick = (value: boolean) => {
    localStorageService.setItem("doubleClickToPlace", value.toString());
    setDoubleClickToPlace(value)
  }

  const handleZoomIn = () => {
    if (interactiveSVGRef.current) {
      interactiveSVGRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (interactiveSVGRef.current) {
      interactiveSVGRef.current.zoomOut();
    }
  };

  const handleResetZoom = () => {
    if (interactiveSVGRef.current) {
      interactiveSVGRef.current.resetZoom();
    }
  };

  return (
    <div className='faritany-container'>
      {round && round.gridSize && (
        <>
          <FaritanyHeader
            round={round}
            timerTurnPlayer={timerTurnPlayer}
            timerGlobal={timerGlobal}
            timerDisconected={timerDisconected}
            showTimerDisconected={showTimerDisconected}
          />
          <div className='game-area'>
            <GameOver
              isOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              round={round}
              showConfetti={showConfetti}
            />
            <QuitteGame
              isOpen={confirmQuite}
              setIsModalOpen={setConfirmQuite}
              onConfirmQuit={onConfirmQuit}
              isGameOver={round?.isGameOver}
            />
            <Setting
              isOpen={isOpenSetting}
              setIsModalOpen={setIsOpenSetting}
              onChangeDoubleClick={onChangeDoubleClick}
              doubleClickToPlace={doubleClickToPlace}
            />
            <RoundInfo
              isOpen={isShowRoundInfo}
              setIsModalOpen={setIsShowRoundInfo}
              round={round}
            />
            <InteractiveSVG doubleClickToPlace={doubleClickToPlace} round={round} ref={interactiveSVGRef}>
              <Feuille
                doubleClickToPlace={doubleClickToPlace}
                handleClick={handleClick}
                round={round}
              />
            </InteractiveSVG>

          </div>
          <footer className="footer-faritany">
            <div className="logout-icon">
              <Icon
                svg={<ZoomIn />}
                size={25}
                withCircle
                onClick={handleZoomIn}
              />
              <Icon
                svg={<ZoomOut />}
                size={25}
                withCircle
                onClick={handleZoomOut}
              />
              <Icon
                svg={<RestartAlt />}
                size={25}
                withCircle
                onClick={handleResetZoom}
              />
            </div>
            <div className='logout-icon'>
              <Icon
                svg={<Info />}
                size={25}
                withCircle
                onClick={() => { setIsShowRoundInfo(true) }}
              />
              <Icon
                svg={<Settings />}
                size={25}
                withCircle
                onClick={handleOpenSetting}
              />
              <Icon
                svg={<LogOut />}
                size={25}
                circleColor="danger"
                withCircle
                onClick={logOutGame}
              />
            </div>
          </footer>
        </>
      )}

    </div>
  );
};

export default Faritany;
