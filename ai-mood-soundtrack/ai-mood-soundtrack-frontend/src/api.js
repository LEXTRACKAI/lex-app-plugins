import axios from "axios";

const BASE_URL = "http://localhost:8000";

export async function detectMood(text) {
  const res = await axios.post(`${BASE_URL}/detect-mood`, { text });
  return res.data.mood;
}

export async function getTracksByMood(mood) {
  const res = await axios.get(`${BASE_URL}/recommend-tracks`, {
    params: { mood },
  });
  return res.data.tracks;
}
