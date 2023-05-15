import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import useLoginModal from "./useLoginModal";
import { SafeUser } from "../types";

interface IUseFavorite {
  listingIdString: string;
  currentUser?: SafeUser | null;
}

const useFavorite = ({
  listingIdString,
  currentUser
}: IUseFavorite) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];
    return list.includes(listingIdString)
  }, [currentUser, listingIdString])

  const toggleFavorite = useCallback(async (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.stopPropagation;

    if (!currentUser) {
      return loginModal.onOpen();
    }

    try {
      let request;

      if (hasFavorited) {
        request = () => axios.delete(`/api/favorites/${listingIdString}`);
      } else {
        request = () => axios.post(`/api/favorites/${listingIdString}`);
      }

      await request();
      router.refresh();
      toast.success('Success');
    } catch (error) {
      toast.error('Somethin went wrong with you');      
    }
  },[currentUser, hasFavorited, listingIdString, loginModal, router]);

  return {
    hasFavorited, toggleFavorite
  }
}

export default useFavorite;