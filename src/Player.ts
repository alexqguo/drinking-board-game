import Game from './Game';

class Player {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  async getRoll() {
    return Math.floor(Math.random() * 6) + 1;
  }
}

export default Player;