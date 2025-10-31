import Ranking from "./ranking-component";

export default function RankingPage() {
  return (
    <Ranking
      rpsId={process.env.NEXT_PUBLIC_RPS_ID!}
      cwId={process.env.NEXT_PUBLIC_CW_ID!}
    />
  );
}
