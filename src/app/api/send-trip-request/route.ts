import { NextResponse } from "next/server";
import { isEmailConfigured, sendTripRequestEmail } from "@/lib/email";

export async function POST(request: Request) {
  if (!isEmailConfigured()) {
    return NextResponse.json(
      {
        error:
          "Server email is not configured. Add SMTP settings to .env.local (see README).",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { dateFrom, dateTo, places, message } = body as {
    dateFrom?: string;
    dateTo?: string;
    places?: string[];
    message?: string;
  };

  if (!dateFrom || !dateTo || typeof dateFrom !== "string" || typeof dateTo !== "string") {
    return NextResponse.json(
      { error: "Start and end dates are required." },
      { status: 400 },
    );
  }

  if (dateTo < dateFrom) {
    return NextResponse.json(
      { error: "End date must be after start date." },
      { status: 400 },
    );
  }

  if (!Array.isArray(places) || places.length === 0) {
    return NextResponse.json(
      { error: "At least one destination is required." },
      { status: 400 },
    );
  }

  try {
    await sendTripRequestEmail({
      dateFrom,
      dateTo,
      places: places.filter((p): p is string => typeof p === "string"),
      message: typeof message === "string" ? message : "",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to send trip request email:", err);
    return NextResponse.json(
      {
        error:
          "Could not send the email. Check your SMTP settings and try again.",
      },
      { status: 500 },
    );
  }
}
