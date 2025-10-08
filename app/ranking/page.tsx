import RankingList from "@/components/ui/general/ranking/RankingList";
import TopThree from "@/components/ui/general/ranking/TopThree";
import data from "@/users.json";

export default function Ranking() {
  const sortedUsers = [...data.users].sort((a, b) => b.score - a.score);

  const firstPlace = sortedUsers[0];
  const secondPlace = sortedUsers[1];
  const thirdPlace = sortedUsers[2];
  const restOfUsers = sortedUsers.slice(3);

  return (
    <div className="flex flex-col min-h-screen items-center my-20 mt-45">
      <TopThree
        firstPlace={firstPlace}
        secondPlace={secondPlace}
        thirdPlace={thirdPlace}
      />
      <RankingList users={restOfUsers} />
    </div>
  );
}
