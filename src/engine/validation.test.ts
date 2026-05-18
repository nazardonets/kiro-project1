import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { validateTripProfile } from './validation';
import type { TripProfileInput } from '../types';

/**
 * Helper: returns a date string N days from today in YYYY-MM-DD format.
 */
function dateFromToday(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0]!;
}

describe('validateTripProfile', () => {
  describe('missing fields', () => {
    it('returns error when departure date is missing', () => {
      const input: TripProfileInput = {
        departureDate: '',
        returnDate: dateFromToday(10),
        accommodationType: 'Hotel',
      };
      const result = validateTripProfile(input);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'departureDate')).toBe(true);
      expect(result.errors.find(e => e.field === 'departureDate')?.message).toBe(
        'Please enter a departure date.'
      );
    });

    it('returns error when return date is missing', () => {
      const input: TripProfileInput = {
        departureDate: dateFromToday(5),
        returnDate: '',
        accommodationType: 'Hotel',
      };
      const result = validateTripProfile(input);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'returnDate')).toBe(true);
      expect(result.errors.find(e => e.field === 'returnDate')?.message).toBe(
        'Please enter a return date.'
      );
    });

    it('returns error when accommodation type is null', () => {
      const input: TripProfileInput = {
        departureDate: dateFromToday(5),
        returnDate: dateFromToday(15),
        accommodationType: null,
      };
      const result = validateTripProfile(input);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'accommodationType')).toBe(true);
      expect(result.errors.find(e => e.field === 'accommodationType')?.message).toBe(
        'Please select an accommodation type.'
      );
    });

    it('returns multiple errors when all fields are missing', () => {
      const input: TripProfileInput = {
        departureDate: '',
        returnDate: '',
        accommodationType: null,
      };
      const result = validateTripProfile(input);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('date validation', () => {
    it('returns error when departure date is in the past', () => {
      const input: TripProfileInput = {
        departureDate: dateFromToday(-1),
        returnDate: dateFromToday(10),
        accommodationType: 'Hotel',
      };
      const result = validateTripProfile(input);
      expect(result.valid).toBe(false);
      expect(result.errors.find(e => e.field === 'departureDate')?.message).toBe(
        'Departure date must be today or in the future.'
      );
    });

    it('accepts departure date of today', () => {
      const input: TripProfileInput = {
        departureDate: dateFromToday(0),
        returnDate: dateFromToday(10),
        accommodationType: 'Hotel',
      };
      const result = validateTripProfile(input);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns error when departure date equals return date', () => {
      const sameDate = dateFromToday(5);
      const input: TripProfileInput = {
        departureDate: sameDate,
        returnDate: sameDate,
        accommodationType: 'Hotel',
      };
      const result = validateTripProfile(input);
      expect(result.valid).toBe(false);
      expect(result.errors.find(e => e.field === 'departureDate')?.message).toBe(
        'Departure date must be before the return date.'
      );
    });

    it('returns error when departure date is after return date', () => {
      const input: TripProfileInput = {
        departureDate: dateFromToday(10),
        returnDate: dateFromToday(5),
        accommodationType: 'Hotel',
      };
      const result = validateTripProfile(input);
      expect(result.valid).toBe(false);
      expect(result.errors.find(e => e.field === 'departureDate')?.message).toBe(
        'Departure date must be before the return date.'
      );
    });

    it('returns error when trip duration exceeds 90 days', () => {
      const input: TripProfileInput = {
        departureDate: dateFromToday(1),
        returnDate: dateFromToday(92),
        accommodationType: 'Hotel',
      };
      const result = validateTripProfile(input);
      expect(result.valid).toBe(false);
      expect(result.errors.find(e => e.field === 'returnDate')?.message).toBe(
        'Trip duration cannot exceed 90 days.'
      );
    });

    it('accepts trip duration of exactly 90 days', () => {
      const input: TripProfileInput = {
        departureDate: dateFromToday(1),
        returnDate: dateFromToday(91), // 90 days duration
        accommodationType: 'Hotel',
      };
      const result = validateTripProfile(input);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('accepts trip duration of 1 day', () => {
      const input: TripProfileInput = {
        departureDate: dateFromToday(1),
        returnDate: dateFromToday(2),
        accommodationType: 'Hostel',
      };
      const result = validateTripProfile(input);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('accommodation type validation', () => {
    it('accepts Municipal Albergue', () => {
      const input: TripProfileInput = {
        departureDate: dateFromToday(1),
        returnDate: dateFromToday(10),
        accommodationType: 'Municipal Albergue',
      };
      expect(validateTripProfile(input).valid).toBe(true);
    });

    it('accepts Private Albergue', () => {
      const input: TripProfileInput = {
        departureDate: dateFromToday(1),
        returnDate: dateFromToday(10),
        accommodationType: 'Private Albergue',
      };
      expect(validateTripProfile(input).valid).toBe(true);
    });

    it('accepts Hostel', () => {
      const input: TripProfileInput = {
        departureDate: dateFromToday(1),
        returnDate: dateFromToday(10),
        accommodationType: 'Hostel',
      };
      expect(validateTripProfile(input).valid).toBe(true);
    });

    it('accepts Hotel', () => {
      const input: TripProfileInput = {
        departureDate: dateFromToday(1),
        returnDate: dateFromToday(10),
        accommodationType: 'Hotel',
      };
      expect(validateTripProfile(input).valid).toBe(true);
    });
  });

  describe('valid profiles', () => {
    it('returns valid: true with no errors for a fully valid profile', () => {
      const input: TripProfileInput = {
        departureDate: dateFromToday(5),
        returnDate: dateFromToday(20),
        accommodationType: 'Municipal Albergue',
      };
      const result = validateTripProfile(input);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
