import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";
import { Link } from "react-router";

const MyProjects = () => {
  const { user } = useAuth();

  const fetchUserProjects = async () => {
    if (!user?.id) return [];

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  };

  const {
    data: projects,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userProjects", user?.id],
    queryFn: fetchUserProjects,
    enabled: !!user?.id,
  });

  if (isLoading) return <div className="text-center py-8">Carregando...</div>;
  if (isError)
    return (
      <div className="text-center py-8 text-red-500">Erro: {error.message}</div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-green-500 to-emerald-700 bg-clip-text text-transparent">
        Meus projetos
      </h2>

      {projects?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Nenhum projeto encontrado</p>
        </div>
      ) : (
        <div className="space-y-4 lg:space-y-6">
          {" "}
          {/* Espaçamento vertical para todos os tamanhos */}
          {projects?.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-emerald-100
                        flex flex-col lg:flex-row" /* Empilha em mobile, linha em desktop */
            >
              {/* Conteúdo principal */}
              <div className="p-6 flex-1">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <h3 className="text-xl font-bold text-emerald-700 mb-2 lg:mb-0 lg:mr-4">
                    {project.title}
                  </h3>
                </div>
                <span className="text-sm text-emerald-500">
                  Publicado em{" "}
                  {new Date(project.created_at).toLocaleDateString()}
                </span>

                <p className="text-gray-600 mt-3 mb-4 line-clamp-2 lg:line-clamp-3">
                  {project.content}
                </p>

                <div className="flex justify-end">
                  <Link
                    to={`/post/${project.id}`}
                    className="text-emerald-600 hover:text-emerald-800 font-medium px-4 py-2 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition"
                  >
                    Ver detalhes →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { MyProjects };
