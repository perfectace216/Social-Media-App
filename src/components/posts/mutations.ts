import {
  InfiniteData,
  QueryClient,
  QueryFilters,
  useMutation,
  useQueries,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { deletePost } from "./actions";
import { PostsPage } from "@/lib/types";

export function useDeletePostMutation() {
  const { toast } = useToast();

  const QueryClient = useQueryClient();

  const router = useRouter();

  const pathname = usePathname();

  const mutation = useMutation({
    mutationFn: deletePost,

    onSuccess: async (deletedPost) => {
      const queryFilter: QueryFilters = { queryKey: ["post-feed"] };

      await QueryClient.cancelQueries(queryFilter);

      QueryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((post) => post.id !== deletedPost.id),
            })),
          };
        },
      );

      toast({
        description: "Post deleted ",
      });

      if (pathname === `/posts/${deletedPost.id}`) {
        router.push(`/users/${deletedPost.user.username}`);
      }
    },
    onError(error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Failed to delete post. Please try again",
      });
    },
  });

  return mutation;
}
