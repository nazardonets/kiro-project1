import { describe, it, expect } from 'vitest'
import type { AccommodationType, Season, Category, Item, ItemDefinition, TripProfileInput, TripProfile, PackingList, ValidationResult, FieldError } from './types'

describe('types', () => {
  it('AccommodationType values are correct', () => {
    const types: AccommodationType[] = [
      'Municipal Albergue',
      'Private Albergue',
      'Hostel',
      'Hotel',
    ]
    expect(types).toHaveLength(4)
  })

  it('Season values are correct', () => {
    const seasons: Season[] = ['Spring', 'Summer', 'Autumn', 'Winter']
    expect(seasons).toHaveLength(4)
  })

  it('Category values are correct', () => {
    const categories: Category[] = [
      'Clothing',
      'Footwear',
      'Sleeping',
      'Toiletries',
      'Documents',
      'Electronics',
      'First Aid',
    ]
    expect(categories).toHaveLength(7)
  })

  it('Item interface shape is correct', () => {
    const item: Item = { id: '1', name: 'Test Item', category: 'Clothing' }
    expect(item.id).toBe('1')
    expect(item.name).toBe('Test Item')
    expect(item.category).toBe('Clothing')
    expect(item.note).toBeUndefined()
  })

  it('ItemDefinition extends Item with optional fields', () => {
    const def: ItemDefinition = {
      id: 'base-1',
      name: 'Walking Poles',
      category: 'Footwear',
      isBase: true,
    }
    expect(def.isBase).toBe(true)
    expect(def.seasons).toBeUndefined()
    expect(def.accommodationTypes).toBeUndefined()
    expect(def.excludeAccommodationTypes).toBeUndefined()
  })

  it('TripProfileInput allows null accommodationType', () => {
    const input: TripProfileInput = {
      departureDate: '2025-06-01',
      returnDate: '2025-06-15',
      accommodationType: null,
    }
    expect(input.accommodationType).toBeNull()
  })

  it('TripProfile has all required fields', () => {
    const profile: TripProfile = {
      departureDate: new Date('2025-06-01'),
      returnDate: new Date('2025-06-15'),
      accommodationType: 'Hotel',
      season: 'Summer',
      tripDurationDays: 14,
    }
    expect(profile.season).toBe('Summer')
    expect(profile.tripDurationDays).toBe(14)
  })

  it('PackingList has items and generatedAt', () => {
    const list: PackingList = { items: [], generatedAt: new Date() }
    expect(list.items).toHaveLength(0)
    expect(list.generatedAt).toBeInstanceOf(Date)
  })

  it('ValidationResult with errors', () => {
    const error: FieldError = {
      field: 'departureDate',
      message: 'Please enter a departure date.',
    }
    const result: ValidationResult = { valid: false, errors: [error] }
    expect(result.valid).toBe(false)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]?.field).toBe('departureDate')
  })
})
