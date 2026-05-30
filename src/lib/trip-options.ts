export type TripOption = {
  id: string;
  label: string;
  emoji: string;
  description: string;
};

export const TRIP_OPTIONS: TripOption[] = [
  {
    id: "beach",
    label: "Sunny beach escape",
    emoji: "🏖️",
    description: "Sand, sea, and slow mornings",
  },
  {
    id: "mountains",
    label: "Mountain retreat",
    emoji: "⛰️",
    description: "Fresh air, trails, and cozy evenings",
  },
  {
    id: "city",
    label: "City adventure",
    emoji: "🌆",
    description: "Cafés, museums, and wandering streets",
  },
  {
    id: "countryside",
    label: "Countryside hideaway",
    emoji: "🌿",
    description: "Quiet lanes, nature, and stargazing",
  },
  {
    id: "lake",
    label: "Lakeside calm",
    emoji: "🛶",
    description: "Water, picnics, and peaceful sunsets",
  },
  {
    id: "surprise",
    label: "Surprise me!",
    emoji: "✨",
    description: "You pick — I trust your taste",
  },
];
