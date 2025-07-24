export const mindfulnessChallenges = [
  { id: "breathe", text: "Take 3 deep breaths and let them go slowly." },
  { id: "gratitude", text: "Think of one thing you're grateful for today." },
  { id: "pause", text: "Sit still and relax for 20 seconds." },
  { id: "stretch", text: "Do a quick stretch, then come back." },
  { id: "smile", text: "Smile at your plants — they’ll feel it!" },
];

export function getRandomChallenge() {
  return mindfulnessChallenges[
    Math.floor(Math.random() * mindfulnessChallenges.length)
  ];
}
