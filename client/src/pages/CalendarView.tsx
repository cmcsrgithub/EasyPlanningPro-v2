import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Link } from "wouter";

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data: events } = trpc.events.list.useQuery();
  const { data: activities } = trpc.activities.list.useQuery();

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getEventsForDate = (day: number) => {
    const date = new Date(year, month, day);
    const dateStr = date.toDateString();

    const dayEvents = events?.filter((event) => {
      if (!event.startDate) return false;
      return new Date(event.startDate).toDateString() === dateStr;
    }) || [];

    const dayActivities = activities?.filter((activity) => {
      if (!activity.startTime) return false;
      return new Date(activity.startTime).toDateString() === dateStr;
    }) || [];

    return [...dayEvents, ...dayActivities];
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Calendar</h1>
            <p className="text-muted-foreground mt-2">
              View all your events and activities in one place
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentDate(new Date())}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {monthNames[month]} {year}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const dayItems = getEventsForDate(day);
                const today = isToday(day);

                return (
                  <div
                    key={day}
                    className={`
                      aspect-square border rounded-lg p-2 hover:bg-muted/50 transition-colors
                      ${today ? "border-primary bg-primary/5" : "border-border"}
                    `}
                  >
                    <div className="flex flex-col h-full">
                      <div
                        className={`
                          text-sm font-semibold mb-1
                          ${today ? "text-primary" : "text-foreground"}
                        `}
                      >
                        {day}
                      </div>
                      <div className="flex-1 overflow-y-auto space-y-1">
                        {dayItems.slice(0, 3).map((item: any) => (
                          <Link
                            key={item.id}
                            href={
                              "eventType" in item
                                ? `/events/${item.id}`
                                : `/activities/${item.id}`
                            }
                          >
                            <div className="text-xs p-1 rounded bg-primary/10 hover:bg-primary/20 cursor-pointer truncate">
                              {item.title}
                            </div>
                          </Link>
                        ))}
                        {dayItems.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayItems.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events
                ?.filter((event) => {
                  if (!event.startDate) return false;
                  const eventDate = new Date(event.startDate);
                  return (
                    eventDate.getMonth() === month &&
                    eventDate.getFullYear() === year
                  );
                })
                .slice(0, 5)
                .map((event) => (
                  <Link key={event.id} href={`/events/${event.id}`}>
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.startDate &&
                            new Date(event.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      {event.eventType && (
                        <Badge variant="secondary">{event.eventType}</Badge>
                      )}
                    </div>
                  </Link>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

