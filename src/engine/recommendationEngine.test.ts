import { describe, it, expect } from 'vitest';
import { generatePackingList } from './recommendationEngine';
import type { TripProfile } from '../types';

/**
 * Helper: builds a minimal valid TripProfile for testing.
 */
function makeProfile(overrides: Partial<TripProfile> = {}): TripProfile {
  return {
    departureDate: new Date(2025, 5, 1), // June 1 → Summer
    returnDate: new Date(2025, 5, 15),
    accommodationType: 'Hotel',
    season: 'Summer',
    tripDurationDays: 14,
    ...overrides,
  };
}

describe('generatePackingList', () => {
  describe('base items', () => {
    it('always includes Walking Poles regardless of season or accommodation', () => {
      const profiles: TripProfile[] = [
        makeProfile({ season: 'Spring', accommodationType: 'Municipal Albergue' }),
        makeProfile({ season: 'Summer', accommodationType: 'Hotel' }),
        makeProfile({ season: 'Autumn', accommodationType: 'Hostel' }),
        makeProfile({ season: 'Winter', accommodationType: 'Private Albergue' }),
      ];
      for (const profile of profiles) {
        const list = generatePackingList(profile);
        expect(list.items.some(i => i.id === 'base-walking-poles')).toBe(true);
      }
    });

    it('always includes Blister Kit regardless of season or accommodation', () => {
      const profiles: TripProfile[] = [
        makeProfile({ season: 'Spring', accommodationType: 'Municipal Albergue' }),
        makeProfile({ season: 'Summer', accommodationType: 'Hotel' }),
        makeProfile({ season: 'Autumn', accommodationType: 'Hostel' }),
        makeProfile({ season: 'Winter', accommodationType: 'Private Albergue' }),
      ];
      for (const profile of profiles) {
        const list = generatePackingList(profile);
        expect(list.items.some(i => i.id === 'base-blister-kit')).toBe(true);
      }
    });

    it('always includes Pilgrim Credential regardless of season or accommodation', () => {
      const profiles: TripProfile[] = [
        makeProfile({ season: 'Spring', accommodationType: 'Municipal Albergue' }),
        makeProfile({ season: 'Summer', accommodationType: 'Hotel' }),
        makeProfile({ season: 'Autumn', accommodationType: 'Hostel' }),
        makeProfile({ season: 'Winter', accommodationType: 'Private Albergue' }),
      ];
      for (const profile of profiles) {
        const list = generatePackingList(profile);
        expect(list.items.some(i => i.id === 'base-pilgrim-credential')).toBe(true);
      }
    });
  });

  describe('sleeping items by accommodation type', () => {
    it('includes sleeping bag liner for Municipal Albergue', () => {
      const list = generatePackingList(makeProfile({ accommodationType: 'Municipal Albergue' }));
      expect(list.items.some(i => i.id === 'sleep-liner')).toBe(true);
    });

    it('includes sleeping bag liner for Private Albergue', () => {
      const list = generatePackingList(makeProfile({ accommodationType: 'Private Albergue' }));
      expect(list.items.some(i => i.id === 'sleep-liner')).toBe(true);
    });

    it('includes sleeping bag liner for Hostel', () => {
      const list = generatePackingList(makeProfile({ accommodationType: 'Hostel' }));
      expect(list.items.some(i => i.id === 'sleep-liner')).toBe(true);
    });

    it('excludes sleeping bag liner for Hotel', () => {
      const list = generatePackingList(makeProfile({ accommodationType: 'Hotel' }));
      expect(list.items.some(i => i.id === 'sleep-liner')).toBe(false);
    });

    it('includes earplugs for Municipal Albergue', () => {
      const list = generatePackingList(makeProfile({ accommodationType: 'Municipal Albergue' }));
      expect(list.items.some(i => i.id === 'sleep-earplugs')).toBe(true);
    });

    it('excludes earplugs for Hotel', () => {
      const list = generatePackingList(makeProfile({ accommodationType: 'Hotel' }));
      expect(list.items.some(i => i.id === 'sleep-earplugs')).toBe(false);
    });
  });

  describe('season-specific items', () => {
    it('includes rain jacket for Spring', () => {
      const list = generatePackingList(makeProfile({ season: 'Spring' }));
      expect(list.items.some(i => i.id === 'spring-autumn-rain-jacket')).toBe(true);
    });

    it('includes rain jacket for Autumn', () => {
      const list = generatePackingList(makeProfile({ season: 'Autumn' }));
      expect(list.items.some(i => i.id === 'spring-autumn-rain-jacket')).toBe(true);
    });

    it('excludes rain jacket for Summer', () => {
      const list = generatePackingList(makeProfile({ season: 'Summer' }));
      expect(list.items.some(i => i.id === 'spring-autumn-rain-jacket')).toBe(false);
    });

    it('excludes rain jacket for Winter', () => {
      const list = generatePackingList(makeProfile({ season: 'Winter' }));
      expect(list.items.some(i => i.id === 'spring-autumn-rain-jacket')).toBe(false);
    });

    it('includes sunscreen for Summer', () => {
      const list = generatePackingList(makeProfile({ season: 'Summer' }));
      expect(list.items.some(i => i.id === 'summer-sunscreen')).toBe(true);
    });

    it('includes sun hat for Summer', () => {
      const list = generatePackingList(makeProfile({ season: 'Summer' }));
      expect(list.items.some(i => i.id === 'summer-sun-hat')).toBe(true);
    });

    it('includes UV-protective clothing for Summer', () => {
      const list = generatePackingList(makeProfile({ season: 'Summer' }));
      expect(list.items.some(i => i.id === 'summer-uv-clothing')).toBe(true);
    });

    it('excludes Summer items for Winter', () => {
      const list = generatePackingList(makeProfile({ season: 'Winter' }));
      expect(list.items.some(i => i.id === 'summer-sunscreen')).toBe(false);
      expect(list.items.some(i => i.id === 'summer-sun-hat')).toBe(false);
    });

    it('includes thermal base layers for Winter', () => {
      const list = generatePackingList(makeProfile({ season: 'Winter' }));
      expect(list.items.some(i => i.id === 'winter-thermal-base-layers')).toBe(true);
    });

    it('includes waterproof jacket for Winter', () => {
      const list = generatePackingList(makeProfile({ season: 'Winter' }));
      expect(list.items.some(i => i.id === 'winter-waterproof-jacket')).toBe(true);
    });

    it('includes gloves for Winter', () => {
      const list = generatePackingList(makeProfile({ season: 'Winter' }));
      expect(list.items.some(i => i.id === 'winter-gloves')).toBe(true);
    });

    it('excludes Winter items for Summer', () => {
      const list = generatePackingList(makeProfile({ season: 'Summer' }));
      expect(list.items.some(i => i.id === 'winter-thermal-base-layers')).toBe(false);
      expect(list.items.some(i => i.id === 'winter-gloves')).toBe(false);
    });
  });

  describe('output structure', () => {
    it('returns a PackingList with items array and generatedAt date', () => {
      const list = generatePackingList(makeProfile());
      expect(Array.isArray(list.items)).toBe(true);
      expect(list.generatedAt).toBeInstanceOf(Date);
    });

    it('all items have non-empty id, name, and valid category', () => {
      const validCategories = new Set([
        'Clothing', 'Footwear', 'Sleeping', 'Toiletries',
        'Documents', 'Electronics', 'First Aid',
      ]);
      const profiles: TripProfile[] = [
        makeProfile({ season: 'Spring', accommodationType: 'Municipal Albergue' }),
        makeProfile({ season: 'Summer', accommodationType: 'Hotel' }),
        makeProfile({ season: 'Autumn', accommodationType: 'Hostel' }),
        makeProfile({ season: 'Winter', accommodationType: 'Private Albergue' }),
      ];
      for (const profile of profiles) {
        const list = generatePackingList(profile);
        for (const item of list.items) {
          expect(item.id).toBeTruthy();
          expect(item.name).toBeTruthy();
          expect(validCategories.has(item.category)).toBe(true);
          if (item.note !== undefined) {
            expect(item.note.length).toBeLessThanOrEqual(60);
          }
        }
      }
    });

    it('does not include ItemDefinition-only fields in output items', () => {
      const list = generatePackingList(makeProfile());
      for (const item of list.items) {
        expect((item as Record<string, unknown>)['isBase']).toBeUndefined();
        expect((item as Record<string, unknown>)['seasons']).toBeUndefined();
        expect((item as Record<string, unknown>)['accommodationTypes']).toBeUndefined();
        expect((item as Record<string, unknown>)['excludeAccommodationTypes']).toBeUndefined();
      }
    });

    it('returns at least one item for any valid profile', () => {
      const profiles: TripProfile[] = [
        makeProfile({ season: 'Spring', accommodationType: 'Municipal Albergue' }),
        makeProfile({ season: 'Summer', accommodationType: 'Hotel' }),
        makeProfile({ season: 'Autumn', accommodationType: 'Hostel' }),
        makeProfile({ season: 'Winter', accommodationType: 'Private Albergue' }),
      ];
      for (const profile of profiles) {
        const list = generatePackingList(profile);
        expect(list.items.length).toBeGreaterThan(0);
      }
    });
  });
});
