import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteCloudinaryImage(url: string) {
    if (!url || !url.includes("res.cloudinary.com")) return;

    try {
        const regex = /\/upload\/(?:v\d+\/)?([^\.]+)/;
        const match = url.match(regex);
        if (match && match.length >= 2) {
            const public_id = match[1];
            await cloudinary.uploader.destroy(public_id);
        }
    } catch (error) {
        console.error("Failed to delete Cloudinary image:", error);
    }
}

export default cloudinary;
