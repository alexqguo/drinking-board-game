import PokemonSelector from '../pokemon-gen1/PokemonSelector';

// Small hack to ensure they're included in the bundle without having to complicate rollup config
console.info(`[pokemon-gen2] including web components ${PokemonSelector.name}`);

const starterNames = {
  chikorita: 'chikorita',
  cyndaquil: 'cyndaquil',
  totodile: 'totodile',
};

const w = window as any;

if (w.drinking) {
  const { Game, GameEvents, events } = w.drinking;

  GameEvents.on(events.GAME_START, (next: Function) => {
    const frag: DocumentFragment = document.createDocumentFragment();
    const pokemonSelector: HTMLElement = document.createElement('pokemon-selector');
    const playerNames: string[] = Game.players.map((p: any) => p.name);
    pokemonSelector.setAttribute('playerNames', JSON.stringify(playerNames));
    pokemonSelector.setAttribute('starterNames', JSON.stringify(Object.values(starterNames)));
    pokemonSelector.addEventListener('pokemon-selected', (e: CustomEvent) => {
      e.detail.pokemon.forEach((pokemon: string, i: number) => {
        Game.players[i].custom.pokemon = pokemon;
      });
      Game.modal.close();
      next();
    });

    frag.appendChild(pokemonSelector);
    Game.modal.openWithFragment('Choose your Pokemon!', frag);
    Game.modal.disableClose();
  });
}