import { GetServerSideProps } from "next"
import Image from "next/image";
import { prisma } from '@/api/utils/prisma'
import { AsyncReturnType } from '@/utils/helpers'

const getPokemonsInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      VoteFor: {
        _count: 'desc',
      },
    },
    select: {
      id:        true,
      name:      true,
      spriteUrl: true,
      _count: {
        select: {
          VoteFor:     true,
          VoteAgainst: true,
        },
      },
    },
  });
}

type PokemonQueryResult = AsyncReturnType<typeof getPokemonsInOrder>

const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
  const { VoteFor, VoteAgainst } = pokemon._count;

  if (VoteFor + VoteAgainst === 0) {
    return 0;
  }
  
  return (VoteFor / (VoteFor + VoteAgainst) ) * 100;
}

const PokemonListing: React.FC<{ pokemon: PokemonQueryResult[number] }> = ({ pokemon }) => {
  return (
    <div className="flex border-b p-2 items-center justify-between">
      <div className="flex items-center">
        <Image alt={pokemon.name} width={32} height={32} src={pokemon.spriteUrl} layout="fixed" />
        <div className="capitalize">
          {pokemon.name}
        </div>
      </div>
      <div className="pr-2">
        {generateCountPercent(pokemon) + "%"}
      </div>
    </div>
  )
}

const ResultsPage: React.FC<{ pokemons: PokemonQueryResult }> = ({ pokemons }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl p-4">Results</h2>
      <div className="flex flex-col w-full max-w-2xl border">
        {pokemons.map((pokemon, index) => {
          return <PokemonListing pokemon={pokemon} key={index} />
        })}
      </div>
    </div>
  )
}

export const getStaticProps: GetServerSideProps = async () => {
  const pokemons = await getPokemonsInOrder();

  return {
    props: {
      pokemons: pokemons,
    },
    revalidate: 60,
  }
}

export default ResultsPage;
