import { Link } from "react-router";
import { Post } from "./PostList";
import { Heart, MessageCircle } from "lucide-react";

interface Props {
  post: Post;
}

export const PostItem = ({ post }: Props) => {
  if (!post.avatar_url) return <h2>Carregando...</h2>;

  return (
    <>
      {/* Mobile Version (hidden on md and up) */}
      <div className="relative group md:hidden">
        <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-emerald-400 to-emerald-600 blur-sm opacity-0 group-hover:opacity-50 transition duration-300 pointer-events-none"></div>
        <Link to={`/post/${post.id}`} className="block relative z-10">
          <div className="w-80 h-fit bg-white border border-emerald-100 rounded-[20px] text-gray-800 flex flex-col p-5 overflow-hidden transition-colors duration-300 group-hover:bg-emerald-50">
            {/* Header: Avatar and Title */}
            <div className="flex items-center space-x-2">
              {post.avatar_url ? (
                <div className="flex items-center">
                  <img
                    src={post.avatar_url}
                    alt="User avatar"
                    className="w-[35px] h-[35px] rounded-full object-cover"
                  />
                  <span className="ml-2 text-emerald-800">{post.author}</span>
                </div>
              ) : (
                <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-tl from-emerald-400 to-emerald-600" />
              )}
            </div>
            <div className="flex flex-col flex-1">
              <div className="text-[20px] leading-[22px] font-semibold mt-2 text-justify text-emerald-900">
                {post.title}
              </div>
            </div>

            <div className="mt-2 flex-1">
              <p className="line-clamp-3 overflow-hidden text-ellipsis text-justify text-gray-600">
                {post.content}
              </p>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="flex justify-start items-center">
                <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg text-emerald-600">
                  <Heart /> <span className="ml-2">{post.like_count ?? 0}</span>
                </span>
                <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg text-emerald-600">
                  <MessageCircle />{" "}
                  <span className="ml-2">{post.comment_count ?? 0}</span>
                </span>
              </div>
              <span className="text-sm text-emerald-600">
                Publicado em: {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Desktop Version (hidden on md and down) */}
      <div className="relative group hidden md:block">
        <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 blur-sm opacity-0 group-hover:opacity-50 transition duration-300 pointer-events-none"></div>
        <Link to={`/post/${post.id}`} className="block relative z-10">
          <div className="w-full min-h-[180px] bg-white border border-emerald-100 rounded-lg text-gray-800 flex flex-row p-6 overflow-hidden transition-colors duration-300 group-hover:bg-emerald-50">
            {/* Left Side - Avatar and Stats */}
            <div className="flex flex-col items-center mr-6 w-24">
              {post.avatar_url ? (
                <img
                  src={post.avatar_url}
                  alt="User avatar"
                  className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-emerald-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-tl from-emerald-400 to-emerald-600 mb-4" />
              )}
            </div>

            {/* Right Side - Content */}
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-emerald-900">
                    {post.title}
                  </h3>
                  <p className="text-sm text-emerald-700">
                    Criado por: {post.author}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex-1">
                <p className="text-gray-600 line-clamp-3">{post.content}</p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="flex justify-start items-center">
                  <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg text-emerald-600">
                    <Heart />{" "}
                    <span className="ml-2">{post.like_count ?? 0}</span>
                  </span>
                  <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg text-emerald-600">
                    <MessageCircle />{" "}
                    <span className="ml-2">{post.comment_count ?? 0}</span>
                  </span>
                </div>
                <span className="text-sm text-emerald-600">
                  Publicado em {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};
