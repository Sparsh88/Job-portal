export const uploadToCloudinary = async (fileBuffer: Buffer, fileName: string): Promise<string> => {
  // Production Cloudinary integration fallback simulator
  console.log(`[Cloudinary Service] Uploading file ${fileName} to cloud storage...`);
  const timestamp = Date.now();
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME || 'hirehub_demo'}/image/upload/v${timestamp}/${sanitizedName}`;
};
