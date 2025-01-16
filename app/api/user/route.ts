import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { UserServiceProxy } from "@/lib/UserServiceProxy";

export async function GET(req: NextRequest) {
  try {
    // Get the token from Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization token is missing." },
        { status: 401 }
      );
    }

    // Extract the token from the header
    const token = authHeader.replace("Bearer ", "");

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!decoded || typeof decoded === "string") {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    const userServiceProxy = new UserServiceProxy();

    const user = await userServiceProxy.getUserByEmail(decoded.email);


    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Return user data
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
