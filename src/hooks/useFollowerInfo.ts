import kyInstance from "@/lib/ky";
import { followerInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useFollowerInfo(
  userId: String,
  initialState: followerInfo,
) {
  const query = useQuery({
    queryKey: ["follower-info", userId],
    queryFn: () =>
      kyInstance.get(`/api/users/${userId}/followers`).json<followerInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });
  return query;
}
