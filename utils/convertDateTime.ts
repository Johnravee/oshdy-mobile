/**
 * Converts user-friendly date and time strings into ISO formats for Supabase.
 * Supports both 12-hour (e.g. "4:20 AM") and 24-hour (e.g. "16:20") times.
 */
export default function convertDateTime(dateStr: string, timeStr: string) {
  try {
    // Parse date from "MM/DD/YYYY"
    const [month, day, year] = dateStr.split('/').map(Number);

    if (!month || !day || !year) throw new Error('Invalid date format');

    let hours = 0, minutes = 0;

    // Handle "4:20 AM" or "16:20"
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
      const [timePart, modifier] = timeStr.trim().split(' ');
      [hours, minutes] = timePart.split(':').map(Number);
      if (modifier.toLowerCase() === 'pm' && hours < 12) hours += 12;
      if (modifier.toLowerCase() === 'am' && hours === 12) hours = 0;
    } else {
      [hours, minutes] = timeStr.split(':').map(Number);
    }

    const date = new Date(year, month - 1, day, hours, minutes);

    const event_date = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const event_time = date.toTimeString().split(' ')[0]; // "HH:MM:SS"

    return { event_date, event_time };
  } catch (err) {
    throw new Error('Invalid date or time format');
  }
}
