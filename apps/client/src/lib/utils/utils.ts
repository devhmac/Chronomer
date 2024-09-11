import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const derivePercentComplete = (
  timeSpent: number,
  timeTarget: number,
) => {
  if (timeSpent === 0 || timeTarget === 0) return 0;
  const decimalPercent = Number((timeSpent / timeTarget).toFixed(1));
  return decimalPercent * 100;
};

export const minutesToTime = (time: number) => {
  const hours = Math.floor(time / 60);
  const min = time % 60;
  if (hours === 0) return `${min}m`;
  if (min === 0) return `${hours}h`;
  return `${hours}h ${min}m`;
};
