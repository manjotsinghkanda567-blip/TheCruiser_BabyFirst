
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

const nightlightOptions = [
  { id: "moon", label: "Moon milk", color: "#f4d98b", glow: "rgba(244, 217, 139, 0.58)" },
  { id: "berry", label: "Berry blush", color: "#f0a2c4", glow: "rgba(240, 162, 196, 0.58)" },
  { id: "lavender", label: "Dream lilac", color: "#c5a8f2", glow: "rgba(197, 168, 242, 0.58)" },
  { id: "mint", label: "Sleepy mint", color: "#a7d9bd", glow: "rgba(167, 217, 189, 0.58)" },
];

const projects = [
  {
    number: "01",
    icon: "♫",
    name: "Lullaby Lab",
    category: "SOUND DESIGN",
    description:
      "Tiny melodies, sleepy rhythms, and gentle soundscapes designed to help little dreamers drift off.",
    tags: ["Audio", "Sleep", "Magic"],
    color: "lullaby",
  },
  {
    number: "02",
    icon: "☾",
    name: "Nightlight Collection",
    category: "LIGHT ENGINEERING",
    description:
      "Pocket-sized moons and glowing companions that make the dark feel a little less mysterious.",
    tags: ["Lighting", "Comfort", "Glow"],
    color: "nightlight",
  },
  {
    number: "03",
    icon: "✈",
    name: "Dream Delivery Routes",
    category: "DREAM LOGISTICS",
    description:
      "A whimsical delivery network that sends the right dream to the right sleepyhead, right on time.",
    tags: ["Adventure", "Dreams", "Routes"],
    color: "delivery",
  },
];

function App() {
  const [dreamMode, setDreamMode] = useState(() => {
    try { return window.localStorage.getItem("pip-dream-mode") === "true"; }
    catch { return false; }
  });
  const [visitorName, setVisitorName] = useState(() => {
    try { return window.localStorage.getItem("pip-visitor-name") || ""; }
    catch { return ""; }
  });
  const [nameDraft, setNameDraft] = useState(() => {
    try { return window.localStorage.getItem("pip-visitor-name") || ""; }
    catch { return ""; }
  });
  const [lastVisit] = useState(() => {
    try {
      const previousVisit = window.localStorage.getItem("pip-last-visit");
      if (!previousVisit) return "";
      const date = new Date(previousVisit);
      return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch { return ""; }
  });
  const [secretOpen, setSecretOpen] = useState(false);
  const [chaosMode, setChaosMode] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameSeconds, setGameSeconds] = useState(20);
  const [gameWon, setGameWon] = useState(false);
  const [pipAwake, setPipAwake] = useState(false);
  const [storybookPage, setStorybookPage] = useState(0);
  const [blockStack, setBlockStack] = useState([]);
  const [lullabyPlaying, setLullabyPlaying] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [activeNote, setActiveNote] = useState(null);
  const [nightlightOn, setNightlightOn] = useState(true);
  const [selectedNightlight, setSelectedNightlight] = useState(() => {
    try {
      const savedId = window.localStorage.getItem("pip-nightlight-color");
      return nightlightOptions.find((option) => option.id === savedId) || nightlightOptions[0];
    } catch { return nightlightOptions[0]; }
  });
  const audioContextRef = useRef(null);
  const melodyTimerRef = useRef(null);
  const melodyIndexRef = useRef(0);
  const mutedRef = useRef(false);
  const appRef = useRef(null);

  const lullabyNotes = [
    { label: "C", frequency: 523.25 },
    { label: "D", frequency: 587.33 },
    { label: "E", frequency: 659.25 },
    { label: "G", frequency: 783.99 },
    { label: "A", frequency: 880 },
  ];
  const melody = [523.25, 659.25, 783.99, 659.25, 587.33, 659.25, 523.25, 392];

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      audioContextRef.current = new AudioContextClass();
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  const playTone = (frequency, duration = 0.72) => {
    if (mutedRef.current) return;
    const audioContext = getAudioContext();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.03);
  };

  const stopLullaby = () => {
    window.clearTimeout(melodyTimerRef.current);
    melodyTimerRef.current = null;
    setLullabyPlaying(false);
    setActiveNote(null);
  };

  const playNextMelodyNote = () => {
    const noteIndex = melodyIndexRef.current % melody.length;
    setActiveNote(["C", "E", "G", "E", "D", "E", "C", "G"][noteIndex]);
    playTone(melody[noteIndex], 0.68);
    melodyIndexRef.current += 1;
    melodyTimerRef.current = window.setTimeout(playNextMelodyNote, 560);
  };

  const toggleLullaby = () => {
    if (lullabyPlaying) {
      stopLullaby();
      return;
    }
    if (!getAudioContext()) return;
    melodyIndexRef.current = 0;
    setLullabyPlaying(true);
    playNextMelodyNote();
  };


  const toggleMute = () => {
    const nextMuted = !mutedRef.current;
    mutedRef.current = nextMuted;
    setSoundMuted(nextMuted);
    if (nextMuted) setActiveNote(null);
  };

  useEffect(() => {
    const app = appRef.current;
    if (!app) return undefined;
    const playClickSound = () => {
      if (mutedRef.current) return;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioContextRef.current) audioContextRef.current = new AudioContextClass();
      const audioContext = audioContextRef.current;
      if (audioContext.state === "suspended") audioContext.resume();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const now = audioContext.currentTime;
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(880, now);
      oscillator.frequency.exponentialRampToValueAtTime(1174.66, now + 0.045);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.025, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.1);
    };
    const handleClick = (event) => {
      if (!event.target.closest("button, a")) return;
      playClickSound();
    };
    const character = app.querySelector(".hero-character");
    const resetCharacterLook = () => {
      if (!character) return;
      character.style.setProperty("--look-x", "0px");
      character.style.setProperty("--look-y", "0px");
      character.style.setProperty("--look-rotate", "0deg");
    };
    const handlePointerMove = (event) => {
      if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (character && event.target.closest(".hero-character")) {
        const rect = character.getBoundingClientRect();
        const lookX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
        const lookY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
        character.style.setProperty("--look-x", `${lookX * 4}px`);
        character.style.setProperty("--look-y", `${lookY * 3}px`);
        character.style.setProperty("--look-rotate", `${lookX * 0.8}deg`);
      }
      const sparkle = document.createElement("span");
      sparkle.className = "cursor-sparkle";
      sparkle.textContent = Math.random() > 0.5 ? "✦" : "·";
      sparkle.style.left = `${event.clientX}px`;
      sparkle.style.top = `${event.clientY}px`;
      app.appendChild(sparkle);
      window.setTimeout(() => sparkle.remove(), 650);
    };
    app.addEventListener("click", handleClick);
    app.addEventListener("pointermove", handlePointerMove, { passive: true });
    if (character) character.addEventListener("pointerleave", resetCharacterLook);
    return () => {
      app.removeEventListener("click", handleClick);
      app.removeEventListener("pointermove", handlePointerMove);
      if (character) character.removeEventListener("pointerleave", resetCharacterLook);
    };
  }, []);

  useEffect(() => {
    if (!gameActive || gameSeconds <= 0) return undefined;
    const timer = window.setTimeout(() => {
      if (gameSeconds <= 1) {
        setGameSeconds(0);
        setGameActive(false);
      } else {
        setGameSeconds(gameSeconds - 1);
      }
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [gameActive, gameSeconds]);

  const startStarGame = () => {
    setGameScore(0);
    setGameSeconds(20);
    setGameWon(false);
    setGameActive(true);
  };

  const catchStar = () => {
    if (!gameActive) return;
    const nextScore = gameScore + 1;
    setGameScore(nextScore);
    if (nextScore >= 5) {
      setGameActive(false);
      setGameWon(true);
    }
  };

  useEffect(() => {
    try {
      window.localStorage.setItem("pip-last-visit", new Date().toISOString());
    } catch {
      // The site remains usable when browser storage is unavailable.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("pip-dream-mode", String(dreamMode));
      window.localStorage.setItem("pip-nightlight-color", selectedNightlight.id);
    } catch {
      // Preferences are optional; controls still work for this visit.
    }
  }, [dreamMode, selectedNightlight]);

  const saveVisitorMemory = (event) => {
    event.preventDefault();
    const cleanedName = nameDraft.trim().slice(0, 24);
    setVisitorName(cleanedName);
    try {
      if (cleanedName) window.localStorage.setItem("pip-visitor-name", cleanedName);
      else window.localStorage.removeItem("pip-visitor-name");
    } catch {
      // Keep the greeting for the current session if storage is blocked.
    }
  };

  const clearVisitorMemory = () => {
    setVisitorName("");
    setNameDraft("");
    try { window.localStorage.removeItem("pip-visitor-name"); }
    catch { /* Storage may be disabled by the browser. */ }
  };

  useEffect(() => () => {
    window.clearTimeout(melodyTimerRef.current);
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
    }
  }, []);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      gsap.from(".top-bar, .site-nav", {
        y: -18,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: "back.out(1.5)",
      });

      gsap.from(".hero-copy > *", {
        y: 24,
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        delay: 0.1,
        ease: "power2.out",
      });

      gsap.from(".pip-art", {
        y: 34,
        rotate: 3,
        scale: 0.94,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "back.out(1.35)",
      });

      gsap.utils.toArray(".section-heading, .profile-panel, .story-heading, .story-chapter, .work-heading, .work-footnote").forEach((element) => {
        gsap.from(element, {
          y: 28,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 86%", once: true },
        });
      });

      gsap.from(".project-card", {
        y: 32,
        rotate: (index) => index % 2 === 0 ? -2 : 2,
        opacity: 0,
        duration: 0.75,
        stagger: 0.15,
        ease: "back.out(1.3)",
        scrollTrigger: { trigger: ".project-grid", start: "top 82%", once: true },
      });

      const routePath = document.querySelector(".dream-route-path");
      if (routePath) {
        const parcel = document.querySelector(".route-parcel");
        const routeLength = routePath.getTotalLength();
        const moveParcel = (progress) => {
          if (!parcel || !routeLength) return;
          const point = routePath.getPointAtLength(Math.max(0, Math.min(1, progress)) * routeLength);
          parcel.setAttribute("transform", `translate(${point.x} ${point.y})`);
        };
        gsap.fromTo(routePath, { strokeDashoffset: 1 }, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".dream-route-section", start: "top 78%", end: "bottom 55%", scrub: 0.8,
            onUpdate: (self) => moveParcel(self.progress),
            onRefresh: (self) => moveParcel(self.progress),
          },
        });
        moveParcel(0);
      }
      gsap.from(".route-stop", {
        scale: 0.65,
        opacity: 0,
        transformOrigin: "center",
        stagger: 0.18,
        duration: 0.45,
        scrollTrigger: { trigger: ".dream-route-section", start: "top 75%", once: true },
      });

      gsap.to(".hero-sparkle", {
        y: (index) => index % 2 === 0 ? -12 : 10,
        rotate: (index) => index % 2 === 0 ? 14 : -12,
        duration: 2.1,
        stagger: 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".scroll-hint span:last-child", {
        y: 7,
        duration: 0.65,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => context.revert();
  }, []);

  return (
    <main ref={appRef} className={`app ${dreamMode ? "dream-mode" : ""} ${chaosMode ? "chaos-mode" : ""}`}>
      <div className="noise" aria-hidden="true" />

      <header className="top-bar">
        <a className="brand" href="#home" aria-label="PIP.OS home">
          <span className="brand-dot" />
          <span>PIP.OS</span>
        </a>

        <div className="system-status">
          <span>● ONLINE</span>
          <span>DREAM SHIFT 11:00 PM — 06:00 AM</span>
        </div>

        <div className="top-actions">
          <button className="sound-toggle" type="button" aria-pressed={!soundMuted} onClick={toggleMute}>
            {soundMuted ? "♫ SOUND OFF" : "♫ SOUND ON"}
          </button>
          <button
            className="dream-toggle"
            type="button"
            aria-pressed={dreamMode}
            onClick={() => setDreamMode((current) => !current)}
          >
            {dreamMode ? "☀ DAY MODE" : "☾ DREAM MODE"}
          </button>
        </div>
      </header>

      <nav className="site-nav" aria-label="Main navigation">
        <a href="#about">ABOUT PIP</a>
        <a href="#story">PIP'S STORY</a>
        <a href="#work">DREAM WORKSHOP</a>
        <a href="#pocket-toy">PLAY A TINY GAME</a>
        <button className="chaos-toggle" type="button" aria-pressed={chaosMode} onClick={() => setChaosMode((mode) => !mode)}>
          {chaosMode ? "✿ CALM IT DOWN" : "✿ CHAOS MODE"}
        </button>
        <span className="nav-note">
          {chaosMode ? "STICKERS EVERYWHERE!!" : dreamMode ? "DREAMS ACTIVATED ✦" : "EST. AFTER BEDTIME"}
        </span>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow">
            MIDNIGHT NURSERY · DREAM ENGINEERING DEPT.
          </p>

          <h1>
            Good evening,
            <br />
            little dreamer.
          </h1>

          <p className="hero-description">
            I'm Pip, the Skull Baby — a Junior Dream Engineer who builds
            lullabies, nightlights, and tiny worlds for
            sleepy creatures.
          </p>

          <button className="enter-button wake-button" type="button" onClick={() => { setPipAwake(true); document.getElementById("story")?.scrollIntoView({ behavior: "smooth" }); }}>
            {pipAwake ? "Pip is awake! Explore →" : "Wake Pip up ✦"}
            <span aria-hidden="true">→</span>
          </button>

          <p className="hero-footnote">
            <span className="status-pulse" />
            ALL DREAM SYSTEMS FEELING COZY
          </p>
        </div>

        <div className={`hero-character ${pipAwake ? "pip-awake" : "pip-snoozing"}`}>
          <div className="pip-glow" />
          <span className="handwritten-note note-left" aria-hidden="true">dream<br />big ♡</span>
          <span className="handwritten-note note-right" aria-hidden="true">★ tiny<br />ideas ★</span>

          <div className="pip-art">
            <img
              src="/assets/pip.jpg"
              alt="Pip, the Junior Dream Engineer"
            />

          </div>

          <div className="hero-sparkle sparkle-one">✦</div>
          <div className="hero-sparkle sparkle-two">✧</div>
          <div className="hero-sparkle sparkle-three">✦</div>
          <button
            className="secret-star-button"
            type="button"
            aria-label="Discover Pip's hidden secret"
            aria-expanded={secretOpen}
            onClick={() => setSecretOpen((open) => !open)}
          >✧</button>
          {secretOpen && (
            <div className="secret-note" role="status" aria-live="polite">
              pssst… Pip says you're made of stardust. Keep that bit. ♡
            </div>
          )}

          <div className="character-caption">
            <span className="caption-dot" />
            PIP IS DREAMING UP SOMETHING
          </div>
        </div>

        <div className="scroll-hint">
          <span>SCROLL TO EXPLORE</span>
          <span>↓</span>
        </div>
      </section>

      {/* ABOUT PIP */}
      <section className="about-section section-wrap" id="about">
        <div className="section-heading">
          <p className="eyebrow">FILE 001 · CHARACTER DATABASE</p>
          <h2>
            So, who's
            <br />
            <span>Pip?</span>
          </h2>
          <p className="section-intro">
            A tiny engineer with a very big imagination.
            Part inventor, part night owl, and full-time
            believer in the magic of a good dream.
          </p>
        </div>

        <div className="profile-panel">
          <div className="profile-topline">
            <span>CHARACTER.SYS</span>
            <span>STATUS: FRIENDLY</span>
          </div>

          <div className="profile-main">
            <div className="profile-avatar">
              <img
                src="/assets/pip.jpg"
                alt="Pip in the character profile"
                loading="lazy"
              />
            </div>

            <div className="profile-info">
              <p className="profile-label">MEET YOUR ENGINEER</p>
              <h3>Pip <span>✦</span></h3>
              <p className="profile-role">
                Junior Dream Engineer
              </p>

              <p className="profile-description">
                Pip works the quiet shift, fixing tangled
                dreams, collecting stray stars, and making
                sure nobody has to fall asleep feeling alone.
              </p>

              <div className="profile-stats">
                <div>
                  <span>SPECIES</span>
                  <strong>Skull Baby</strong>
                </div>
                <div>
                  <span>PERSONALITY</span>
                  <strong>Curious + Kind</strong>
                </div>
                <div>
                  <span>FAVOURITE HOUR</span>
                  <strong>12:07 AM</strong>
                </div>
                <div>
                  <span>SPECIAL SKILL</span>
                  <strong>Finding Lost Dreams</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-footer">
            <span>VISITOR MEMORY: LOCAL ONLY</span>
            <span>♥ FRIENDSHIP LEVEL: GROWING</span>
          </div>
        </div>
      </section>

      {/* ORIGIN STORY: three short scenes told as visitors scroll */}
      <section className="origin-story-section section-wrap" id="story" aria-labelledby="story-title">
        <div className="story-heading">
          <p className="eyebrow">FILE 001-A · A VERY TINY ORIGIN STORY</p>
          <h2 id="story-title">Every dream starts <span>somewhere.</span></h2>
          <p>Three little moments from Pip's first night on the job.</p>
        </div>
        <div className="story-chapters">
          <article className="story-chapter story-chapter-one">
            <span className="story-chapter-number">PAGE 01</span>
            <span className="story-chapter-icon" aria-hidden="true">☾</span>
            <h3>The lost little dream</h3>
            <p>One quiet night, Pip found a tiny dream hiding under a cloud. It was too shy to shine and too tangled to fly home.</p>
            <span className="story-scribble" aria-hidden="true">oh, hello ♡</span>
          </article>
          <article className="story-chapter story-chapter-two">
            <span className="story-chapter-number">PAGE 02</span>
            <span className="story-chapter-icon" aria-hidden="true">♫</span>
            <h3>A tune in a teacup</h3>
            <p>Pip hummed three soft notes into a little music box. The dream untangled, glowed like a firefly, and finally stopped worrying.</p>
            <span className="story-scribble" aria-hidden="true">la la lullaby</span>
          </article>
          <article className="story-chapter story-chapter-three">
            <span className="story-chapter-number">PAGE 03</span>
            <span className="story-chapter-icon" aria-hidden="true">✉</span>
            <h3>The first delivery</h3>
            <p>Pip packed the dream beside a warm nightlight and followed the stars to a sleepy pillow. By sunrise, a new Dream Engineer had found their calling.</p>
            <span className="story-scribble" aria-hidden="true">delivered! ★</span>
          </article>
        </div>
      </section>

      {/* TIER 3: VISITOR MEMORY */}
      <section className="memory-section section-wrap" aria-labelledby="memory-title">
        <div className="memory-card">
          <div className="memory-sticker" aria-hidden="true">♡</div>
          <div className="memory-copy">
            <p className="eyebrow">FILE 001-B · TINY VISITOR MEMORY</p>
            <h2 id="memory-title">Pip remembers <span>you.</span></h2>
            <p>
              Leave a name for your next visit. Pip keeps it in this browser, along with your nightlight colour and day/night preference.
              No account, no server, and no data sent anywhere.
            </p>
            {visitorName ? (
              <div className="memory-saved" role="status">
                <span className="memory-heart" aria-hidden="true">♥</span>
                <span>Welcome back, <strong>{visitorName}</strong>! {lastVisit ? `Your last visit was ${lastVisit}.` : "Pip saved you a tiny seat."}</span>
              </div>
            ) : (
              <p className="memory-prompt">What should Pip call you next time?</p>
            )}
            <form className="memory-form" onSubmit={saveVisitorMemory}>
              <label className="sr-only" htmlFor="visitor-name">Your nickname</label>
              <input
                id="visitor-name"
                name="visitor-name"
                value={nameDraft}
                onChange={(event) => setNameDraft(event.target.value)}
                maxLength={24}
                placeholder="a nickname (optional)"
                autoComplete="nickname"
              />
              <button type="submit">Save a tiny memory ✦</button>
            </form>
            {visitorName && <button className="memory-clear" type="button" onClick={clearVisitorMemory}>Clear my saved name</button>}
          </div>
          <div className="memory-jar" aria-hidden="true">
            <span className="jar-lid" />
            <span className="jar-star star-one">✦</span>
            <span className="jar-star star-two">✧</span>
            <span className="jar-star star-three">♡</span>
            <span className="jar-label">little<br />memories</span>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="work-section section-wrap" id="work">
        <div className="work-heading">
          <div>
            <p className="eyebrow">
              FILE 002 · SELECTED EXPERIMENTS
            </p>
            <h2>
              The Dream
              <br />
              <span>Workshop.</span>
            </h2>
          </div>

          <p className="work-intro">
            Six tiny inventions. Countless sleepy possibilities. Built with care after bedtime.
          </p>
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <article
              className={`project-card ${project.color}`}
              key={project.number}
            >
              <div className="project-card-top">
                <span className="project-number">
                  EXP. {project.number}
                </span>
                <span className="project-symbol" aria-hidden="true">
                  {project.icon}
                </span>
              </div>

              <div className="project-art" aria-hidden="true">
                <div className="project-orbit orbit-one" />
                <div className="project-orbit orbit-two" />
                <span className="project-art-symbol">
                  {project.icon}
                </span>
                <span className="project-art-star star-a">✦</span>
                <span className="project-art-star star-b">✧</span>
                <span className="project-art-star star-c">·</span>
              </div>

              <div className="project-content">
                <p className="project-category">
                  {project.category}
                </p>

                <h3>{project.name}</h3>

                <p className="project-description">
                  {project.description}
                </p>

                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                {project.color === "lullaby" && (
                  <div className="lullaby-player" aria-label="Interactive Lullaby Lab music box">
                    <div className="lullaby-player-heading">
                      <span className="music-box-icon" aria-hidden="true">♫</span>
                      <div>
                        <p className="lullaby-kicker">PIP'S LITTLE MUSIC BOX</p>
                        <p className="lullaby-hint">Tap a note or let the box play.</p>
                      </div>
                      <span className={`sound-orb ${lullabyPlaying && !soundMuted ? "is-playing" : ""}`} aria-hidden="true">✦</span>
                    </div>

                    <div className="lullaby-note-row" aria-label="Play individual notes">
                      {lullabyNotes.map((note) => (
                        <button
                          className="lullaby-note"
                          key={note.label}
                          type="button"
                          aria-label={`Play ${note.label} note`}
                          onClick={() => {
                            setActiveNote(note.label);
                            playTone(note.frequency, 0.58);
                          }}
                        >
                          {note.label}
                        </button>
                      ))}
                    </div>

                    <div className="lullaby-controls">
                      <button className="lullaby-play" type="button" onClick={toggleLullaby} aria-pressed={lullabyPlaying}>
                        <span aria-hidden="true">{lullabyPlaying ? "Ⅱ" : "▶"}</span>
                        {lullabyPlaying ? "Pause lullaby" : "Play lullaby"}
                      </button>
                      <button className="lullaby-mute" type="button" onClick={toggleMute} aria-pressed={soundMuted}>
                        {soundMuted ? "Sound off" : "Sound on"}
                      </button>
                    </div>
                    <p className="lullaby-status" aria-live="polite">
                      {soundMuted ? "shhh… sound is muted" : lullabyPlaying ? "a tiny dream is playing ✨" : activeNote ? `you played ${activeNote} ♡` : "made of tiny browser sounds ♡"}
                    </p>
                  </div>
                )}

                {project.color === "nightlight" && (
                  <div className={`nightlight-player ${nightlightOn ? "is-lit" : "is-off"}`} aria-label="Interactive Nightlight Collection">
                    <div className="nightlight-player-heading">
                      <div className="nightlight-preview" style={{ "--lamp-color": selectedNightlight.color, "--lamp-glow": selectedNightlight.glow }} aria-hidden="true">
                        <span className="lamp-moon">☾</span>
                      </div>
                      <div className="nightlight-copy">
                        <p className="nightlight-kicker">PIP'S POCKET NIGHTLIGHT</p>
                        <p className="nightlight-current">{nightlightOn ? selectedNightlight.label : "Taking a tiny nap"}</p>
                      </div>
                      <button
                        className="nightlight-power"
                        type="button"
                        aria-label={nightlightOn ? "Turn nightlight off" : "Turn nightlight on"}
                        aria-pressed={nightlightOn}
                        onClick={() => setNightlightOn((on) => !on)}
                      >
                        <span aria-hidden="true">{nightlightOn ? "☼" : "◌"}</span>
                        {nightlightOn ? "ON" : "OFF"}
                      </button>
                    </div>
                    <p className="nightlight-hint">Pick a glow for your little corner.</p>
                    <div className="nightlight-swatches" role="group" aria-label="Choose nightlight colour">
                      {nightlightOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          className={`nightlight-swatch ${selectedNightlight.id === option.id ? "is-selected" : ""}`}
                          style={{ "--swatch-color": option.color }}
                          aria-label={option.label}
                          aria-pressed={selectedNightlight.id === option.id}
                          onClick={() => {
                            setSelectedNightlight(option);
                            setNightlightOn(true);
                          }}
                        >
                          <span aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                    <p className="nightlight-status" aria-live="polite">
                      {nightlightOn ? `glowing softly in ${selectedNightlight.label.toLowerCase()} ♡` : "lights out… sweet dreams ♡"}
                    </p>
                  </div>
                )}

                <div className="project-bottom">
                  <span>MADE AFTER BEDTIME</span>
                  <span className="project-status">
                    ● READY TO EXPLORE
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="dream-route-section" aria-labelledby="route-title">
          <div className="route-heading">
            <p className="eyebrow">FILE 003 · DELIVERY MAP</p>
            <h3 id="route-title">One tiny dream, <span>on its way.</span></h3>
            <p>Scroll a little and follow Pip's hand-drawn route from the Moon Depot to a sleepy pillow.</p>
          </div>
          <div className="route-map">
            <svg className="route-svg" viewBox="0 0 900 210" role="img" aria-labelledby="route-svg-title route-svg-desc">
              <title id="route-svg-title">Pip's dream delivery route</title>
              <desc id="route-svg-desc">A dotted, curved path connects the Moon Depot, Star Post Office, and a sleepy pillow.</desc>
              <path className="dream-route-track" d="M 82 142 C 180 26, 285 32, 365 112 S 530 202, 612 93 S 755 35, 820 120" />
              <path className="dream-route-path" pathLength="1" d="M 82 142 C 180 26, 285 32, 365 112 S 530 202, 612 93 S 755 35, 820 120" />
              <g className="route-stop stop-moon" transform="translate(82 142)"><circle r="25"/><text y="8" textAnchor="middle">☾</text></g>
              <g className="route-stop stop-star" transform="translate(365 112)"><circle r="25"/><text y="8" textAnchor="middle">✦</text></g>
              <g className="route-stop stop-pillow" transform="translate(820 120)"><circle r="25"/><text y="8" textAnchor="middle">♡</text></g>
              <g className="route-parcel" transform="translate(500 142)"><rect x="-12" y="-10" width="24" height="20" rx="4"/><path d="M0 -10 V10 M-12 -2 H12"/></g>
            </svg>
            <div className="route-labels"><span>MOON DEPOT</span><span>STAR POST</span><span>SLEEPY PILLOW</span></div>
          </div>
        </section>

        <section className="pocket-toy-section" id="pocket-toy" aria-labelledby="pocket-toy-title">
          <div className="toy-copy">
            <p className="eyebrow">BONUS FILE 004 · POCKET-SIZED PLAYTIME</p>
            <h3 id="pocket-toy-title">Catch five stars.<br /><span>Make a wish.</span></h3>
            <p>Pip dropped the dream stars everywhere. Catch five before the bedtime timer runs out and earn the very official Star Collector badge.</p>
            <div className="toy-scoreboard" aria-live="polite">
              <span>STARS <strong>{gameScore}/5</strong></span>
              <span>TIME <strong>{gameSeconds}s</strong></span>
            </div>
            <button className="toy-start-button" type="button" onClick={startStarGame}>{gameWon ? "Play again, star collector ↻" : gameActive ? "Restart the tiny game ↻" : "Start star-catching ✦"}</button>
            <p className="toy-message" role="status">{gameWon ? "YOU DID IT! Pip officially trusts you with the star drawer. ★" : gameActive ? "Quick, little dreamer! Tap the wandering star." : gameSeconds === 0 ? "The stars went sleepy. Try again? ♡" : "A tiny 20-second game. No pressure, just sparkles."}</p>
          </div>
          <div className={`toy-board ${gameActive ? "is-active" : ""}`} aria-label="Star catching game area">
            <span className="toy-board-label">THE SKY ABOVE PIP'S BED</span>
            <span className="toy-cloud cloud-one" aria-hidden="true">☁</span>
            <span className="toy-cloud cloud-two" aria-hidden="true">☁</span>
            {gameActive ? (
              <button className={`catch-star star-position-${gameScore % 5}`} type="button" onClick={catchStar} aria-label="Catch the star">★</button>
            ) : (
              <div className="toy-board-idle" aria-hidden="true"><span>✦</span><small>{gameWon ? "wish granted!" : "ready when you are"}</small></div>
            )}
            <span className="toy-board-doodle" aria-hidden="true">♡</span>
          </div>
        </section>

        <section className="tiny-inventions" aria-labelledby="inventions-title">
          <div className="inventions-heading">
            <p className="eyebrow">FILE 005 · THE LITTLE IDEAS CORNER</p>
            <h3 id="inventions-title">More tiny things <span>Pip made.</span></h3>
            <p>Not every invention needs a big machine. Some just need a curious little click.</p>
          </div>
          <div className="invention-grid">
            <article className="invention-card storybook-card">
              <span className="invention-number">04 / BEDTIME STORYBOOK</span>
              <div className="storybook-illustration" aria-hidden="true">{["☾", "♫", "✉"][storybookPage]}</div>
              <p className="eyebrow">PAGE {String(storybookPage + 1).padStart(2, "0")} OF 03</p>
              <h4>{["The Moon Lost Its Yawn", "A Song for the Clouds", "Home Before Sunrise"][storybookPage]}</h4>
              <p>{["The moon had forgotten how to yawn, so Pip tucked a tiny pillow into its pocket.", "Three little notes floated up and taught the clouds to drift slowly, softly, together.", "With one dream parcel left, Pip followed the pink stars home just as morning waved hello."][storybookPage]}</p>
              <div className="storybook-controls">
                <button type="button" onClick={() => setStorybookPage((page) => (page + 2) % 3)} aria-label="Previous story page">← Back</button>
                <button type="button" onClick={() => setStorybookPage((page) => (page + 1) % 3)} aria-label="Next story page">Next →</button>
              </div>
            </article>
            <article className="invention-card blocks-card">
              <span className="invention-number">05 / RATTLE & BLOCK TOYS</span>
              <div className="block-stack" aria-label={`You stacked ${blockStack.length} blocks`}>
                {blockStack.length ? blockStack.map((block, index) => <span className={`toy-block block-${block}`} key={`${block}-${index}`}>{["★", "☾", "♡", "✿"][block]}</span>) : <span className="empty-block-hint">your tower goes here ↓</span>}
              </div>
              <h4>Build a teeny tower</h4>
              <p>Tap a block to add it. Knock the tower down when your engineering is complete.</p>
              <div className="block-controls">
                {[0, 1, 2, 3].map((block) => <button type="button" key={block} onClick={() => setBlockStack((stack) => stack.length < 5 ? [...stack, block] : stack)} aria-label={`Add ${["star", "moon", "heart", "flower"][block]} block`}>{["★", "☾", "♡", "✿"][block]}</button>)}
                <button type="button" className="knock-button" onClick={() => setBlockStack([])}>Knock down ↻</button>
              </div>
              <p className="block-status" aria-live="polite">{blockStack.length >= 5 ? "A five-block masterpiece! Pip is impressed. ★" : `${blockStack.length} / 5 blocks stacked`}</p>
            </article>
            <article className="invention-card growth-card">
              <span className="invention-number">06 / PIP'S GROWTH CHART</span>
              <div className="growth-ruler" aria-label="Pip's dream engineering skills">
                {[{name:"Kindness",value:96},{name:"Lullabies",value:82},{name:"Star maps",value:74},{name:"Tidying up",value:28}].map((skill) => <div className="growth-skill" key={skill.name}><div><span>{skill.name}</span><strong>{skill.value}%</strong></div><span className="growth-track"><span style={{width:`${skill.value}%`}} /></span></div>)}
              </div>
              <h4>Growing one dream at a time</h4>
              <p>Pip's official nursery chart. Tidying up is still a work in progress. (Same, Pip.)</p>
              <span className="growth-stamp">VERY GOOD TRY! ♡</span>
            </article>
          </div>
        </section>

        <p className="work-footnote">
          <span>✦</span> EVERY LITTLE IDEA DESERVES A DREAM.
        </p>
      </section>

      <footer className="site-footer">
        <a className="footer-brand" href="#home">
          PIP.OS <span>✦</span>
        </a>
        <p>A LITTLE MAGIC GOES A LONG WAY · MADE FOR HAΧ.BABY — TRACK 1: PIP</p>
        <a href="#home">BACK TO TOP ↑</a>
      </footer>
    </main>
  );
}

export default App;
