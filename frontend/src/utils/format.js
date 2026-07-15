export const formatDate = (value) => {
  if (!value) return "Not available";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatTime = (value) => {
  if (!value) return "";

  return new Date(value).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
};

export const formatDateTime = (value) => {
  if (!value) return "Not available";

  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
};

export const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export const formatRelative = (value) => {
  if (!value) return "";

  const date = new Date(value);
  const diff = Math.round((date - new Date()) / 60000);

  if (diff === 0) return "Just now";
  if (diff < 0) return `${Math.abs(diff)}m ago`;
  if (diff < 60) return `in ${diff}m`;
  if (diff < 1440) return `in ${Math.floor(diff / 60)}h`;

  return formatDate(value);
};
