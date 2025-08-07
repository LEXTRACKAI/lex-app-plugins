import { useState } from "react";
import { subscribeUser } from "../services/api";


const interestsList = [
  "Music", "Art", "Tech", "Food", "Community", "Fitness", "Education"
];

export default function EventSearchPage() {
  const [location, setLocation] = useState("");
  const [interests, setInterests] = useState([]);
  const [email, setEmail] = useState("");

  const handleInterestToggle = (interest) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    const data = { location, interests, email };
  
    try {
      const response = await subscribeUser(data);
      console.log("Backend response:", response);
      alert("🎉 Subscribed successfully!");
    } catch (err) {
      alert("❌ Subscription failed. Check the console.");
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-100 via-white to-pink-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-10 animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">
          🎉 Find Free Local Events
        </h1>

        <div className="mb-5">
          <label className="block text-gray-600 font-semibold mb-2">
            📍 City or ZIP Code
          </label>
          <input
            type="text"
            placeholder="e.g. New York or 10001"
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label className="block text-gray-600 font-semibold mb-2">
            💡 Interests
          </label>
          <div className="flex flex-wrap gap-3">
            {interestsList.map((interest) => (
              <button
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                className={`px-4 py-2 rounded-full border transition duration-150 text-sm font-medium ${
                  interests.includes(interest)
                    ? "bg-purple-600 text-white border-purple-600 shadow-md"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-purple-100"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 font-semibold mb-2">
            📧 Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold text-lg transition-all duration-200 shadow-md"
        >
          🔔 Subscribe & Find Events
        </button>
      </div>
    </div>
  );
}
