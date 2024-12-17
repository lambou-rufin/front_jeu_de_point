export interface IPlayer {
    id: string;
    name: string;
  }
  
  export interface IPoint {
    x: number;
    y: number;
  }
  
  export interface IRoundGame {
    id: string;
    players: IPlayer[];
  }
  
  export interface ISvgPath {
    d: string;
  }
  