// Color schemes for different template categories and specific templates

export const categoryColors = {
  Social: {
    primary: "rose",
    secondary: "pink",
    accent: "purple",
    gradient: "from-rose-500 to-pink-500",
  },
  Professional: {
    primary: "blue",
    secondary: "cyan",
    accent: "indigo",
    gradient: "from-blue-500 to-cyan-500",
  },
  Sports: {
    primary: "orange",
    secondary: "amber",
    accent: "red",
    gradient: "from-orange-500 to-amber-500",
  },
  Entertainment: {
    primary: "purple",
    secondary: "fuchsia",
    accent: "pink",
    gradient: "from-purple-500 to-fuchsia-500",
  },
  Charity: {
    primary: "emerald",
    secondary: "teal",
    accent: "green",
    gradient: "from-emerald-500 to-teal-500",
  },
  Community: {
    primary: "amber",
    secondary: "yellow",
    accent: "orange",
    gradient: "from-amber-500 to-yellow-500",
  },
  Family: {
    primary: "sky",
    secondary: "blue",
    accent: "cyan",
    gradient: "from-sky-500 to-blue-500",
  },
  Educational: {
    primary: "indigo",
    secondary: "violet",
    accent: "purple",
    gradient: "from-indigo-500 to-violet-500",
  },
  "Special Interest": {
    primary: "cyan",
    secondary: "teal",
    accent: "blue",
    gradient: "from-cyan-500 to-teal-500",
  },
  Organization: {
    primary: "slate",
    secondary: "gray",
    accent: "zinc",
    gradient: "from-slate-500 to-gray-500",
  },
};

// Specific template color overrides
export const templateColors: Record<string, {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
}> = {
  "wedding": {
    primary: "rose",
    secondary: "pink",
    accent: "red",
    gradient: "from-rose-400 to-pink-400",
  },
  "birthday-party": {
    primary: "yellow",
    secondary: "orange",
    accent: "amber",
    gradient: "from-yellow-400 to-orange-400",
  },
  "baby-shower": {
    primary: "sky",
    secondary: "blue",
    accent: "cyan",
    gradient: "from-sky-300 to-blue-300",
  },
  "graduation": {
    primary: "indigo",
    secondary: "blue",
    accent: "purple",
    gradient: "from-indigo-500 to-blue-500",
  },
  "destination-wedding": {
    primary: "teal",
    secondary: "cyan",
    accent: "sky",
    gradient: "from-teal-400 to-cyan-400",
  },
  "neighborhood-bbq": {
    primary: "red",
    secondary: "orange",
    accent: "amber",
    gradient: "from-red-500 to-orange-500",
  },
  "corporate-conference": {
    primary: "blue",
    secondary: "indigo",
    accent: "cyan",
    gradient: "from-blue-600 to-indigo-600",
  },
  "academic-conference": {
    primary: "violet",
    secondary: "purple",
    accent: "indigo",
    gradient: "from-violet-500 to-purple-500",
  },
  "workshop": {
    primary: "cyan",
    secondary: "blue",
    accent: "sky",
    gradient: "from-cyan-500 to-blue-500",
  },
  "seminar": {
    primary: "indigo",
    secondary: "blue",
    accent: "cyan",
    gradient: "from-indigo-500 to-blue-500",
  },
  "training-session": {
    primary: "teal",
    secondary: "cyan",
    accent: "blue",
    gradient: "from-teal-500 to-cyan-500",
  },
  "networking-mixer": {
    primary: "purple",
    secondary: "fuchsia",
    accent: "pink",
    gradient: "from-purple-500 to-fuchsia-500",
  },
  "product-launch": {
    primary: "orange",
    secondary: "amber",
    accent: "yellow",
    gradient: "from-orange-500 to-amber-500",
  },
  "sales-kickoff": {
    primary: "green",
    secondary: "emerald",
    accent: "teal",
    gradient: "from-green-500 to-emerald-500",
  },
  "team-building-retreat": {
    primary: "lime",
    secondary: "green",
    accent: "emerald",
    gradient: "from-lime-500 to-green-500",
  },
  "brand-launch-partnership": {
    primary: "fuchsia",
    secondary: "pink",
    accent: "rose",
    gradient: "from-fuchsia-500 to-pink-500",
  },
  "sports-tournament": {
    primary: "orange",
    secondary: "red",
    accent: "amber",
    gradient: "from-orange-600 to-red-600",
  },
  "championship-event": {
    primary: "yellow",
    secondary: "amber",
    accent: "orange",
    gradient: "from-yellow-500 to-amber-500",
  },
  "sports-banquet": {
    primary: "amber",
    secondary: "orange",
    accent: "yellow",
    gradient: "from-amber-600 to-orange-600",
  },
  "sports-camp": {
    primary: "green",
    secondary: "lime",
    accent: "emerald",
    gradient: "from-green-500 to-lime-500",
  },
  "walk-run-event": {
    primary: "blue",
    secondary: "sky",
    accent: "cyan",
    gradient: "from-blue-500 to-sky-500",
  },
  "fantasy-league-draft": {
    primary: "purple",
    secondary: "violet",
    accent: "indigo",
    gradient: "from-purple-500 to-violet-500",
  },
  "music-festival": {
    primary: "fuchsia",
    secondary: "purple",
    accent: "pink",
    gradient: "from-fuchsia-500 to-purple-500",
  },
  "art-exhibition": {
    primary: "violet",
    secondary: "purple",
    accent: "fuchsia",
    gradient: "from-violet-500 to-purple-500",
  },
  "film-screening": {
    primary: "slate",
    secondary: "gray",
    accent: "zinc",
    gradient: "from-slate-600 to-gray-600",
  },
  "comedy-show": {
    primary: "yellow",
    secondary: "amber",
    accent: "orange",
    gradient: "from-yellow-400 to-amber-400",
  },
  "talent-show": {
    primary: "pink",
    secondary: "rose",
    accent: "red",
    gradient: "from-pink-500 to-rose-500",
  },
  "charity-gala": {
    primary: "emerald",
    secondary: "teal",
    accent: "green",
    gradient: "from-emerald-600 to-teal-600",
  },
  "auction-event": {
    primary: "amber",
    secondary: "yellow",
    accent: "orange",
    gradient: "from-amber-600 to-yellow-600",
  },
  "benefit-concert": {
    primary: "purple",
    secondary: "violet",
    accent: "fuchsia",
    gradient: "from-purple-500 to-violet-500",
  },
  "volunteer-drive": {
    primary: "green",
    secondary: "emerald",
    accent: "teal",
    gradient: "from-green-500 to-emerald-500",
  },
  "crowdfunding-campaign": {
    primary: "cyan",
    secondary: "blue",
    accent: "sky",
    gradient: "from-cyan-500 to-blue-500",
  },
  "town-hall-meeting": {
    primary: "blue",
    secondary: "indigo",
    accent: "violet",
    gradient: "from-blue-600 to-indigo-600",
  },
  "cultural-exchange": {
    primary: "orange",
    secondary: "amber",
    accent: "yellow",
    gradient: "from-orange-500 to-amber-500",
  },
  "club": {
    primary: "purple",
    secondary: "violet",
    accent: "fuchsia",
    gradient: "from-purple-500 to-violet-500",
  },
  "community": {
    primary: "amber",
    secondary: "orange",
    accent: "yellow",
    gradient: "from-amber-500 to-orange-500",
  },
  "family-vacation": {
    primary: "sky",
    secondary: "cyan",
    accent: "blue",
    gradient: "from-sky-400 to-cyan-400",
  },
  "family-reunion": {
    primary: "rose",
    secondary: "pink",
    accent: "red",
    gradient: "from-rose-400 to-pink-400",
  },
  "group-trip": {
    primary: "teal",
    secondary: "cyan",
    accent: "sky",
    gradient: "from-teal-500 to-cyan-500",
  },
  "study-group": {
    primary: "indigo",
    secondary: "blue",
    accent: "violet",
    gradient: "from-indigo-500 to-blue-500",
  },
  "school": {
    primary: "blue",
    secondary: "cyan",
    accent: "sky",
    gradient: "from-blue-500 to-cyan-500",
  },
  "adventure-tour": {
    primary: "green",
    secondary: "emerald",
    accent: "teal",
    gradient: "from-green-600 to-emerald-600",
  },
  "content-creator-meetup": {
    primary: "pink",
    secondary: "fuchsia",
    accent: "purple",
    gradient: "from-pink-500 to-fuchsia-500",
  },
  "influencer-retreat": {
    primary: "purple",
    secondary: "fuchsia",
    accent: "pink",
    gradient: "from-purple-500 to-fuchsia-500",
  },
  "product-review-event": {
    primary: "orange",
    secondary: "amber",
    accent: "yellow",
    gradient: "from-orange-500 to-amber-500",
  },
  "social-media-campaign": {
    primary: "cyan",
    secondary: "blue",
    accent: "sky",
    gradient: "from-cyan-500 to-blue-500",
  },
  "fraternity-sorority": {
    primary: "purple",
    secondary: "violet",
    accent: "indigo",
    gradient: "from-purple-600 to-violet-600",
  },
  "military": {
    primary: "slate",
    secondary: "gray",
    accent: "zinc",
    gradient: "from-slate-700 to-gray-700",
  },
  "sports-team": {
    primary: "red",
    secondary: "orange",
    accent: "amber",
    gradient: "from-red-600 to-orange-600",
  },
  "milestone": {
    primary: "amber",
    secondary: "yellow",
    accent: "orange",
    gradient: "from-amber-500 to-yellow-500",
  },
  "friends": {
    primary: "pink",
    secondary: "rose",
    accent: "red",
    gradient: "from-pink-400 to-rose-400",
  },
  "social": {
    primary: "purple",
    secondary: "fuchsia",
    accent: "pink",
    gradient: "from-purple-500 to-fuchsia-500",
  },
  "professional": {
    primary: "blue",
    secondary: "indigo",
    accent: "cyan",
    gradient: "from-blue-600 to-indigo-600",
  },
};

export function getTemplateColors(templateId: string, category?: string) {
  // Return specific template colors if available
  if (templateColors[templateId]) {
    return templateColors[templateId];
  }
  
  // Fall back to category colors
  if (category && categoryColors[category as keyof typeof categoryColors]) {
    return categoryColors[category as keyof typeof categoryColors];
  }
  
  // Default colors
  return {
    primary: "blue",
    secondary: "cyan",
    accent: "indigo",
    gradient: "from-blue-500 to-cyan-500",
  };
}

