export const config = {
  cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string,
  cloudinaryApiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string,
  cloudinaryApiSecret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET as string,
  cloudinaryUploadPreset: process.env
    .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string,
}
