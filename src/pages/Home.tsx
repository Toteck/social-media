import { useState } from "react";
import { PostList } from "../components/PostList";
import Search from "../components/Search";

export const Home = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <div className="pt-10">
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-green-500 to-emerald-700 bg-clip-text text-transparent">
        Encontre projetos inspiradores
      </h2>
      <Search onSearch={setSearchTerm} />
      <div>
        <PostList searchTerm={searchTerm} />
      </div>
    </div>
  );
};
