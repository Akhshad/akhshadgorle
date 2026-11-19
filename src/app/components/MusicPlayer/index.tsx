"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./style.module.css";

type Track = {
  uri: string;
  title: string;
  artist: string;
  art: string;
};

// The song the player shows before a visitor picks their own.
// Hans Zimmer – "Resurrection" from Dune: Part Two.
const DEFAULT_TRACK: Track = {
  uri: "spotify:track:6cryu85hnENcwiSe5ZlWrl",
  title: "Resurrection",
  artist: "Hans Zimmer",
  art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02c48092f7547362b01e0cc5b2",
};

/* ---------- Spotify iFrame API (https://developer.spotify.com/documentation/embeds) ---------- */

type PlaybackData = {
  isPaused: boolean;
  isBuffering?: boolean;
  position: number; // ms
  duration: number; // ms
};
type EmbedController = {
  loadUri: (uri: string) => void;
  play: () => void;
  pause: () => void;
  resume: () => void;
  seek: (seconds: number) => void;
  togglePlay: () => void;
  addListener: (event: "ready" | "playback_update", cb: (e: { data: PlaybackData }) => void) => void;
  destroy: () => void;
};

/* ---------- scratch sound ----------
   Spotify's audio lives in a cross-origin iframe, so it can't be pitch-bent or
   played backwards. Instead we synthesise a vinyl-scratch noise whose volume
   and pitch follow how fast (and which way) the record is being turned. */

function createScratchSound() {
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  const ctx = new Ctx();

  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 2.5;
  filter.frequency.value = 800;

  const gain = ctx.createGain();
  gain.gain.value = 0;

  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start();

  return {
    ctx,
    /** degreesPerSecond: signed angular speed of the record */
    update(degreesPerSecond: number) {
      const speed = Math.min(Math.abs(degreesPerSecond) / 900, 1);
      const now = ctx.currentTime;
      gain.gain.setTargetAtTime(speed * 0.22, now, 0.02);
      // forward spins sound a bit higher than backward ones
      const base = degreesPerSecond >= 0 ? 900 : 600;
      filter.frequency.setTargetAtTime(base + speed * 2600, now, 0.03);
    },
    silence() {
      gain.gain.setTargetAtTime(0, ctx.currentTime, 0.04);
    },
  };
}
type IFrameAPI = {
  createController: (
    el: HTMLElement,
    options: { uri: string; width?: string | number; height?: string | number },
    cb: (controller: EmbedController) => void
  ) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: IFrameAPI) => void;
    __spotifyIframeApi?: Promise<IFrameAPI>;
  }
}

function loadSpotifyIframeApi(): Promise<IFrameAPI> {
  if (window.__spotifyIframeApi) return window.__spotifyIframeApi;
  window.__spotifyIframeApi = new Promise((resolve) => {
    window.onSpotifyIframeApiReady = (api) => resolve(api);
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    document.body.appendChild(script);
  });
  return window.__spotifyIframeApi;
}

/* ---------- component ---------- */

export default function MusicPlayer() {
  const [track, setTrack] = useState<Track>(DEFAULT_TRACK);
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "not_configured">("idle");

  const embedHostRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const controllerRef = useRef<Promise<EmbedController> | null>(null);

  // Latest playback position from Spotify, in ms.
  const playbackRef = useRef({ position: 0, duration: 0, isPaused: true });

  // Drag-to-scratch state.
  const SECONDS_PER_TURN = 5; // one full turn of the record = 5 seconds of the song
  const recordRef = useRef<HTMLButtonElement>(null);
  const [rotation, setRotation] = useState(0); // manual rotation from scratching, in degrees
  const [scratching, setScratching] = useState(false);
  const scratchSoundRef = useRef<ReturnType<typeof createScratchSound>>(null);
  const dragRef = useRef<{
    pointerId: number;
    lastAngle: number;
    lastTime: number;
    totalDegrees: number;
    startPosition: number; // ms
    wasPlaying: boolean;
    moved: boolean;
    lastSeekAt: number;
    silenceTimer?: number;
  } | null>(null);

  // Spotify's embed is only loaded the first time someone interacts with the
  // player, so it costs nothing on page load.
  const getController = useCallback((): Promise<EmbedController> => {
    if (controllerRef.current) return controllerRef.current;
    controllerRef.current = loadSpotifyIframeApi().then(
      (api) =>
        new Promise<EmbedController>((resolve) => {
          const host = embedHostRef.current!;
          // The API replaces this node with its iframe, so give it a node React doesn't manage.
          const mount = document.createElement("div");
          host.appendChild(mount);
          api.createController(
            mount,
            { uri: DEFAULT_TRACK.uri, width: "100%", height: 80 },
            (controller) => {
              // Spotify's "ready" event can fire before we start listening for it,
              // so also treat the first playback update (or a short timeout) as ready.
              let resolved = false;
              const markReady = () => {
                if (resolved) return;
                resolved = true;
                resolve(controller);
              };
              controller.addListener("ready", markReady);
              window.setTimeout(markReady, 2500);

              controller.addListener("playback_update", (e) => {
                markReady();
                playbackRef.current = {
                  position: e.data.position,
                  duration: e.data.duration,
                  isPaused: e.data.isPaused,
                };
                // While scratching we pause Spotify ourselves; keep the deck looking "live".
                if (!dragRef.current) setPlaying(!e.data.isPaused);
              });
            }
          );
        })
    );
    return controllerRef.current;
  }, []);

  /* Some browsers (Brave, Safari) refuse to let Spotify's player start when the
     play command comes from our page rather than a click inside Spotify's own
     player. If music hasn't started a few seconds after we asked, open the
     panel and point the visitor at Spotify's ▶ button, which always works. */
  const [playBlocked, setPlayBlocked] = useState(false);
  const blockedTimerRef = useRef<number | undefined>(undefined);
  const expectPlayback = useCallback(() => {
    window.clearTimeout(blockedTimerRef.current);
    blockedTimerRef.current = window.setTimeout(() => {
      if (playbackRef.current.isPaused) {
        setPlayBlocked(true);
        setOpen(true);
      }
    }, 3000);
  }, []);
  useEffect(() => {
    if (playing) {
      window.clearTimeout(blockedTimerRef.current);
      setPlayBlocked(false);
    }
  }, [playing]);

  const togglePlay = useCallback(async () => {
    const wasPlaying = !playbackRef.current.isPaused;
    if (!wasPlaying) expectPlayback();
    try {
      // Remember a visitor's own choice: pausing turns autoplay off for them,
      // pressing play turns it back on.
      if (wasPlaying) localStorage.setItem("ag-music-user-paused", "1");
      else localStorage.removeItem("ag-music-user-paused");
    } catch {
      /* ignore */
    }
    const controller = await getController();
    controller.togglePlay();
  }, [getController, expectPlayback]);

  /* ----- drag to scratch ----- */

  const angleFromCenter = (clientX: number, clientY: number) => {
    const rect = recordRef.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI;
  };

  const clampMs = (ms: number) => {
    const { duration } = playbackRef.current;
    return Math.max(0, duration > 0 ? Math.min(ms, duration - 250) : ms);
  };

  const onRecordPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    try {
      recordRef.current?.setPointerCapture(e.pointerId);
    } catch {
      /* capture isn't essential */
    }
    dragRef.current = {
      pointerId: e.pointerId,
      lastAngle: angleFromCenter(e.clientX, e.clientY),
      lastTime: performance.now(),
      totalDegrees: 0,
      startPosition: playbackRef.current.position,
      wasPlaying: !playbackRef.current.isPaused,
      moved: false,
      lastSeekAt: 0,
    };
  };

  const onRecordPointerMove = async (e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;

    const angle = angleFromCenter(e.clientX, e.clientY);
    let delta = angle - drag.lastAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    const now = performance.now();
    const dt = Math.max(now - drag.lastTime, 1) / 1000;
    drag.lastAngle = angle;
    drag.lastTime = now;
    drag.totalDegrees += delta;

    // Small wobbles still count as a click (play/pause), not a scratch.
    if (!drag.moved && Math.abs(drag.totalDegrees) < 8) return;

    if (!drag.moved) {
      drag.moved = true;
      setScratching(true);
      if (!scratchSoundRef.current) scratchSoundRef.current = createScratchSound();
      scratchSoundRef.current?.ctx.resume();
      const controller = await getController();
      if (drag.wasPlaying) controller.pause();
    }

    setRotation((r) => r + delta);

    const sound = scratchSoundRef.current;
    if (sound) {
      sound.update(delta / dt);
      window.clearTimeout(drag.silenceTimer);
      drag.silenceTimer = window.setTimeout(() => sound.silence(), 60);
    }

    // Seek along with the drag, throttled so we don't flood Spotify's iframe.
    if (now - drag.lastSeekAt > 180) {
      drag.lastSeekAt = now;
      const target = clampMs(drag.startPosition + (drag.totalDegrees / 360) * SECONDS_PER_TURN * 1000);
      const controller = await getController();
      controller.seek(target / 1000);
    }
  };

  const endScratch = async (e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    dragRef.current = null;
    window.clearTimeout(drag.silenceTimer);
    scratchSoundRef.current?.silence();

    if (!drag.moved) {
      togglePlay(); // it was a click
      return;
    }

    setScratching(false);
    const target = clampMs(drag.startPosition + (drag.totalDegrees / 360) * SECONDS_PER_TURN * 1000);
    playbackRef.current.position = target;
    const controller = await getController();
    controller.seek(target / 1000);
    if (drag.wasPlaying) controller.resume();
  };

  const onRecordKeyDown = async (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    e.stopPropagation();
    const direction = e.key === "ArrowRight" ? 1 : -1;
    setRotation((r) => r + direction * 360); // 5 s = one turn
    const target = clampMs(playbackRef.current.position + direction * SECONDS_PER_TURN * 1000);
    playbackRef.current.position = target;
    const controller = await getController();
    controller.seek(target / 1000);
  };

  useEffect(() => () => void scratchSoundRef.current?.ctx.close(), []);

  /* ----- autoplay -----
     Browsers block sound until the visitor has interacted with the page, so we
     try to start straight away and, if that's blocked, keep trying on every
     click / tap / key press anywhere until the music actually starts.
     - Happens once per browsing session (sessionStorage).
     - Only marked done once playback has really started, so a failed attempt
       (Spotify still loading, browser blocked it) is retried on the next click.
     - If a visitor pauses the music themselves, we remember that and stop
       autoplaying for them on later visits. */
  const SESSION_KEY = "ag-music-autoplayed";
  const PAUSED_KEY = "ag-music-user-paused";
  const [awaitingClick, setAwaitingClick] = useState(false);
  const stopAutoplayRef = useRef<() => void>(() => {});

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(PAUSED_KEY)) return;
    } catch {
      return; // storage unavailable: don't autoplay
    }

    setAwaitingClick(true);
    let stopped = false;
    const events = ["pointerdown", "keydown", "touchstart"] as const;

    const start = async (fromClick: boolean) => {
      const controller = await getController();
      if (stopped || !playbackRef.current.isPaused) return;
      controller.play();
      // The silent attempt on page load is expected to be blocked; only a
      // blocked click should bring up the "press Spotify's play button" prompt.
      if (fromClick) expectPlayback();
    };

    const onInteraction = (e: Event) => {
      // A click on the player itself is handled by the player (play/pause/scratch).
      if (rootRef.current?.contains(e.target as Node)) return;
      start(true);
    };

    const stop = () => {
      if (stopped) return;
      stopped = true;
      setAwaitingClick(false);
      events.forEach((ev) => window.removeEventListener(ev, onInteraction, true));
    };
    stopAutoplayRef.current = stop;

    events.forEach((ev) =>
      window.addEventListener(ev, onInteraction, { capture: true, passive: true })
    );

    // Try right away too; this works when the browser allows autoplay for the site.
    const attempt = window.setTimeout(() => start(false), 1200);

    return () => {
      window.clearTimeout(attempt);
      stop();
    };
  }, [getController, expectPlayback]);

  // Once the music is really playing, autoplay has done its job for this session.
  useEffect(() => {
    if (!playing) return;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    stopAutoplayRef.current();
  }, [playing]);

  const playTrack = useCallback(
    async (next: Track) => {
      setTrack(next);
      const controller = await getController();
      controller.loadUri(next.uri);
      controller.play();
      expectPlayback();
    },
    [getController, expectPlayback]
  );

  // Debounced search through our own API route (keeps the Spotify secret server-side).
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setStatus((s) => (s === "not_configured" ? s : "idle"));
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setStatus("loading");
      try {
        const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
        });
        if (res.status === 503) {
          setStatus("not_configured");
          setResults([]);
          return;
        }
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as { tracks: Track[] };
        setResults(data.tracks);
        setStatus("idle");
      } catch (err) {
        if ((err as Error).name !== "AbortError") setStatus("error");
      }
    }, 300);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query]);

  // Close the panel on Escape or a click outside the player.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const openPanel = () => {
    setOpen((o) => !o);
    getController(); // warm up the embed so the first play is instant
    setTimeout(() => searchRef.current?.focus(), 50);
  };

  return (
    <div ref={rootRef} className={`${styles.root} ${playing ? styles.playing : ""}`}>
      {/* Search panel. Always mounted so the Spotify iframe keeps playing when it's closed. */}
      <div
        className={`${styles.panel} ${open ? "" : styles.panelClosed}`}
        role="dialog"
        aria-label="Choose a song"
        aria-hidden={!open}
      >
        <div className={styles.panelHeader}>
          <span>Play anything on Spotify</span>
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => setOpen(false)}
            aria-label="Close"
            tabIndex={open ? 0 : -1}
          >
            ×
          </button>
        </div>

        <input
          ref={searchRef}
          className={styles.search}
          type="search"
          placeholder="Search songs or artists"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          tabIndex={open ? 0 : -1}
          aria-label="Search Spotify"
        />

        {status === "not_configured" && (
          <p className={styles.hint}>
            Search isn&apos;t set up yet. Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to the
            site&apos;s environment variables.
          </p>
        )}
        {status === "error" && <p className={styles.hint}>Couldn&apos;t reach Spotify. Try again.</p>}
        {status === "loading" && results.length === 0 && <p className={styles.hint}>Searching…</p>}

        {results.length > 0 && (
          <ul className={styles.results}>
            {results.map((r) => (
              <li key={r.uri}>
                <button
                  type="button"
                  className={styles.result}
                  onClick={() => playTrack(r)}
                  tabIndex={open ? 0 : -1}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={styles.resultArt} src={r.art} alt="" loading="lazy" />
                  <span className={styles.resultText}>
                    <span className={styles.resultTitle} style={{ display: "block" }}>
                      {r.title}
                    </span>
                    <span className={styles.resultArtist} style={{ display: "block" }}>
                      {r.artist}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {playBlocked && (
          <p className={styles.blockedNotice} role="status">
            Your browser blocked autoplay. Press <strong>▶</strong> in the Spotify player below to
            start the music.
          </p>
        )}
        <div
          ref={embedHostRef}
          className={`${styles.embed} ${playBlocked ? styles.embedHighlight : ""}`}
        />
        <p className={styles.hint}>
          Tip: drag the record to scratch backwards or forwards. Log in to Spotify in this browser
          to hear full songs; otherwise you&apos;ll get 30-second previews.
        </p>
      </div>

      {/* Mini player card */}
      <div
        className={styles.card}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-label={`Now playing ${track.title} by ${track.artist}. Open music player`}
        onClick={openPanel}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPanel();
          }
        }}
      >
        <div className={styles.meta}>
          <span className={`${styles.label} ${awaitingClick && !playing ? styles.labelHint : ""}`}>
            {playing ? "Now Playing" : awaitingClick ? "Click anywhere to play" : "Paused"}
          </span>
          <span>
            <span className={styles.artist} style={{ display: "block" }}>
              {track.artist}
            </span>
            <span className={styles.title} style={{ display: "block" }}>
              {track.title}
            </span>
          </span>
        </div>

        <div className={styles.deck}>
          <button
            ref={recordRef}
            type="button"
            className={`${styles.recordButton} ${scratching ? styles.scratching : ""}`}
            // Clicks are handled in endScratch so a drag doesn't also toggle playback.
            onClick={(e) => e.stopPropagation()}
            onPointerDown={onRecordPointerDown}
            onPointerMove={onRecordPointerMove}
            onPointerUp={endScratch}
            onPointerCancel={endScratch}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                togglePlay();
              } else {
                onRecordKeyDown(e);
              }
            }}
            aria-label={`${playing ? "Pause" : "Play"}. Drag the record, or use the arrow keys, to scratch backwards or forwards`}
            aria-pressed={playing}
            title="Click to play or pause. Drag to scratch."
          >
            <div className={styles.scratchRotator} style={{ transform: `rotate(${rotation}deg)` }}>
              <div className={styles.record}>
                <div className={styles.labelArt}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {track.art && <img src={track.art} alt="" draggable={false} />}
                </div>
              </div>
            </div>
          </button>

          {/* tonearm: swings onto the record while playing */}
          <svg className={styles.tonearm} viewBox="0 0 26 64" aria-hidden="true">
            <circle cx="17" cy="9" r="8" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <circle cx="17" cy="9" r="4.5" fill="#2a2a2a" stroke="#555" strokeWidth="1" />
            <path d="M17 9 L17 44 L11 54" stroke="#c9c9c9" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="6.5" y="52" width="8" height="10" rx="1.5" transform="rotate(-30 10.5 57)" fill="#1d1d1d" stroke="#555" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
    </div>
  );
}
