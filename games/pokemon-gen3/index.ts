import PokemonSelector from '../pokemon-gen1/PokemonSelector';
import TrainerBattle from '../pokemon-gen1/TrainerBattle';

// Small hack to ensure they're included in the bundle without having to complicate rollup config
console.info(`[pokemon-gen3] including web components ${PokemonSelector.name}, ${TrainerBattle.name}`);

const starterNames = {
  treecko: 'treecko',
  torchic: 'torchic',
  mudkip: 'mudkip',
};

const starterStrengths = {
  [starterNames.treecko]: starterNames.mudkip,
  [starterNames.torchic]: starterNames.treecko,
  [starterNames.mudkip]: starterNames.torchic,
};

const w = window as any;

if (w.drinking) {
  
}