import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfileSummary } from "@/types";

interface ListState {
  selectedProfiles: UserProfileSummary[];
  addProfile: (profile: UserProfileSummary) => void;
  removeProfile: (userId: string) => void;
  isProfileSelected: (userId: string) => boolean;
}

export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      selectedProfiles: [],

      addProfile: (profile) => {
        const alreadyExists = get().selectedProfiles.some(
          (p) => p.user_id === profile.user_id
        );
        if (alreadyExists) return;

        set((state) => ({
          selectedProfiles: [...state.selectedProfiles, profile],
        }));
      },

      removeProfile: (userId) => {
        set((state) => ({
          selectedProfiles: state.selectedProfiles.filter(
            (p) => p.user_id !== userId
          ),
        }));
      },

      isProfileSelected: (userId) => {
        return get().selectedProfiles.some((p) => p.user_id === userId);
      },
    }),
    {
      name: "wobb-selected-profiles",
      partialize: (state) => ({ selectedProfiles: state.selectedProfiles }),
    }
  )
);