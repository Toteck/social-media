import { useParams } from "react-router";
import { PostDetails } from "../components/PostDetails";

export const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="pt-10">
      <PostDetails postId={Number(id)} />
    </div>
  );
};
