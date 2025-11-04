import convertDateTime from '../utils/convertDateTime';

describe('convertDateTime', () => {
  test('parses US format MM/DD/YYYY with 12-hour time', () => {
    const { event_date, event_time } = convertDateTime('10/04/2025', '4:20 PM');
    expect(event_date).toBe('2025-10-04');
    expect(event_time).toBe('16:20:00');
  });

  test('parses US format MM/DD/YYYY with 24-hour time', () => {
    const { event_date, event_time } = convertDateTime('04/10/2025', '16:20');
    expect(event_date).toBe('2025-04-10');
    expect(event_time).toBe('16:20:00');
  });

  test('parses ISO date YYYY-MM-DD', () => {
    const { event_date, event_time } = convertDateTime('2025-11-04', '09:05');
    expect(event_date).toBe('2025-11-04');
    expect(event_time).toBe('09:05:00');
  });

  test('parses EU format DD/MM/YYYY', () => {
    const { event_date, event_time } = convertDateTime('31/12/2025', '23:59');
    expect(event_date).toBe('2025-12-31');
    expect(event_time).toBe('23:59:00');
  });

  test('parses compact numeric time like 730 as 07:30', () => {
    const { event_date, event_time } = convertDateTime('2025-01-02', '730');
    expect(event_date).toBe('2025-01-02');
    expect(event_time).toBe('07:30:00');
  });

  test('defaults to midnight when time is empty', () => {
    const { event_date, event_time } = convertDateTime('2025-08-15', '');
    expect(event_date).toBe('2025-08-15');
    expect(event_time).toBe('00:00:00');
  });

  test('handles 12 AM and 12 PM correctly', () => {
    const am = convertDateTime('2025-03-01', '12:00 AM');
    const pm = convertDateTime('2025-03-01', '12:00 PM');
    expect(am.event_time).toBe('00:00:00');
    expect(pm.event_time).toBe('12:00:00');
  });

  test('throws on clearly invalid date', () => {
    expect(() => convertDateTime('not a date', '10:00')).toThrow('Invalid date or time format');
  });
});
