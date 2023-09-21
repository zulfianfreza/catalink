import { Link } from '@prisma/client'
import { create } from 'zustand'

interface AddThumbnailIconModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  link: Link
  setLink: (link: Link) => void
}

const useAddThumbnailIconModal = create<AddThumbnailIconModalStore>((set) => ({
  isOpen: false,
  link: Object.create({}),
  setLink: (link) => set({ link }),
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

export default useAddThumbnailIconModal
