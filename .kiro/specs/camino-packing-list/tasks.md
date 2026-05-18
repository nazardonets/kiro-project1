# Implementation Plan: Camino Packing List

## Overview

Implement a client-side React + TypeScript web app that collects trip dates and accommodation type, runs them through a pure recommendation engine, and displays a categorized, interactive packing list with export, print, and reset capabilities. The implementation follows the two-screen flow: Trip Profile Form → Packing List View.

## Tasks

- [x] 1. Set up project structure and core types
  - Initialize a Vite + React + TypeScript project
  - Install dependencies: `react`, `react-dom`, `typescript`, `vitest`, `@vitest/ui`, `fast-check`, `@testing-library/react`, `@testing-library/jest-dom`
  - Create the directory structure: `src/engine/`, `src/components/`, `src/data/`
  - Define all TypeScript interfaces and types (`AccommodationType`, `Season`, `Category`, `Item`, `ItemDefinition`, `TripProfileInput`, `TripProfile`, `PackingList`, `ValidationResult`, `FieldError`) in `src/types.ts`
  - Configure Vitest in `vite.config.ts`
  - _Requirements: 1.1, 1.6, 3.1, 4.2, 4.3_

- [x] 2. Implement the static item database
  - [x] 2.1 Create `src/data/items.ts` with the full `ItemDefinition[]` array
    - Include base items (walking poles, blister kit, pilgrim credential) with `isBase: true`
    - Include season-specific items tagged with `seasons` arrays (Spring/Autumn layers, Summer breathable/sun-protective, Winter thermal/waterproof/gloves)
    - Include accommodation-specific sleeping items (sleeping bag liner for albergues, excluded for Hotel via `excludeAccommodationTypes`)
    - Include items for all seven categories: Clothing, Footwear, Sleeping, Toiletries, Documents, Electronics, First Aid
    - Ensure all item notes are ≤ 60 characters
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.2, 4.3_

- [x] 3. Implement the recommendation engine
  - [x] 3.1 Create `src/engine/seasonDetection.ts` with `detectSeason(departureDate: Date): Season`
    - Map months 3–5 → Spring, 6–8 → Summer, 9–11 → Autumn, 12/1/2 → Winter
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ]* 3.2 Write property test for season detection (Property 1)
    - **Property 1: Season detection is total and correct**
    - **Validates: Requirements 2.1, 2.2, 2.3**
    - Generate arbitrary valid dates across all months; verify `detectSeason` returns the correct season per the month mapping
    - Tag: `// Feature: camino-packing-list, Property 1: Season detection is total and correct`
    - _File: `src/engine/seasonDetection.test.ts`_

  - [x] 3.3 Create `src/engine/validation.ts` with `validateTripProfile(profile: TripProfileInput): ValidationResult`
    - Validate departure date present and not in the past
    - Validate return date present
    - Validate departure date strictly before return date
    - Validate trip duration ≤ 90 days
    - Validate accommodation type is one of the four supported values
    - Return field-level errors per the error table in the design
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.7, 1.8_

  - [ ]* 3.4 Write property test for validation — invalid profiles (Property 2)
    - **Property 2: Invalid trip profiles are always rejected**
    - **Validates: Requirements 1.2, 1.3, 1.5, 1.8**
    - Generate invalid trip profile inputs (bad dates, missing fields, >90 days); verify `validateTripProfile` always returns `valid: false` with at least one field error
    - Tag: `// Feature: camino-packing-list, Property 2: Invalid trip profiles are always rejected`
    - _File: `src/engine/validation.test.ts`_

  - [ ]* 3.5 Write property test for validation — valid profiles (Property 3)
    - **Property 3: Valid trip profiles are always accepted**
    - **Validates: Requirements 1.7**
    - Generate valid trip profile inputs; verify `validateTripProfile` always returns `valid: true` with no errors
    - Tag: `// Feature: camino-packing-list, Property 3: Valid trip profiles are always accepted`
    - _File: `src/engine/validation.test.ts`_

  - [x] 3.6 Create `src/engine/recommendationEngine.ts` with `generatePackingList(profile: TripProfile): PackingList`
    - Filter `ItemDefinition[]` by season (include if `seasons` is absent or contains the profile's season)
    - Filter by accommodation type (include if `accommodationTypes` is absent or contains the type; exclude if `excludeAccommodationTypes` contains the type)
    - Always include items with `isBase: true`
    - Set `generatedAt` to current timestamp
    - Return a `PackingList` with the filtered items
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.8, 3.9, 3.10_

  - [ ]* 3.7 Write property test for base items always present (Property 4)
    - **Property 4: Base items are always present**
    - **Validates: Requirements 3.4**
    - Generate arbitrary valid profiles; verify walking poles, blister kit, and pilgrim credential are always in the output
    - Tag: `// Feature: camino-packing-list, Property 4: Base items are always present`
    - _File: `src/engine/recommendationEngine.test.ts`_

  - [ ]* 3.8 Write property test for sleeping items follow accommodation type (Property 5)
    - **Property 5: Sleeping items follow accommodation type**
    - **Validates: Requirements 3.5, 3.6**
    - Generate profiles with albergue types; verify sleeping bag liner is present. Generate profiles with Hotel type; verify sleeping items are absent
    - Tag: `// Feature: camino-packing-list, Property 5: Sleeping items follow accommodation type`
    - _File: `src/engine/recommendationEngine.test.ts`_

  - [ ]* 3.9 Write property test for Winter items always present for Winter trips (Property 6)
    - **Property 6: Winter items are always present for Winter trips**
    - **Validates: Requirements 3.8**
    - Generate profiles with Winter departure dates; verify thermal base layers, waterproof jacket, and gloves are present
    - Tag: `// Feature: camino-packing-list, Property 6: Winter items are always present for Winter trips`
    - _File: `src/engine/recommendationEngine.test.ts`_

  - [ ]* 3.10 Write property test for Summer sun protection always present (Property 7)
    - **Property 7: Summer sun protection is always present for Summer trips**
    - **Validates: Requirements 3.9**
    - Generate profiles with Summer departure dates; verify sunscreen, sun hat, and UV-protective clothing are present
    - Tag: `// Feature: camino-packing-list, Property 7: Summer sun protection is always present for Summer trips`
    - _File: `src/engine/recommendationEngine.test.ts`_

  - [ ]* 3.11 Write property test for all items having valid categories and names (Property 8)
    - **Property 8: All packing list items have valid categories and names**
    - **Validates: Requirements 3.1, 4.2, 4.3**
    - Generate arbitrary valid profiles; verify all items have valid categories, non-empty names, and notes ≤ 60 chars
    - Tag: `// Feature: camino-packing-list, Property 8: All packing list items have valid categories and names`
    - _File: `src/engine/recommendationEngine.test.ts`_

- [x] 4. Checkpoint — Ensure all engine tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement the TripProfileForm component
  - [x] 5.1 Create `src/components/TripProfileForm/TripProfileForm.tsx`
    - Render departure date field, return date field, and accommodation type selector (Municipal Albergue, Private Albergue, Hostel, Hotel)
    - On submit, call `validateTripProfile`; if invalid, display field-level error messages adjacent to each field; if valid, call `onSubmit(profile)`
    - Do not run validation on every keystroke — only on submit
    - Props: `onSubmit: (profile: TripProfile) => void`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

  - [ ]* 5.2 Write unit tests for TripProfileForm
    - Test: renders all three fields
    - Test: shows correct error messages for each invalid input condition
    - Test: calls `onSubmit` with a valid `TripProfile` on valid submission
    - _File: `src/components/TripProfileForm/TripProfileForm.test.tsx`_
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.7, 1.8_

- [x] 6. Implement the PackingItem and CategorySection components
  - [x] 6.1 Create `src/components/PackingItem/PackingItem.tsx`
    - Render a checkbox, item name, and optional note
    - When checked, apply strikethrough text and reduced opacity
    - Props: `item: Item`, `checked: boolean`, `onToggle: (id: string) => void`
    - _Requirements: 4.2, 4.3, 5.1, 5.2_

  - [x] 6.2 Create `src/components/CategorySection/CategorySection.tsx`
    - Render a category heading and a list of `PackingItem` components
    - Props: `category: Category`, `items: Item[]`, `checkedIds: Set<string>`, `onToggle: (id: string) => void`
    - _Requirements: 4.1, 4.2_

  - [ ]* 6.3 Write unit tests for PackingItem
    - Test: checkbox toggles correctly
    - Test: strikethrough and reduced opacity applied when checked
    - Test: note displayed when present
    - _File: `src/components/PackingItem/PackingItem.test.tsx`_
    - _Requirements: 4.2, 4.3, 5.1, 5.2_

- [x] 7. Implement the TripSummary and PackingListControls components
  - [x] 7.1 Create `src/components/TripSummary/TripSummary.tsx`
    - Display departure date, return date, accommodation type, and derived season
    - Props: `tripProfile: TripProfile`, `season: Season`
    - _Requirements: 4.5_

  - [x] 7.2 Create `src/components/PackingListControls/PackingListControls.tsx`
    - Render Export, Print, and Start Over buttons
    - Export: generate a `.txt` file using `Blob` + `URL.createObjectURL`; if list is empty, show inline message instead
    - Print: call `window.print()`; if list is empty, show inline message instead
    - Start Over: show confirmation prompt (`window.confirm` or custom modal); on confirm call `onStartOver`; on cancel do nothing
    - Props: `packingList: PackingList`, `tripProfile: TripProfile`, `onStartOver: () => void`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4_

  - [ ]* 7.3 Write unit tests for PackingListControls
    - Test: export triggers file download with correct content
    - Test: export shows inline message when list is empty
    - Test: print shows inline message when list is empty
    - Test: Start Over confirm clears state; cancel preserves state
    - _File: `src/components/PackingListControls/PackingListControls.test.tsx`_
    - _Requirements: 6.2, 6.3, 6.4, 6.5, 7.2, 7.3, 7.4_

- [x] 8. Implement the PackingListView component
  - [x] 8.1 Create `src/components/PackingListView/PackingListView.tsx`
    - Render `TripSummary`, a list of `CategorySection` components (items grouped by category), the "X of Y items packed" counter, and `PackingListControls`
    - Manage `checkedIds: Set<string>` in local state via `useState`
    - Update counter within 100ms on toggle (React state update is synchronous in test environments)
    - If `packingList.items` is empty, display the "no items found" message
    - Props: `packingList: PackingList`, `tripProfile: TripProfile`, `onReset: () => void`
    - _Requirements: 4.1, 4.4, 4.5, 4.6, 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 8.2 Write property test for toggle state isolation round-trip (Property 9)
    - **Property 9: Toggle state isolation round-trip**
    - **Validates: Requirements 5.3, 5.4**
    - Generate arbitrary checked states and toggle operations; verify toggling an item twice returns to original state and other items are unaffected
    - Tag: `// Feature: camino-packing-list, Property 9: Toggle state isolation round-trip`
    - _File: `src/components/PackingListView/PackingListView.test.tsx`_

  - [ ]* 8.3 Write property test for item count display accuracy (Property 10)
    - **Property 10: Item count display is always accurate**
    - **Validates: Requirements 5.3**
    - Generate arbitrary checked states; verify displayed "X of Y" count equals the number of checked items and total items
    - Tag: `// Feature: camino-packing-list, Property 10: Item count display is always accurate`
    - _File: `src/components/PackingListView/PackingListView.test.tsx`_

  - [ ]* 8.4 Write property test for canceling start-over preserves all state (Property 11)
    - **Property 11: Canceling start-over preserves all state**
    - **Validates: Requirements 7.4**
    - Generate arbitrary packing list states; verify canceling the start-over confirmation leaves all state unchanged
    - Tag: `// Feature: camino-packing-list, Property 11: Canceling start-over preserves all state`
    - _File: `src/components/PackingListView/PackingListView.test.tsx`_

  - [ ]* 8.5 Write unit tests for PackingListView
    - Test: items rendered grouped by category with category headings
    - Test: counter updates on toggle
    - Test: "no items found" message shown for empty list
    - _File: `src/components/PackingListView/PackingListView.test.tsx`_
    - _Requirements: 4.1, 4.4, 4.6, 5.3_

- [ ] 9. Checkpoint — Ensure all component tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Wire everything together in App
  - [ ] 10.1 Create `src/App.tsx` with top-level state management
    - Manage `tripProfile: TripProfile | null` and `packingList: PackingList | null` in state
    - When `tripProfile` is null, render `TripProfileForm`
    - On form submit, call `generatePackingList(profile)` and store both in state, then render `PackingListView`
    - On reset (Start Over confirmed), clear both state values and return to `TripProfileForm`
    - _Requirements: 1.1, 3.10, 7.3_

  - [ ]* 10.2 Write integration tests for the full app flow
    - Test: submitting a valid form renders the packing list view with correct trip summary
    - Test: Start Over confirmed returns to the form with empty fields
    - Test: Start Over cancelled preserves the packing list and checked states
    - _File: `src/App.test.tsx`_
    - _Requirements: 1.7, 4.5, 7.3, 7.4_

- [ ] 11. Add print styles
  - [ ] 11.1 Create `src/print.css` with `@media print` rules
    - Hide interactive elements (checkboxes rendered as static marks, buttons hidden)
    - Ensure trip name, dates, and all items grouped by category are visible
    - _Requirements: 6.2_

- [ ] 12. Final checkpoint — Ensure all tests pass
  - Run `vitest --run` and confirm all tests pass. Ask the user if any questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties using fast-check (minimum 100 iterations per property; use 200 for Properties 2, 3, 4)
- Unit tests validate specific examples and edge cases
- The recommendation engine is a pure function — ideal for property-based testing
- Run tests with `vitest --run` (single execution, not watch mode)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.1"] },
    { "id": 1, "tasks": ["3.1", "3.3"] },
    { "id": 2, "tasks": ["3.2", "3.4", "3.5", "3.6"] },
    { "id": 3, "tasks": ["3.7", "3.8", "3.9", "3.10", "3.11", "5.1"] },
    { "id": 4, "tasks": ["5.2", "6.1", "6.2", "7.1", "7.2"] },
    { "id": 5, "tasks": ["6.3", "7.3", "8.1"] },
    { "id": 6, "tasks": ["8.2", "8.3", "8.4", "8.5", "10.1"] },
    { "id": 7, "tasks": ["10.2", "11.1"] }
  ]
}
```
