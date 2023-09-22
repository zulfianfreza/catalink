import { create, createStore } from 'zustand'

interface PreviewLoadingStore {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

export const usePreviewLoading = create<PreviewLoadingStore>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}))

export default usePreviewLoading
