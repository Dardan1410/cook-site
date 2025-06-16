export const config = {
  // Vercel Blob configuration
  blob: {
    token: process.env.BLOB_READ_WRITE_TOKEN,
  },

  // Image upload settings
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  },
}
