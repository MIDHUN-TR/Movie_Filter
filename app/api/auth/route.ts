import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/user";

export async function POST(request: Request) {
    try {
        await connectDB();
        const { email, password } = await request.json();

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json(
                { success: false, error: "User already exists" },
                { status: 400 }
            );
        }

        // TODO: Hash password before saving in a real application
        const user = await User.create({ email, password });

        return NextResponse.json({ success: true, data: user }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}
