import { CreatePost } from "../components/CreatePost";

const CreatePostPage = () => {
  return (
    <div className="pt-20">
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-5 md:mb-6 text-center bg-gradient-to-r from-green-500 to-emerald-700 bg-clip-text text-transparent">
        Publique seu TCC ou Artigo Científico
      </h2>
      <CreatePost />
    </div>
  );
};

export { CreatePostPage };
