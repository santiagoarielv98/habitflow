import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 },
      );
    }

    // Usar el método de Better Auth para cambiar la contraseña
    const result = await auth.api.changePassword({
      body: {
        currentPassword,
        newPassword,
      },
      headers: request.headers,
    });

    if (!result) {
      return NextResponse.json(
        {
          error:
            "Failed to change password. Please check your current password.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);

    // Better Auth puede lanzar errores específicos
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Failed to change password" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
