import { useState } from "react";
import { CommentItem } from "./CommentItem";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";

interface Props {
  postId: number;
}

interface NewComment {
  content: string;
  parent_comment_id?: number | null;
}

export interface Comment {
  id: number;
  post_id: number;
  parent_comment_id: number | null;
  content: string;
  user_id: string;
  created_at: string;
  author: string;
}

const createComment = async (
  newComment: NewComment,
  postId: number,
  userId?: string,
  author?: string
) => {
  console.log("Comment section =>", newComment, postId, userId, author);
  if (!userId || !author) {
    throw new Error("You must be logged in to comment.");
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: newComment.content,
    parent_comment_id: newComment.parent_comment_id || null,
    user_id: userId,
    author: author,
  });

  if (error) throw new Error(error.message);
};

const fetchComments = async (postId: number): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return data as Comment[];
};

const CommentsSection = ({ postId }: Props) => {
  const [newCommentText, setNewCommentText] = useState<string>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery<Comment[], Error>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    refetchInterval: 5000,
  });

  const author = user?.user_metadata.user_name
    ? user?.user_metadata.user_name
    : user?.user_metadata.name;

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: NewComment) =>
      createComment(newComment, postId, user?.id, author),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCommentText) return;

    mutate({ content: newCommentText, parent_comment_id: null });
    setNewCommentText("");
  };

  const buildCommentTree = (
    flatComments: Comment[]
  ): (Comment & { children?: Comment[] })[] => {
    const map = new Map<number, Comment & { children?: Comment[] }>();
    const roots: (Comment & { children?: Comment[] })[] = [];

    flatComments.forEach((comment) => {
      map.set(comment.id, { ...comment, children: [] });
    });

    flatComments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = map.get(comment.parent_comment_id);
        if (parent) {
          parent.children!.push(map.get(comment.id)!);
        }
      } else {
        roots.push(map.get(comment.id)!);
      }
    });

    return roots;
  };

  if (isLoading) {
    return <div> Carregando comentários...</div>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  const commentTree = comments ? buildCommentTree(comments) : [];

  return (
    <div className="mt-6">
      <h3 className="text-2xl font-semibold mb-4">Comentários</h3>
      {/* Create Comment Section */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="w-full border border-gray-500 bg-transparent p-2 rounded"
            placeholder="Escreva um comentário..."
            rows={3}
          />
          <button
            type="submit"
            className="mt-2 bg-emerald-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            {isPending ? "Publicando..." : "Publicar comentário"}
          </button>
          {isError && (
            <p className="text-red-500 mt-2">Erro ao publicar comentário.</p>
          )}
        </form>
      ) : (
        <p className="mb-4 text-gray-600">
          Você deve estar entrar na sua conta para comentar.
        </p>
      )}
      {/* Comments Display Section */}
      <div className="space-y-4">
        {commentTree.map((comment, key) => (
          <CommentItem key={key} comment={comment} postId={postId} />
        ))}
      </div>
    </div>
  );
};

export { CommentsSection };
