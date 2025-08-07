import { useState } from "react";
import "./App.css";

export default function App() {
  const [mood, setMood] = useState("");
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTracks = async () => {
    if (!mood.trim()) return;
    setLoading(true);
    setTracks([]);
    try {
      const res = await fetch(`http://localhost:8000/recommend-tracks?mood=${encodeURIComponent(mood)}`);
      const data = await res.json();
      setTracks(data.tracks || []);
    } catch (error) {
      console.error("Failed to fetch tracks", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-xl max-w-lg w-full p-10 text-center">
        <h1 className="text-4xl font-extrabold mb-6">
          🎵 AI Mood Soundtrack 🎶
        </h1>

        <label htmlFor="mood" className="block mb-2 text-lg font-semibold text-white">
          How are you feeling today? <span className="text-2xl"> 😊 🤔 😢</span>
        </label>
        <input
  className="input-box"
  placeholder="Type your mood here..."
  value={mood}
  onChange={(e) => setMood(e.target.value)}
/>
<button
  className="button"
  onClick={fetchTracks}
  disabled={loading || !mood.trim()}
>
  {loading ? "Loading 🎧..." : "Find My Songs 🎵"}
</button>


        <div className="track-list">
          {tracks.length === 0 && !loading && (
            <p >No songs yet. Try another mood! ✨</p>
          )}

          {tracks.map((track) => (
            <div key={track.id} className="track-card">
              <div className="track-info">
            <a
              key={track.uri}
              href={track.url}
              target="_blank"
              rel="noopener noreferrer"
              
            >
              <div className="track-name">🎵 {track.name}</div>
              <div className="track-artist">👤 {track.artist}</div>
            </a>
            </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
