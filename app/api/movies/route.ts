import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Content from "@/models/movie";

export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");
        const watchingState = searchParams.get("watchingState");
        const search = searchParams.get("search");

        const query: any = {};

        if (type) {
            query.type = type;
        }

        if (watchingState) {
            query.watchingState = watchingState;
        }

        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        const movies = await Content.find(query).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: movies });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        // Duplicate check: case-insensitive title + type match
        if (body.title && body.type) {
            const escapedTitle = body.title.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const existing = await Content.findOne({
                title: { $regex: new RegExp(`^${escapedTitle}$`, "i") },
                type: body.type,
            });

            if (existing) {
                return NextResponse.json(
                    { success: false, error: `"${body.title}" already exists in your ${body.type} watchlist` },
                    { status: 409 }
                );
            }
        }

        const movie = await Content.create(body);
        return NextResponse.json({ success: true, data: movie }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}
