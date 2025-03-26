import { useQuery } from "@tanstack/react-query";
import { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { LikeButton } from "./LikeButton";
import { CommentsSection } from "./CommentsSection";
import { DownloadIcon, Copy, Share2 } from "lucide-react";

interface Props {
  postId: number;
}

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data as Post;
};

export const PostDetails = ({ postId }: Props) => {
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  const handleDownload = () => {
    if (!data?.project_url) {
      alert("Nenhum link de projeto disponível para download");
      return;
    }

    const link = document.createElement("a");
    link.href = data.project_url;
    link.target = "_blank";
    link.click();
  };

  const handleCopyLink = () => {
    const link = data?.project_url || "";
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copiado para a área de transferência!");
    });
  };

  const handleShare = () => {
    const link = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: data?.title || "Publicação no Fórum",
        text: "Confira esta publicação interessante",
        url: link,
      });
    } else {
      alert("Compartilhamento não suportado neste navegador.");
    }
  };

  if (isLoading) return <div>Carregando publicação...</div>;

  if (error) {
    return <div>Erro: {error.message}</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {data?.title}
      </h2>

      <p className="text-gray-400 text-lg">{data?.content}</p>

      <p className="text-gray-500 text-sm">
        Publicado em: {new Date(data!.created_at).toLocaleString()} por{" "}
        {data?.author}
      </p>

      {data?.project_url && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">Ações</h3>
          <div>
            <div className="flex flex-wrap gap-4 items-center justify-between p-6">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 font-bold"
              >
                <DownloadIcon size={18} />
                Baixar Projeto
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 font-bold"
              >
                <Copy size={18} />
                Copiar Link
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 font-bold"
              >
                <Share2 size={18} />
                Compartilhar
              </button>
            </div>
          </div>
        </div>
      )}

      <LikeButton postId={postId} />
      <CommentsSection postId={postId} />
    </div>
  );
};
