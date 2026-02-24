# Quick Reference: New Features

## 🎼 Queue Management

The queue panel now has advanced management features:

```typescript
import { usePlayerStore } from '@/stores';

const {
  removeFromQueueByIndex, // Remove track by index
  moveTrackUp, // Move track up one position
  moveTrackDown, // Move track down one position
  reorderQueue, // Reorder from one index to another
} = usePlayerStore();

// Remove 3rd item from queue
removeFromQueueByIndex(2);

// Move item at position 1 up to position 0
moveTrackUp(1);

// Move item at position 0 down to position 1
moveTrackDown(0);

// Move item from position 5 to position 2
reorderQueue(5, 2);
```

### UI Features

- **Remove**: Trash icon appears on hover - click to remove from queue
- **Reorder**: ↑ ↓ arrows to move tracks up/down
- **Queue Count**: Shows total items: `Queue (12)`
- **Visual Feedback**: Currently playing track highlighted in red

---

## 🔄 Using Player Mode Toggle

The player now has a music/video mode toggle in the controls:

```typescript
// In any component using the player store:
import { usePlayerStore } from '@/stores';

const { playerMode, setPlayerMode } = usePlayerStore();

// Toggle mode
setPlayerMode(playerMode === 'audio' ? 'video' : 'audio');

// Mode is auto-saved to localStorage
```

## 🎵 Getting Related Music Recommendations

```typescript
import { useRelatedMusic } from '@/hooks';

// In your component:
const { data: relatedTracks, isLoading } = useRelatedMusic(currentTrack);

// relatedTracks is an array of Track objects:
// [
//   {
//     id: 'track-id',
//     title: 'Related Song Title',
//     artist: 'Artist Name',
//     duration: 240,
//     thumbnail: 'url',
//     videoId: 'yt-video-id'
//   },
//   ...
// ]
```

### Direct Service Usage

```typescript
import { recommendationService } from '@/services';

// Get related music for a specific video
const relatedTracks = await recommendationService.getRelatedMusic(
  videoId,
  (maxResults = 10),
);

// Add to auto-queue
const tracks = await recommendationService.getAndQueueRelated(
  currentTrack,
  (maxResults = 5),
);
```

## 📱 Mobile Menu Interaction

The sidebar now has a responsive mobile menu:

```typescript
// In MainLayout - state managed internally
const [sidebarOpen, setSidebarOpen] = useState(false);

// Hamburger button visible on mobile (md:hidden)
// Clicking toggles setSidebarOpen(!sidebarOpen)

// Click outside the sidebar closes it
// Sidebar slides in from left on small screens
```

## 🎛️ Player Mode in YouTubePlayer

To display full video when in video mode:

```typescript
import { usePlayerStore } from '@/stores';

export function YouTubePlayer() {
  const { playerMode } = usePlayerStore();

  if (playerMode === 'video') {
    // Show full YouTube player iframe
  } else {
    // Show 1x1 hidden player for audio only
  }
}
```

## 📊 Responsive Breakpoints in Use

```typescript
// In components:
<div className="ml-64 md:ml-0">
  {/* On desktop: 64 units left margin */}
  {/* On mobile: no margin, full width */}
</div>

<button className="hidden md:block">
  {/* Hidden on mobile, shown on tablet+ */}
</button>

<div className="px-4 md:px-6">
  {/* 4 units padding on mobile, 6 units on desktop */}
</div>
```

## 🔗 Files Quick Links

| Feature         | File                                        | Purpose                              |
| --------------- | ------------------------------------------- | ------------------------------------ |
| Mobile Layout   | `src/components/layout/MainLayout.tsx`      | Main layout with responsive sidebar  |
| Sidebar         | `src/components/layout/Sidebar.tsx`         | Responsive sidebar navigation        |
| Header          | `src/components/layout/Header.tsx`          | Responsive top header                |
| Player Mode     | `src/stores/playerStore.ts`                 | Zustand store with playerMode state  |
| Mode Toggle     | `src/features/player/components/Player.tsx` | UI button to toggle mode             |
| Recommendations | `src/services/recommendationService.ts`     | API service for related music        |
| Hook            | `src/hooks/useRelatedMusic.ts`              | React Query hook for recommendations |

## 🧪 Testing

### Test Mobile Responsiveness

```bash
# Start dev server
npm run dev

# In browser DevTools:
# 1. Toggle device toolbar (Ctrl+Shift+M or Cmd+Shift+M)
# 2. Select mobile device (e.g., iPhone 12)
# 3. Test hamburger menu toggle
# 4. Test sidebar scroll on playlist list
```

### Test Recommendations

```typescript
// In browser console:
const { recommendationService } = await import('src/services');
const tracks = await recommendationService.getRelatedMusic('dQw4w9WgXcQ');
console.log(tracks); // Should show related track objects
```

### Test Build

```bash
npm run build  # Should succeed with no errors
npm run lint   # Our files should have no lint errors
```
