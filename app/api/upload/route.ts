import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const url = formData.get("url") as string | null;

        let uploadSource: string;

        if (file) {
            // Convert file to base64 data URI for Cloudinary upload
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const base64 = buffer.toString("base64");
            uploadSource = `data:${file.type};base64,${base64}`;
        } else if (url) {
            uploadSource = url;
        } else {
            return NextResponse.json(
                { success: false, error: "No file or URL provided" },
                { status: 400 }
            );
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(uploadSource, {
            folder: "movie_filter/posters",
            transformation: [
                { width: 500, crop: "limit" },
                { quality: "auto" },
                { fetch_format: "auto" },
            ],
        });

        return NextResponse.json({
            success: true,
            url: result.secure_url,
        });
    } catch (error: unknown) {
        console.error("Upload error:", error);
        const message = error instanceof Error ? error.message : "Upload failed";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
