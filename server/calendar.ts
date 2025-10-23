import { Event } from "../drizzle/schema";

/**
 * Generate .ics file content for calendar events
 * Compatible with Google Calendar, Outlook, Apple Calendar, etc.
 */
export function generateICS(event: Event): string {
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const escapeText = (text: string | null) => {
    if (!text) return "";
    return text.replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  };

  const startDate = event.startDate ? formatDate(event.startDate) : "";
  const endDate = event.endDate ? formatDate(event.endDate) : "";
  const now = formatDate(new Date());

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EasyPlanningPro//Event Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}@easyplanningpro.com`,
    `DTSTAMP:${now}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    `LOCATION:${escapeText(event.location)}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return icsContent;
}

/**
 * Generate Google Calendar URL
 */
export function generateGoogleCalendarUrl(event: Event): string {
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatDate(event.startDate)}/${formatDate(event.endDate)}`,
    details: event.description || "",
    location: event.location || "",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate Outlook Calendar URL
 */
export function generateOutlookCalendarUrl(event: Event): string {
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toISOString();
  };

  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    startdt: formatDate(event.startDate),
    enddt: formatDate(event.endDate),
    body: event.description || "",
    location: event.location || "",
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Generate Apple Calendar URL (webcal protocol)
 */
export function generateAppleCalendarUrl(icsUrl: string): string {
  return icsUrl.replace(/^https?:/, "webcal:");
}

/**
 * Generate all calendar links for an event
 */
export function generateCalendarLinks(event: Event, icsDownloadUrl: string) {
  return {
    google: generateGoogleCalendarUrl(event),
    outlook: generateOutlookCalendarUrl(event),
    apple: generateAppleCalendarUrl(icsDownloadUrl),
    ics: icsDownloadUrl,
  };
}

