import nodemailer from "nodemailer";

export type TripRequestPayload = {
  dateFrom: string;
  dateTo: string;
  places: string[];
  message: string;
};

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return { host, port, user, pass };
}

export function isEmailConfigured(): boolean {
  return (
    Boolean(getSmtpConfig()) &&
    Boolean(process.env.TRIP_REQUEST_EMAIL) &&
    Boolean(process.env.SMTP_FROM)
  );
}

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function buildTripRequestEmail(payload: TripRequestPayload) {
  const places =
    payload.places.length > 0
      ? payload.places.join(", ")
      : "(none selected)";
  const dateRange = `${formatDate(payload.dateFrom)} → ${formatDate(payload.dateTo)}`;

  const text = [
    "Marina sent a trip request!",
    "",
    `Dates: ${dateRange}`,
    `Places: ${places}`,
    "",
    payload.message.trim()
      ? `Message from Marina:\n${payload.message.trim()}`
      : "(no extra message)",
  ].join("\n");

  const html = `
    <div style="font-family: Georgia, serif; color: #5c3d4a; max-width: 480px;">
      <h2 style="color: #c77d96;">Marina sent a trip request 💕</h2>
      <p><strong>Dates:</strong> ${dateRange}</p>
      <p><strong>Places:</strong> ${places}</p>
      ${
        payload.message.trim()
          ? `<p><strong>Message:</strong></p><p style="white-space: pre-wrap;">${escapeHtml(payload.message.trim())}</p>`
          : "<p><em>(no extra message)</em></p>"
      }
    </div>
  `;

  return {
    subject: "Marina's trip request — let's go!",
    text,
    html,
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendTripRequestEmail(payload: TripRequestPayload) {
  const smtp = getSmtpConfig();
  const to = process.env.TRIP_REQUEST_EMAIL;
  const from = process.env.SMTP_FROM;

  if (!smtp || !to || !from) {
    throw new Error(
      "Email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, and TRIP_REQUEST_EMAIL in .env.local",
    );
  }

  const { subject, text, html } = buildTripRequestEmail(payload);

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  });

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
}
