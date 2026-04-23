import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.locale("pt-br");
dayjs.extend(relativeTime);

export function createIsoDate(): string {
  return new Date().toISOString();
}

export function formatRelativeDate(isoDate: string): string {
  const date = dayjs(isoDate);
  const now = dayjs();
  const diffMinutes = now.diff(date, "minute");

  if (diffMinutes < 1) return "Agora";
  if (diffMinutes < 60) return `Há ${diffMinutes} min`;

  const diffHours = now.diff(date, "hour");
  if (diffHours < 24) return `Há ${diffHours} h`;

  const diffDays = now.diff(date, "day");
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return `Há ${diffDays} dias`;

  return date.format("DD/MM/YYYY");
}

export function formatAbsoluteDate(isoDate: string): string {
  return dayjs(isoDate).format("DD/MM/YYYY HH:mm");
}
