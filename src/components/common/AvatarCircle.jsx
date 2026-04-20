import React from 'react';

const AVATAR_BG = [
  "bg-blue-100 text-blue-700", "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700", "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700", "bg-teal-100 text-teal-700",
  "bg-orange-100 text-orange-700", "bg-indigo-100 text-indigo-700",
];

export const AvatarCircle = ({ name, idx, size = "w-9 h-9", text = "text-sm" }) => {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const bgClass = AVATAR_BG[idx % AVATAR_BG.length];
  return (
    <div className={`${size} ${bgClass} rounded-xl flex items-center justify-center font-bold ${text} shrink-0`}>
      {initials}
    </div>
  );
};