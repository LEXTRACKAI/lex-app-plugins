import { useState } from "react";

export default function MoodForm({ onSubmit }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xl">
<textarea
  className="w-full p-4 rounded-xl border border-gray-300 shadow-inner focus:ring-2 focus:ring-purple-500 transition"
  placeholder="Describe your mood..."
  rows={4}
  value={text}
  onChange={(e) => setText(e.target.value)}
/>
<button
  type="submit"
  className="bg-purple-600 text-white px-6 py-2 rounded-xl shadow hover:bg-purple-700 transition"
>
  Get Mood Playlist
</button>

    </form>
  );
}
