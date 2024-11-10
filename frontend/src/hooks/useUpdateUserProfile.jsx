import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } =
    useMutation({
      mutationFn: async (formData) => {
        try {
          const res = await fetch(`/api/users/update`, {
            method: "PATCH", // Utilisez PATCH si c'est ce que l'API attend
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          // Si la réponse n'est pas ok, jettez une erreur
          if (!res.ok) {
            const errorText = await res.text(); // Récupère le texte de la réponse en cas d'erreur
            throw new Error(errorText || "Something went wrong");
          }

          // Vérifiez si la réponse est au format JSON
          const data = await res.json(); // Cette ligne peut lever une erreur si ce n'est pas du JSON
          return data;
        } catch (error) {
          // Afficher l'erreur dans la console ou dans un toast
          toast.error(error.message || "An error occurred");
          throw new Error(error.message);
        }
      },
      onSuccess: () => {
        toast.success("Profile updated successfully");
        Promise.all([
          queryClient.invalidateQueries({ queryKey: ["authUser"] }),
          queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
        ]);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;
