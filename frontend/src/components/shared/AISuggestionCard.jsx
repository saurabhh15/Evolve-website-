// frontend/src/components/shared/AISuggestionCard.jsx
import { Star, MapPin, Briefcase, Zap } from "lucide-react";

export default function AISuggestionCard({ suggestion, type }) {
  const { user, matchScore, reason } = suggestion;
  if (!user) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 
                    hover:shadow-lg transition-all duration-300 
                    hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-purple-100"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.college || user.company}</p>
          </div>
        </div>

        {/* Match Score Badge */}
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold
          ${matchScore >= 80 ? "bg-green-100 text-green-700"
          : matchScore >= 60 ? "bg-yellow-100 text-yellow-700"
          : "bg-gray-100 text-gray-600"}`}>
          <Zap size={13} />
          {matchScore}%
        </div>
      </div>

      {/* AI Reason */}
      <div className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-2 mb-3">
        <p className="text-xs text-purple-700 font-medium">✨ AI Match Reason</p>
        <p className="text-sm text-purple-900 mt-0.5">{reason}</p>
      </div>

      {/* Skills / Expertise */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {(type === "mentor" ? user.expertise : user.skills)
          ?.slice(0, 4)
          .map((s) => (
            <span key={s}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
              {s}
            </span>
          ))}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
        {user.location && (
          <span className="flex items-center gap-1">
            <MapPin size={11} /> {user.location}
          </span>
        )}
        {type === "mentor" && user.rating > 0 && (
          <span className="flex items-center gap-1">
            <Star size={11} className="text-yellow-400" />
            {user.rating} · {user.sessionsHeld} sessions
          </span>
        )}
        {type === "mentor" && (
          <span className="flex items-center gap-1">
            <Briefcase size={11} /> {user.company}
          </span>
        )}
      </div>

      {/* Action Button */}
      <button className="w-full py-2 rounded-xl text-sm font-semibold
        bg-gradient-to-r from-purple-600 to-indigo-600 text-white
        hover:opacity-90 transition">
        {type === "mentor" ? "Request Mentorship" : "Invite to Team"}
      </button>
    </div>
  );
}