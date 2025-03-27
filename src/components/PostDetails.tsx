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
      <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 text-justify bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
        {data?.title}
      </h2>

      <p className="text-gray-700 text-lg text-justify">{data?.content}</p>

      <p className="text-gray-500 text-sm">
        Publicado em: {new Date(data!.created_at).toLocaleString()} por{" "}
        {data?.author}
      </p>

      {data?.project_url && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">Ações</h3>
          <div>
            <div className="flex flex-wrap gap-4 bg-gray-300 rounded-xl items-center justify-between p-6 l">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 font-bold hover:text-green-500"
              >
                <DownloadIcon size={18} />
                Baixar Projeto
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 font-bold hover:text-green-500"
              >
                <Copy size={18} />
                Copiar Link
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 font-bold hover:text-green-500"
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
