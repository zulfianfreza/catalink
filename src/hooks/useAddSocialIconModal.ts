import { create } from 'zustand'

interface AddSocialIconModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

const useAddSocialIconModal = create<AddSocialIconModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

export default useAddSocialIconModal
