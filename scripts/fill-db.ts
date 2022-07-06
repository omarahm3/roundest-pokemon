import { PokemonClient } from 'pokenode-ts'
import { prisma } from '../src/api/utils/prisma'

const doBackFill = async () => {
  const pokeApi = new PokemonClient();
  const allPokes = await pokeApi.listPokemons(0, 493);

  console.log('Pokes:', allPokes);

  const formatted = allPokes.results.map((p, index) => {
    return {
      id:        index +1,
      name:      p.name,
      spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index +1}.png`
    }
  })

  const creation = await prisma.pokemon.createMany({
    data: formatted,
  });

  console.log('Creation:', creation);
}

doBackFill();
