import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Content from "@/models/movie";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const movie = await Content.findById(id);

        if (!movie) {
            return NextResponse.json(
                { success: false, error: "Movie not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: movie });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        const movie = await Content.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!movie) {
            return NextResponse.json(
                { success: false, error: "Movie not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: movie });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const movie = await Content.findByIdAndDelete(id);

        if (!movie) {
            return NextResponse.json(
                { success: false, error: "Movie not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}
