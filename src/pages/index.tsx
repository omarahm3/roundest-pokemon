import { useState } from "react";
import Image from "next/image";
import type { NextPage } from "next";
import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import { inferQueryResponse } from "./api/trpc/[trpc]";
import Link from "next/link";

const btn = "inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"

const Home: NextPage = () => {
  // TODO the SSR text mismatch can be solved using getServerSideProps
  const [ids, updateIds]                  = useState(() => getOptionsForVote());
  const [first, second]: [number, number] = ids;

  const firstPokemon  = trpc.useQuery(["get-pokemon-by-id", { id: first }]);
  const secondPokemon = trpc.useQuery(["get-pokemon-by-id", { id: second }]);
  const voteMutation  = trpc.useMutation(['cast-vote']);

  if (firstPokemon.isLoading || secondPokemon.isLoading) {
    return null
  }

  const voteForRoundest = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    } else {
      voteMutation.mutate({ votedFor: second, votedAgainst: first });
    }
    updateIds(getOptionsForVote());
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is rounder?</div>
      <div className="p-2" />
      <div className="border rounded p-8 flex justify-between max-w-2xl items-center">
        {!firstPokemon.isLoading && firstPokemon.data && !secondPokemon.isLoading && secondPokemon.data && (
          <>
            <PokemonListing pokemon={firstPokemon.data} vote={() => voteForRoundest(first)} />
            <div className="p-8">Vs</div>
            <PokemonListing pokemon={secondPokemon.data} vote={() => voteForRoundest(second)} />
          </>
        )}
      </div>
      <div className="p-2" />
      <div className="absolute bottom-0 w-full text-xl text-center pb-2">
        <Link href="/results">Results</Link>
      </div>
    </div>
  );
};

type PokemonFromServer = inferQueryResponse<"get-pokemon-by-id">;

const PokemonListing: React.FC<{pokemon: PokemonFromServer, vote: () => void}> = ({ pokemon, vote }) => {
  return (
    <div className="w-64 h-64 flex flex-col items-center">
      <Image alt={pokemon.name} width={256} height={256} src={pokemon.spriteUrl} layout="fixed" />
      <div className="text-xl text-center capitalize mt-[-2rem]">
        {pokemon.name}
      </div>
      <button
        className={btn}
        onClick={() => vote()}>
        Rounder
      </button>
    </div>
  )
}

export default Home;
