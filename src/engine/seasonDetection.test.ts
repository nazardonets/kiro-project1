import { describe, it, expect } from 'vitest';
import { detectSeason } from './seasonDetection';

describe('detectSeason', () => {
  // Spring: months 3–5
  it('returns Spring for March (month 3)', () => {
    expect(detectSeason(new Date(2025, 2, 15))).toBe('Spring'); // month index 2 = March
  });

  it('returns Spring for April (month 4)', () => {
    expect(detectSeason(new Date(2025, 3, 1))).toBe('Spring');
  });

  it('returns Spring for May (month 5)', () => {
    expect(detectSeason(new Date(2025, 4, 31))).toBe('Spring');
  });

  // Summer: months 6–8
  it('returns Summer for June (month 6)', () => {
    expect(detectSeason(new Date(2025, 5, 1))).toBe('Summer');
  });

  it('returns Summer for July (month 7)', () => {
    expect(detectSeason(new Date(2025, 6, 15))).toBe('Summer');
  });

  it('returns Summer for August (month 8)', () => {
    expect(detectSeason(new Date(2025, 7, 31))).toBe('Summer');
  });

  // Autumn: months 9–11
  it('returns Autumn for September (month 9)', () => {
    expect(detectSeason(new Date(2025, 8, 1))).toBe('Autumn');
  });

  it('returns Autumn for October (month 10)', () => {
    expect(detectSeason(new Date(2025, 9, 15))).toBe('Autumn');
  });

  it('returns Autumn for November (month 11)', () => {
    expect(detectSeason(new Date(2025, 10, 30))).toBe('Autumn');
  });

  // Winter: months 12, 1, 2
  it('returns Winter for December (month 12)', () => {
    expect(detectSeason(new Date(2025, 11, 1))).toBe('Winter');
  });

  it('returns Winter for January (month 1)', () => {
    expect(detectSeason(new Date(2025, 0, 15))).toBe('Winter');
  });

  it('returns Winter for February (month 2)', () => {
    expect(detectSeason(new Date(2025, 1, 28))).toBe('Winter');
  });

  // Season is derived from departure month only, even if trip spans two seasons
  it('uses departure month only (not return date) for season', () => {
    // Departure in May (Spring), return would be in June (Summer)
    const mayDate = new Date(2025, 4, 28);
    expect(detectSeason(mayDate)).toBe('Spring');
  });

  // Boundary checks
  it('returns Spring for March 1 (start of Spring)', () => {
    expect(detectSeason(new Date(2025, 2, 1))).toBe('Spring');
  });

  it('returns Autumn for November 30 (end of Autumn)', () => {
    expect(detectSeason(new Date(2025, 10, 30))).toBe('Autumn');
  });

  it('returns Winter for December 31 (end of year)', () => {
    expect(detectSeason(new Date(2025, 11, 31))).toBe('Winter');
  });
});
