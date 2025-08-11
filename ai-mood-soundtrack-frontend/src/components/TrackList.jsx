export default function TrackList({ tracks }) {
    if (!tracks.length) return null;
  
    return (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full max-w-5xl">
  {tracks.map((track) => (
    <div
      key={track.id}
      className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-5 hover:scale-105 transition-transform duration-300 flex items-center space-x-4"
    >
      <img
        src={track.albumImageUrl}
        alt={track.name}
        className="w-20 h-20 rounded-xl shadow-md"
      />
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          🎵 {track.name}
        </h2>
        <p className="text-sm text-gray-600">👤 {track.artist}</p>
        <a
          href={track.previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 mt-2 inline-block hover:underline"
        >
          ▶️ Preview
        </a>
      </div>
    </div>
  ))}
</div>

    );
  }
  