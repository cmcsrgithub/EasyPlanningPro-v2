#!/bin/bash

# Template IDs from templateLayouts.ts
templates=(
  "wedding" "birthday-party" "baby-shower" "graduation" "destination-wedding" "neighborhood-bbq"
  "corporate-conference" "academic-conference" "workshop" "seminar" "training-session" "networking-mixer"
  "product-launch" "sales-kickoff" "team-building-retreat" "brand-launch-partnership"
  "sports-tournament" "championship-event" "sports-banquet" "sports-camp" "walk-run-event" "fantasy-league-draft"
  "music-festival" "art-exhibition" "film-screening" "comedy-show" "talent-show"
  "charity-gala" "auction-event" "benefit-concert" "volunteer-drive" "crowdfunding-campaign"
  "town-hall-meeting" "cultural-exchange" "club" "community"
  "family-vacation" "family-reunion" "group-trip"
  "study-group" "school"
  "adventure-tour" "content-creator-meetup" "influencer-retreat" "product-review-event" "social-media-campaign"
  "fraternity-sorority" "military" "sports-team" "milestone"
  "friends" "social" "professional"
)

# Convert kebab-case to PascalCase
to_pascal_case() {
  echo "$1" | sed -r 's/(^|-)([a-z])/\U\2/g'
}

for template_id in "${templates[@]}"; do
  # Convert to PascalCase for component name
  component_name=$(to_pascal_case "$template_id")
  file_name="${component_name}Template.tsx"
  
  # Create template file
  cat > "$file_name" << TEMPLATE
import TemplateBuilder from "@/components/TemplateBuilder";

interface ${component_name}TemplateProps {
  isPreview?: boolean;
}

export default function ${component_name}Template({ isPreview = false }: ${component_name}TemplateProps) {
  return <TemplateBuilder templateId="$template_id" isPreview={isPreview} />;
}
TEMPLATE
  
  echo "Created $file_name"
done

echo "All 53 template files generated!"
