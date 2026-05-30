"use client";

import { useMemo, useState } from "react";
import { EvadingNoButton } from "./EvadingNoButton";
import { StepIndicator } from "./StepIndicator";
import { TRIP_OPTIONS, type TripOption } from "@/lib/trip-options";

const STEP_LABELS = ["Hello", "Dates", "Place", "Message"];
const TOTAL_STEPS = 4;

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso + "T12:00:00").toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function TripWizard() {
  const [step, setStep] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [dateError, setDateError] = useState("");

  const selectedLabels = useMemo(
    () =>
      TRIP_OPTIONS.filter((o) => selectedPlaces.includes(o.id)).map(
        (o) => o.label,
      ),
    [selectedPlaces],
  );

  const togglePlace = (id: string) => {
    setSelectedPlaces((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const validateDates = () => {
    if (!dateFrom || !dateTo) {
      setDateError("Marina, please pick both a start and end date.");
      return false;
    }
    if (dateTo < dateFrom) {
      setDateError("The end date should be after the start date.");
      return false;
    }
    setDateError("");
    return true;
  };

  const handleSend = async () => {
    setSendError("");
    setSending(true);

    try {
      const res = await fetch("/api/send-trip-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dateFrom,
          dateTo,
          places: selectedLabels,
          message,
        }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setSendError(
          data.error ??
            "Something went wrong sending your request. Please try again.",
        );
        return;
      }

      setSent(true);
    } catch {
      setSendError(
        "Could not reach the server. Check your connection and try again.",
      );
    } finally {
      setSending(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col px-5 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 text-center">
        <p className="animate-sparkle text-2xl" aria-hidden>
          ✦
        </p>
        <h1
          className="font-display text-4xl font-semibold tracking-tight text-plum sm:text-5xl"
          style={{ fontFamily: "var(--font-display), serif" }}
        >
          For Marina
        </h1>
        <p className="mt-2 text-sm text-plum/70">
          A tiny planner for our next adventure
        </p>
      </header>

      <div className="rounded-3xl bg-white/70 p-6 shadow-xl shadow-rose/10 ring-1 ring-white/80 backdrop-blur-sm sm:p-8">
        <StepIndicator
          currentStep={step}
          totalSteps={TOTAL_STEPS}
          labels={STEP_LABELS}
        />

        {step === 1 && (
          <section className="step-enter text-center">
            <p className="text-4xl animate-float" aria-hidden>
              💌
            </p>
            <h2
              className="mt-4 font-display text-3xl font-medium text-plum"
              style={{ fontFamily: "var(--font-display), serif" }}
            >
              Hey Marina,
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-plum/90">
              I&apos;ve been dreaming about getting away with you. Would you
              like to go on a trip with me?
            </p>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="mt-8 w-full rounded-full bg-rose-deep px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-rose/40 transition hover:bg-plum hover:shadow-plum/30 active:scale-[0.98]"
            >
              Yes, I&apos;d love to!
            </button>
            <EvadingNoButton />
          </section>
        )}

        {step === 2 && (
          <section className="step-enter">
            <h2
              className="font-display text-2xl font-medium text-plum"
              style={{ fontFamily: "var(--font-display), serif" }}
            >
              Marina, when works for you?
            </h2>
            <p className="mt-2 text-sm text-plum/70">
              Pick the dates you&apos;d be free to travel.
            </p>
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-plum">From</span>
                <input
                  type="date"
                  value={dateFrom}
                  min={minDate}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setDateError("");
                  }}
                  className="mt-1.5 w-full rounded-xl border border-rose/30 bg-cream px-4 py-3 text-plum outline-none transition focus:border-rose-deep focus:ring-2 focus:ring-rose/30"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-plum">To</span>
                <input
                  type="date"
                  value={dateTo}
                  min={dateFrom || minDate}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setDateError("");
                  }}
                  className="mt-1.5 w-full rounded-xl border border-rose/30 bg-cream px-4 py-3 text-plum outline-none transition focus:border-rose-deep focus:ring-2 focus:ring-rose/30"
                />
              </label>
              {dateError && (
                <p className="text-sm text-rose-deep" role="alert">
                  {dateError}
                </p>
              )}
            </div>
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-full border border-rose/40 bg-white py-3 text-sm font-medium text-plum transition hover:bg-blush"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => validateDates() && setStep(3)}
                className="flex-[2] rounded-full bg-rose-deep py-3 text-sm font-semibold text-white transition hover:bg-plum"
              >
                Continue
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="step-enter">
            <h2
              className="font-display text-2xl font-medium text-plum"
              style={{ fontFamily: "var(--font-display), serif" }}
            >
              Marina, where should we go?
            </h2>
            <p className="mt-2 text-sm text-plum/70">
              Choose one or more — or mix and match.
            </p>
            <ul className="mt-6 grid gap-3">
              {TRIP_OPTIONS.map((option) => (
                <PlaceCard
                  key={option.id}
                  option={option}
                  selected={selectedPlaces.includes(option.id)}
                  onToggle={() => togglePlace(option.id)}
                />
              ))}
            </ul>
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 rounded-full border border-rose/40 bg-white py-3 text-sm font-medium text-plum transition hover:bg-blush"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                disabled={selectedPlaces.length === 0}
                className="flex-[2] rounded-full bg-rose-deep py-3 text-sm font-semibold text-white transition hover:bg-plum disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue
              </button>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="step-enter">
            <h2
              className="font-display text-2xl font-medium text-plum"
              style={{ fontFamily: "var(--font-display), serif" }}
            >
              Anything else, Marina?
            </h2>
            <p className="mt-2 text-sm text-plum/70">
              Add a note if you like — then send your request.
            </p>

            <div className="mt-6 rounded-2xl bg-mist/80 p-4 text-sm text-plum/90 ring-1 ring-rose/15">
              <p className="font-medium text-plum">Your request summary</p>
              <ul className="mt-2 space-y-1 text-plum/80">
                <li>
                  <span className="text-plum/50">Dates: </span>
                  {formatDate(dateFrom)} — {formatDate(dateTo)}
                </li>
                <li>
                  <span className="text-plum/50">Places: </span>
                  {selectedLabels.join(" · ")}
                </li>
              </ul>
            </div>

            <label className="mt-6 block">
              <span className="text-sm font-medium text-plum">
                Message for me
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Can't wait — surprise me with the details!"
                className="mt-1.5 w-full resize-none rounded-xl border border-rose/30 bg-cream px-4 py-3 text-plum placeholder:text-plum/40 outline-none transition focus:border-rose-deep focus:ring-2 focus:ring-rose/30"
              />
            </label>

            {sendError ? (
              <p className="mt-6 rounded-xl bg-rose/20 px-4 py-3 text-center text-sm text-plum" role="alert">
                {sendError}
              </p>
            ) : null}

            {sent ? (
              <p className="mt-6 rounded-xl bg-blush/80 px-4 py-3 text-center text-sm text-plum">
                Sent! Your trip request is on its way — I&apos;ll see you soon,
                Marina. 💕
              </p>
            ) : null}

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 rounded-full border border-rose/40 bg-white py-3 text-sm font-medium text-plum transition hover:bg-blush"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={sending || sent}
                className="flex-[2] rounded-full bg-gradient-to-r from-rose-deep to-sunset py-3 text-sm font-semibold text-white shadow-lg shadow-rose/30 transition hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? "Sending…" : sent ? "Sent!" : "Send my request"}
              </button>
            </div>
          </section>
        )}
      </div>

      <footer className="mt-8 text-center text-xs text-plum/40">
      </footer>
    </main>
  );
}

function PlaceCard({
  option,
  selected,
  onToggle,
}: {
  option: TripOption;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-start gap-4 rounded-2xl border px-4 py-3.5 text-left transition ${
          selected
            ? "border-rose-deep bg-blush/60 shadow-md shadow-rose/20 ring-2 ring-rose-deep/30"
            : "border-rose/20 bg-white/80 hover:border-rose/50 hover:bg-cream"
        }`}
        aria-pressed={selected}
      >
        <span className="text-2xl" aria-hidden>
          {option.emoji}
        </span>
        <span className="flex-1">
          <span className="block font-medium text-plum">{option.label}</span>
          <span className="mt-0.5 block text-xs text-plum/60">
            {option.description}
          </span>
        </span>
        <span
          className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
            selected
              ? "border-rose-deep bg-rose-deep text-white"
              : "border-rose/40 bg-transparent"
          }`}
          aria-hidden
        >
          {selected ? "✓" : ""}
        </span>
      </button>
    </li>
  );
}
