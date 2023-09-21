import { SocialIcon } from '@prisma/client'
import { create } from 'zustand'

interface EditSocialIconModalStore {
  isOpen: boolean
  socialIcon: SocialIcon
  onOpen: () => void
  onClose: () => void
  setSocialIcon: (socialIcon: SocialIcon) => void
}

const useEditSocialIconModal = create<EditSocialIconModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  socialIcon: Object.create({}),
  setSocialIcon: (socialIcon: SocialIcon) => set({ socialIcon }),
}))

export default useEditSocialIconModal
