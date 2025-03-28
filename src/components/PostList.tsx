import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  avatar_url?: string;
  like_count?: number;
  comment_count?: number;
  project_url: string;
  author: string;
  advisor: string;
}

const fetchPosts = async (searchTerm?: string): Promise<Post[]> => {
  const { data, error } = await supabase.rpc("get_posts_with_counts", {
    search_term: searchTerm || null,
  });

  if (error) throw new Error(error.message);

  return data as Post[];
};

interface PostListProps {
  searchTerm?: string;
}

export const PostList = ({ searchTerm }: PostListProps) => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts", searchTerm],
    queryFn: () => fetchPosts(searchTerm),
  });

  if (isLoading) return <div>Loading posts...</div>;

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-xl text-gray-400">
          {searchTerm
            ? `Nenhum projeto encontrado para "${searchTerm}" 😢`
            : "Nenhum projeto encontrado 😢"}
        </p>
        <p className="text-gray-500 mt-2">
          Tente ajustar sua busca ou criar um novo projeto
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {data.map((post, key) => (
        <PostItem post={post} key={key} />
      ))}
    </div>
  );
};
