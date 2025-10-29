// src/app/api/register/route.ts
// Registration endpoint disabled — registrations are closed.
import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  return NextResponse.json(
    { error: "Registrations are closed — please contact admin." },
    { status: 410 }
  );
}

export async function GET() {
  return NextResponse.json(
    { error: "Registrations are closed — please contact admin." },
    { status: 410 }
  );
}
