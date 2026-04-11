"use client";

import { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DailyEditor } from "@/components/editor/daily-editor";
import { Toaster } from "sonner";

function formatDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export default function NotesPage() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const dateKey = formatDateKey(currentDate);
  const isToday = formatDateKey(new Date()) === dateKey;

  return (
    <div className="bg-background min-h-screen w-full">
      {/* Date header */}
      <div className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <button
            onClick={() => setCurrentDate((d) => subDays(d, 1))}
            className="rounded-md p-1.5 hover:bg-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">
              {format(currentDate, "EEEE, MMMM d, yyyy")}
            </h1>
            {!isToday && (
              <button
                onClick={() => setCurrentDate(new Date())}
                className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/20"
              >
                Today
              </button>
            )}
          </div>

          <button
            onClick={() => setCurrentDate((d) => addDays(d, 1))}
            className="rounded-md p-1.5 hover:bg-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="mx-auto max-w-3xl px-4 py-6">
        <DailyEditor key={dateKey} date={dateKey} />
      </div>

      <Toaster />
    </div>
  );
}
