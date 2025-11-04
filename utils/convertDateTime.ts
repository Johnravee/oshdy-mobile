/**
 * Converts user-friendly date and time strings into ISO formats for Supabase.
 * Supports both 12-hour (e.g. "4:20 AM") and 24-hour (e.g. "16:20") times.
 */
export default function convertDateTime(dateStr: string, timeStr: string) {
  // Normalize inputs
  const d = (dateStr || '').trim();
  const t = (timeStr || '').trim();

  const invalid = () => {
    throw new Error('Invalid date or time format');
  };

  if (!d) invalid();

  // Helper to check valid Date
  const isValidDate = (dt: Date) => dt instanceof Date && !isNaN(dt.getTime());

  // Parse time string into hours/minutes
  const parseTime = (time: string) => {
    if (!time) return { hours: 0, minutes: 0 };
    const low = time.toLowerCase();

    // Match 12-hour like "4:20 am", "04:20pm"
    const m12 = low.match(/^(\d{1,2}):?(\d{2})?\s*(am|pm)$/i);
    if (m12) {
      let hh = parseInt(m12[1], 10);
      const mm = m12[2] ? parseInt(m12[2], 10) : 0;
      const mod = m12[3].toLowerCase();
      if (mod === 'pm' && hh < 12) hh += 12;
      if (mod === 'am' && hh === 12) hh = 0;
      return { hours: hh, minutes: mm };
    }

    // Match 24-hour like "16:20" or "1620"
    const m24 = time.match(/^(\d{1,2}):(\d{2})$/);
    if (m24) {
      return { hours: parseInt(m24[1], 10), minutes: parseInt(m24[2], 10) };
    }

    // Fallback: try numeric like "1600"
    const mn = time.match(/^(\d{1,4})$/);
    if (mn) {
      const v = mn[1];
      if (v.length <= 2) return { hours: parseInt(v, 10), minutes: 0 };
      if (v.length === 3) return { hours: parseInt(v.slice(0, 1), 10), minutes: parseInt(v.slice(1), 10) };
      return { hours: parseInt(v.slice(0, 2), 10), minutes: parseInt(v.slice(2), 10) };
    }

    return { hours: 0, minutes: 0 };
  };

  // Parse date string with multiple possible separators/formats
  const parseDate = (date: string) => {
    // If the string has no digits at all, it's definitely invalid
    if (!/[0-9]/.test(date)) return null;
    // If ISO-like (YYYY-MM-DD or YYYY/MM/DD)
    if (/^\d{4}[-\/]/.test(date)) {
      const parts = date.split(/[-\/]/).map(Number);
      const [year, month, day] = parts;
      const dt = new Date(year, (month || 1) - 1, day || 1);
      if (isValidDate(dt)) return { year, month, day };
    }

    // Split by common separators
    const parts = date.split(/[\/\-.\s,]+/).filter(Boolean);
    if (parts.length >= 3) {
      const nums = parts.map((p) => Number(p.replace(/[^0-9]/g, '')));
      // Find which part looks like a year (4 digits)
      const yIndex = parts.findIndex((p) => /^(\d{4})$/.test(p));
      if (yIndex !== -1) {
        const year = Number(parts[yIndex]);
        let day: number, month: number;
        if (yIndex === 0) {
          // year-first: YYYY MM DD
          month = Number(parts[1]);
          day = Number(parts[2]);
        } else {
          // assume day/month/year or month/day/year depending on first value
          const a = Number(parts[0]);
          const b = Number(parts[1]);
          // if first part > 12, it's day-first
          if (a > 12) {
            day = a;
            month = b;
          } else {
            month = a;
            day = b;
          }
        }
        const dt = new Date(year, (month || 1) - 1, day || 1);
        if (isValidDate(dt)) return { year, month, day };
      }

      // No explicit 4-digit year: disambiguate by value
      const a = nums[0], b = nums[1], c = nums[2];
      // If first > 31 -> probably year-first
      if (a > 31) {
        const year = a;
        const month = b;
        const day = c;
        const dt = new Date(year, (month || 1) - 1, day || 1);
        if (isValidDate(dt)) return { year, month, day };
      }

      // If first <=12 and second > 12 -> month/day/year (US)
      if (b > 12) {
        const month = a;
        const day = b;
        const year = c;
        const dt = new Date(year, (month || 1) - 1, day || 1);
        if (isValidDate(dt)) return { year, month, day };
      }

      // If first >12 -> day/month/year (non-US)
      if (a > 12) {
        const day = a;
        const month = b;
        const year = c;
        const dt = new Date(year, (month || 1) - 1, day || 1);
        if (isValidDate(dt)) return { year, month, day };
      }

      // Default: month/day/year
      const month = a;
      const day = b;
      const year = c;
      const dt = new Date(year, (month || 1) - 1, day || 1);
      if (isValidDate(dt)) return { year, month, day };
    }

    // Last resort: let JS parse the string
    const parsed = new Date(date);
    if (isValidDate(parsed)) {
      return { year: parsed.getFullYear(), month: parsed.getMonth() + 1, day: parsed.getDate() };
    }

    return null;
  };

  const parsedDate = parseDate(d);
  if (!parsedDate) invalid();

  const pd = parsedDate as { year: number; month: number; day: number };
  const { hours, minutes } = parseTime(t || '');

  const dateObj = new Date(pd.year, pd.month - 1, pd.day, hours, minutes);
  if (!isValidDate(dateObj)) invalid();

  // Build date string using provided local components to avoid timezone shifts
  const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));
  const event_date = `${pd.year}-${pad2(pd.month)}-${pad2(pd.day)}`; // YYYY-MM-DD
  const event_time = `${pad2(hours)}:${pad2(minutes)}:00`; // HH:MM:SS

  return { event_date, event_time };
}
