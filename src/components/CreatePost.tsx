import { ChangeEvent, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { Community, fetchCommunities } from "./CommunityList";
import { useNavigate } from "react-router";

interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
  community_id?: number | null;
  user_id: string;
  author: string;
}

const sanitizeFileName = (fileName: string) => {
  return fileName
    .normalize("NFD") // Remove acentos
    .replace(/[\u0300-\u036f]/g, "") // Remove diacríticos
    .replace(/\s+/g, "_") // Substitui espaços por "_"
    .replace(/[^a-zA-Z0-9_\-.]/g, ""); // Remove caracteres especiais exceto "-", "_" e "."
};

const createPost = async (post: PostInput, projectFile: File) => {
  // Gerar nomes únicos para os arquivos

  const sanitizedProjectName = sanitizeFileName(
    `${post.title}-${Date.now()}-${projectFile.name}`
  );

  // Fazer upload do projeto
  const { error: uploadPaperError } = await supabase.storage
    .from("projects")
    .upload(sanitizedProjectName, projectFile);

  if (uploadPaperError) throw new Error(uploadPaperError.message);

  // Obter URLs públicas

  const { data: publicProjectURLData } = supabase.storage
    .from("projects")
    .getPublicUrl(sanitizedProjectName);

  // Inserir post no banco de dados
  const { data, error } = await supabase.from("posts").insert({
    ...post,
    project_url: publicProjectURLData.publicUrl, // Corrigido aqui também
  });

  if (error) throw new Error(error.message);

  return data;
};

const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<File | null>(null);
  const [communityId, setCommunityId] = useState<number | null>(null);

  const navigate = useNavigate();

  const { user } = useAuth();

  console.log("CreatePost => ", { user });

  const { data: communities } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: PostInput; projectFile: File }) => {
      return createPost(data.post, data.projectFile);
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedProject) return;
    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url || null,
        community_id: communityId,
        user_id: user?.id || "",
        author: user?.user_metadata.full_name,
      },

      projectFile: selectedProject,
    });
  };

  const handlePaperChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedProject(e.target.files[0]);
    }
  };

  const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCommunityId(value ? Number(value) : null);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2 font-medium">
          Título
        </label>
        <input
          type="text"
          id="title"
          required
          onChange={(event) => setTitle(event.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
        />
      </div>
      <div>
        <label htmlFor="content" className="block mb-2 font-medium">
          Resumo
        </label>
        <textarea
          id="content"
          required
          rows={5}
          onChange={(event) => setContent(event.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
        />
      </div>

      <div>
        <label>Selecione o curso</label>
        <select id="community" onChange={handleCommunityChange}>
          <option value=""> -- Choose a Community --</option>
          {communities?.map((community, key) => (
            <option key={key} value={community.id}>
              {community.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="file" className="block mb-2 font-medium">
          Carregar TCC/Trabalho Científico
        </label>
        <input
          type="file"
          accept=".pdf, .doc, .docx"
          id="file"
          required
          onChange={handlePaperChange}
          className="w-fit bg-blue-700 hover:bg-blue-500 cursor-pointer py-2 px-4 rounded text-gray-200"
        />
      </div>

      <button
        type="submit"
        className="bg-purple-700 hover:bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
        disabled={isPending}
      >
        {isPending ? "Publicando..." : "Publicar"}
      </button>

      {isError && <p className="text-red-500">Error creating post.</p>}
    </form>
  );
};

export { CreatePost };
