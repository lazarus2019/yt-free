import { useEffect, useRef, useCallback } from 'react';
import { usePlayerStore } from '@/stores';
import { loadYouTubeAPI } from '@/services/youtubePlayer';

/**
 * Hidden YouTube IFrame player that handles actual video/audio playback.
 * This replaces the previous <audio> element.
 * The iframe is hidden (1x1 pixel) — we only use it for audio playback.
 */
export function YouTubePlayer() {
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentVideoIdRef = useRef<string | null>(null);

  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    next,
    setCurrentTime,
    setDuration,
    play,
    pause,
  } = usePlayerStore();

  // Time update polling (YT API doesn't have a native timeupdate event)
  const startTimeUpdates = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        const time = playerRef.current.getCurrentTime();
        const dur = playerRef.current.getDuration();
        if (time >= 0) setCurrentTime(time);
        if (dur > 0) setDuration(dur);
      }
    }, 250);
  }, [setCurrentTime, setDuration]);

  const stopTimeUpdates = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Initialize YT Player
  useEffect(() => {
    let mounted = true;

    async function init() {
      await loadYouTubeAPI();
      if (!mounted || !containerRef.current) return;

      const { YT } = window;

      playerRef.current = new YT.Player('yt-hidden-player', {
        height: '1',
        width: '1',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            if (!mounted) return;
            // Expose player globally for seek access from Player controls
            (window as unknown as { __ytPlayer?: YT.Player }).__ytPlayer = playerRef.current!;
            // Apply stored volume
            const state = usePlayerStore.getState();
            playerRef.current?.setVolume(state.isMuted ? 0 : state.volume * 100);
          },
          onStateChange: (event) => {
            if (!mounted) return;
            const ytState = event.data;
            const { YT: YTRef } = window;

            if (ytState === YTRef.PlayerState.PLAYING) {
              play();
              startTimeUpdates();
              // Update duration when video starts
              const dur = playerRef.current?.getDuration();
              if (dur && dur > 0) setDuration(dur);
            } else if (ytState === YTRef.PlayerState.PAUSED) {
              pause();
              stopTimeUpdates();
            } else if (ytState === YTRef.PlayerState.ENDED) {
              stopTimeUpdates();
              const { repeatMode } = usePlayerStore.getState();
              if (repeatMode === 'one') {
                playerRef.current?.seekTo(0, true);
                playerRef.current?.playVideo();
              } else {
                next();
              }
            } else if (ytState === YTRef.PlayerState.BUFFERING) {
              startTimeUpdates();
            }
          },
          onError: (event) => {
            console.error('YouTube Player Error:', event.data);
            // Auto-skip to next on error (e.g., video unavailable)
            stopTimeUpdates();
            next();
          },
        },
      });
    }

    init();

    return () => {
      mounted = false;
      stopTimeUpdates();
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load new video when track changes
  useEffect(() => {
    if (!playerRef.current || !currentTrack) return;

    if (currentVideoIdRef.current !== currentTrack.videoId) {
      currentVideoIdRef.current = currentTrack.videoId;
      playerRef.current.loadVideoById(currentTrack.videoId);
      startTimeUpdates();
    }
  }, [currentTrack, startTimeUpdates]);

  // Handle play/pause state changes from the store
  useEffect(() => {
    if (!playerRef.current || !currentTrack) return;

    try {
      const playerState = playerRef.current.getPlayerState();
      const { YT } = window;
      if (isPlaying && playerState !== YT.PlayerState.PLAYING) {
        playerRef.current.playVideo();
      } else if (!isPlaying && playerState === YT.PlayerState.PLAYING) {
        playerRef.current.pauseVideo();
      }
    } catch {
      // Player not ready yet
    }
  }, [isPlaying, currentTrack]);

  // Handle volume changes
  useEffect(() => {
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume * 100);
      }
    } catch {
      // Player not ready
    }
  }, [volume, isMuted]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: -9999,
        left: -9999,
        width: 1,
        height: 1,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div id="yt-hidden-player" />
    </div>
  );
}
