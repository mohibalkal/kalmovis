import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/Utils/firebase";

export const addToWatchlist = async (
  userId: string,
  movieId: number,
  movieData: any,
) => {
  try {
    const watchlistRef = collection(db, "watchlist");
    const q = query(
      watchlistRef,
      where("userId", "==", userId),
      where("movieId", "==", movieId),
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      await addDoc(watchlistRef, {
        userId,
        movieId,
        movieData,
        addedAt: new Date().toISOString(),
      });
      return { success: true, message: "Added to watchlist" };
    }

    return { success: false, message: "Already in watchlist" };
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    throw error;
  }
};

export const removeFromWatchlist = async (userId: string, movieId: number) => {
  try {
    const watchlistRef = collection(db, "watchlist");
    const q = query(
      watchlistRef,
      where("userId", "==", userId),
      where("movieId", "==", movieId),
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docToDelete = querySnapshot.docs[0];
      await deleteDoc(doc(db, "watchlist", docToDelete.id));
      return { success: true, message: "Removed from watchlist" };
    }

    return { success: false, message: "Not found in watchlist" };
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    throw error;
  }
};

export const getWatchlist = async (userId: string) => {
  try {
    const watchlistRef = collection(db, "watchlist");
    const q = query(watchlistRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting watchlist:", error);
    throw error;
  }
};

export const isInWatchlist = async (userId: string, movieId: number) => {
  try {
    const watchlistRef = collection(db, "watchlist");
    const q = query(
      watchlistRef,
      where("userId", "==", userId),
      where("movieId", "==", movieId),
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking watchlist:", error);
    throw error;
  }
};
