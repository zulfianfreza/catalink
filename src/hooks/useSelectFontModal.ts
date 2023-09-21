import { create } from 'zustand'

interface SelectFontModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

const useSelectFontModal = create<SelectFontModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

export default useSelectFontModal
