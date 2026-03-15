import { NextResponse } from "next/server";
import UserModel from "../../../../mongodbConnect";

// GET - Fetch admin settings
export async function GET() {
  try {
    const adminUser = await UserModel.findOne({ role: "admin" });

    if (!adminUser) {
      return NextResponse.json({});
    }

    return NextResponse.json({});
  } catch (error) {
    console.error("Error fetching admin settings:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST - Update admin settings
export async function POST(request) {
  try {
    await request.json(); // accept body but no fee fields to update

    return NextResponse.json({
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating admin settings:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
