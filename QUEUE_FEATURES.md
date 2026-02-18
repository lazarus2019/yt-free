# Queue Management Features

## 🎵 Queue Features Overview

The player now includes advanced queue management capabilities:

### Features Added

#### 1. **Remove from Queue**
- Click the trash icon on any queue item to remove it
- Button appears on hover for better UI/UX
- Removes track by index to avoid duplicate removals
- Works seamlessly with shuffle mode

#### 2. **Reorder Queue (Move Up/Down)**
- Move tracks up with the up chevron ↑
- Move tracks down with the down chevron ↓
- Buttons are disabled at edges (can't move first track up, last track down)
- Changes persist in both regular and shuffled queue states

#### 3. **Queue Display Enhancements**
- Queue now shows track count: `Queue (12)`
- Better visual hierarchy with hover states
- Currently playing track highlighted in red
- Compact layout that fits more items on screen

---

## 🛠️ Store Functions

### New Player Store Actions

```typescript
// Remove track by ID
removeFromQueue(trackId: string): void

// Remove track by queue index
removeFromQueueByIndex(index: number): void

// Reorder queue from one position to another
reorderQueue(fromIndex: number, toIndex: number): void

// Move track up one position
moveTrackUp(index: number): void

// Move track down one position
moveTrackDown(index: number): void
```

### Usage Examples

```typescript
import { usePlayerStore } from '@/stores';

export function QueueExample() {
  const {
    removeFromQueueByIndex,
    moveTrackUp,
    moveTrackDown,
    reorderQueue,
  } = usePlayerStore();

  // Remove 3rd item from queue
  const handleRemove = () => removeFromQueueByIndex(2);

  // Move 2nd item up to 1st position
  const handleMoveUp = () => moveTrackUp(1);

  // Move 1st item down to 2nd position
  const handleMoveDown = () => moveTrackDown(0);

  // Move item from position 5 to position 2
  const handleReorder = () => reorderQueue(5, 2);

  return (
    <div>
      <button onClick={handleRemove}>Remove</button>
      <button onClick={handleMoveUp}>Move Up</button>
      <button onClick={handleMoveDown}>Move Down</button>
      <button onClick={handleReorder}>Custom Reorder</button>
    </div>
  );
}
```

---

## 🎨 UI Components

### Queue Panel Layout

```
┌─────────────────────────────┐
│ Queue (5)              ✕    │  ← Header with track count
├─────────────────────────────┤
│ 1 [IMG] Song Title      ↑ ✕ │  ← Action buttons on hover
│   Artist Name           ↓   │
├─────────────────────────────┤
│ 2 [IMG] Next Song       ↑ ✕ │
│   Artist Name           ↓   │
├─────────────────────────────┤
│ 3 [IMG] Another Track   ↑ ✕ │
│   Artist Name           ↓   │
└─────────────────────────────┘
```

### Interaction States

- **Normal**: Gray text, minimal opacity
- **Hover**: Buttons appear, track info slightly highlighted
- **Active**: Currently playing track shows in red
- **Disabled**: Up/down buttons disabled at boundaries (gray, no-cursor)

---

## 🔄 How It Works

### Queue Management Flow

1. **Remove Track**
   ```
   User clicks trash icon
   → Index determined from map position
   → removeFromQueueByIndex(index) called
   → Track removed from both queue and originalQueue
   → UI updates immediately
   ```

2. **Move Track**
   ```
   User clicks ↑ or ↓ button
   → moveTrackUp(index) or moveTrackDown(index) called
   → reorderQueue(index, index±1) executed
   → Array spliced and rejoined
   → originalQueue updated to maintain shuffle state
   → UI re-renders with new order
   ```

3. **State Synchronization**
   ```
   Both queue arrays always kept in sync:
   - queue: Current playback order (may be shuffled)
   - originalQueue: Original order (used when shuffle is toggled off)
   
   This ensures shuffle/unshuffle works correctly after reordering
   ```

---

## 📱 Mobile Responsiveness

- Queue buttons stack vertically on mobile
- Touch-friendly button sizes (minimum 40px tap target)
- Horizontal scroll for actions if needed
- Queue panel adapts to screen size

---

## ✨ Edge Cases Handled

| Scenario | Behavior |
|----------|----------|
| Move first track up | Button disabled (gray) |
| Move last track down | Button disabled (gray) |
| Remove currently playing track | Track removed, next auto-plays |
| Remove all but current track | Queue continues with just current |
| Reorder during shuffle | Both arrays updated correctly |
| Remove while playing | No interruption, continues playing |

---

## 🧪 Testing Checklist

- [ ] Add 5+ tracks to queue
- [ ] Click track to play different one
- [ ] Hover to reveal action buttons
- [ ] Click remove button, verify track disappears
- [ ] Click move up/down arrows
- [ ] Verify buttons disabled at top/bottom
- [ ] Remove currently playing track
- [ ] Test with shuffle enabled
- [ ] Test on mobile (DevTools)
- [ ] Verify queue persists after page refresh (via localStorage)

---

## 🐛 Known Limitations

- No drag-and-drop reordering (use up/down buttons instead)
- Can't batch delete (delete one at a time)
- No undo/redo for queue changes
- Up/down arrows move one position at a time (no jump-to-position)

---

## 🚀 Future Enhancements

1. **Drag and Drop Reordering**
   - Intuitive mouse/touch dragging
   - Visual drop target indicator

2. **Batch Operations**
   - Select multiple tracks
   - Delete or move multiple at once

3. **Queue History**
   - Remember previous queue states
   - Undo/redo functionality

4. **Queue Persistence**
   - Save queue snapshots
   - Quick-load saved queues

5. **Advanced Reordering**
   - Jump-to-position for specific index
   - Reverse queue order
   - Sort by duration/artist

---

## 📝 Files Modified

- `src/stores/playerStore.ts` - Added 4 new store actions
- `src/features/player/components/Player.tsx` - Updated queue panel UI

---

## 🔗 Related Docs

- `IMPLEMENTATION_SUMMARY.md` - Overall project implementation
- `QUICK_REFERENCE.md` - Code examples and API reference
- `CHANGES_OVERVIEW.md` - Previous features added
