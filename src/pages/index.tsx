import { useState } from "react";
import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";

const btn = "inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"

const Home: NextPage = () => {
  // TODO the SSR text mismatch can be solved using getServerSideProps
  const [ids, updateIds]                  = useState(() => getOptionsForVote());
  const [first, second]: [number, number] = ids;

  const firstPokemon  = trpc.useQuery(["get-pokemon-by-id", { id: first }]);
  const secondPokemon = trpc.useQuery(["get-pokemon-by-id", { id: second }]);

  if (firstPokemon.isLoading || secondPokemon.isLoading) {
    return null
  }

  const voteForRoundest = (selected: number) => {
    // TODO: fire mutation to persist changes

    updateIds(getOptionsForVote());
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is rounder?</div>
      <div className="p-2" />
      <div className="border rounded p-8 flex justify-between max-w-2xl items-center">
        <div className="w-64 h-64 flex flex-col items-center">
          <img src={firstPokemon.data?.sprites.front_default} className="w-full" />
          <div className="text-xl text-center capitalize mt-[-2rem]">
            {firstPokemon.data?.name}
          </div>
          <button
            className={btn}
            onClick={() => voteForRoundest(first)}>
            Rounder
          </button>
        </div>
        <div className="p-8">Vs</div>
        <div className="w-64 h-64 flex flex-col items-center">
          <img src={secondPokemon.data?.sprites.front_default} className="w-full" />
          <div className="text-xl text-center capitalize mt-[-2rem]">
            {secondPokemon.data?.name}
          </div>
          <button
            className={btn}
            onClick={() => voteForRoundest(second)}>
            Rounder
          </button>
        </div>
      </div>
      <div className="p-2" />
    </div>
  );
};

export default Home;
