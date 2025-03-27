import CommunityList from "../components/CommunityList";

const CommunitiesPage = () => {
  return (
    <div className="pt-20">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-green-500 to-emerald-700 bg-clip-text text-transparent">
        Trabalhos por curso
      </h2>
      <CommunityList />
    </div>
  );
};

export { CommunitiesPage };
