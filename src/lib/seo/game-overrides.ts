/**
 * Per-game SEO/AEO overrides.
 *
 * Most games on ArcadeLab are kid-built, low-text, and don't need page-level
 * customization — the default game page is fine for them.
 *
 * For "showcase" games (educational, popular, visually striking, or genuinely
 * shareable), we add an override entry here. That entry enriches the game's
 * page with:
 *   - A custom long description above the iframe
 *   - LearningResource structured data (so AI engines see the page as an
 *     interactive demo of a specific topic, not just "a game")
 *   - Page-specific FAQ schema targeting the topic
 *   - Internal links to related articles, prompts, and library pages
 *
 * Adding a new override is a 15-minute weekly task:
 *   1. Pick a great new game published in the last week
 *   2. Add an entry below, keyed by its slug
 *   3. Commit + push (Vercel auto-deploys)
 *
 * See MARKETING_PRIVATE/FOLLOWUPS.md for the weekly review process.
 */

export interface GameSeoOverride {
  /**
   * Page-specific marketing description. Rendered above the iframe.
   * Targets long-tail queries for the topic this game covers.
   * Should be 2-4 sentences, written for both humans and AI engines.
   */
  longDescription?: string;

  /** Topics this game/visualization teaches. Used in LearningResource schema. */
  educationalTopics?: string[];

  /**
   * Schema.org LearningResource type.
   * Common values: "Interactive Demo", "Simulation", "Game", "Explorable",
   * "Tutorial", "Lesson", "Generative Art".
   */
  learningResourceType?: string;

  /** Optional educational level (e.g., "Beginner", "Intermediate", "High School"). */
  educationalLevel?: string;

  /** Page-specific FAQs. Rendered + included in FAQPage schema. */
  faqs?: { question: string; answer: string }[];

  /** If true, may be featured on the homepage or library landing pages. */
  featured?: boolean;

  /** Slugs of related /learn articles to cross-link from this page. */
  relatedArticleSlugs?: string[];

  /** Slugs of related /prompts pages to cross-link. */
  relatedPromptSlugs?: string[];

  /**
   * Override the library this game uses for cross-linking purposes.
   * Defaults to the first library in the game's `libraries` field.
   */
  primaryLibrary?: "phaser" | "p5" | "three" | "d3" | "gsap" | "tone" | "pixi" | "matter" | "react";
}

export const GAME_OVERRIDES: Record<string, GameSeoOverride> = {
  "light-wave-or-particle-ultraviper34": {
    longDescription:
      "An interactive demonstration of the double-slit experiment — one of the most famous puzzles in physics. Light arrives as discrete particles (photons) that land at single points on the detector, but while traveling it behaves like a wave that interferes with itself. Fire one photon at a time, then a thousand at once, and watch how the interference pattern emerges only from the statistics of many.",
    educationalTopics: [
      "double-slit experiment",
      "wave-particle duality",
      "quantum mechanics",
      "photons",
      "interference patterns",
      "physics",
    ],
    learningResourceType: "Interactive Demo",
    educationalLevel: "High School",
    faqs: [
      {
        question: "What is the double-slit experiment?",
        answer:
          "The double-slit experiment is a demonstration that light (and matter) exhibits both wave-like and particle-like properties. When a stream of particles is fired through two narrow slits, an interference pattern appears on the detector behind them — characteristic of waves, not particles. The mystery is that even single particles fired one at a time still produce an interference pattern when many are accumulated.",
      },
      {
        question: "Why does this interactive demo matter?",
        answer:
          "Seeing the interference pattern emerge from the statistics of individual photon impacts makes wave-particle duality concrete in a way a textbook diagram can't. You can fire a single photon, see it land somewhere on the detector, and only after firing hundreds do the bright and dark bands of the interference pattern reveal themselves.",
      },
      {
        question: "Can I make a physics simulation like this and host it?",
        answer:
          "Yes. ArcadeLab hosts any single-file HTML interactive content — physics simulations, math toys, data visualizations, explorables. Paste a complete HTML file at arcadelab.ai/publish and you get a permanent shareable URL. No signup, no build tools.",
      },
      {
        question: "What technology is this built with?",
        answer:
          "It's a single self-contained HTML file using the browser's 2D canvas API. No frameworks, no build step, no external assets. The entire experiment fits in one document — which makes it remixable: anyone can view the source and modify it.",
      },
    ],
    featured: true,
    relatedArticleSlugs: [
      "publish-interactive-visualization-online",
      "share-interactive-thing-made-with-ai",
      "share-d3-visualization-no-build",
    ],
    relatedPromptSlugs: ["make-an-interactive-visualization"],
  },

  // ── ArcadeLab showcase gallery (published 2026-05-15) ──────────────────
  // Eight deliberately-built demos, one per category, that double as
  // marketing assets and examples of AI-buildable single-file HTML content.

  "gravity-wells-arcadelab": {
    longDescription:
      "An orbital-mechanics sandbox you can play with in the browser. Drag from empty space to launch a small planet — the drag vector sets its starting velocity — and watch it orbit, slingshot, or escape under real Newtonian gravity from every star on screen. It makes the difference between a bound orbit and an escape trajectory something you feel, not just read about.",
    educationalTopics: [
      "Newtonian gravity",
      "orbital mechanics",
      "gravitational force",
      "escape velocity",
      "physics simulation",
      "two-body and n-body motion",
    ],
    learningResourceType: "Simulation",
    educationalLevel: "Middle School",
    faqs: [
      {
        question: "What does Gravity Wells teach?",
        answer:
          "It shows how gravity depends on mass and distance, and how a moving object's initial velocity decides whether it falls in, settles into a stable orbit, or flies off forever. Because you set the launch velocity yourself, you can discover orbital mechanics by experiment.",
      },
      {
        question: "How is the gravity simulated?",
        answer:
          "Each planet feels the summed gravitational pull of every star using Newton's inverse-square law, with a small softening term to keep the math stable during close passes. Velocity-Verlet integration with several substeps per frame keeps orbits smooth and stable.",
      },
      {
        question: "Can I build a physics simulation like this myself?",
        answer:
          "Yes — it is a single self-contained HTML file using the 2D canvas API, no frameworks or build step. You can prompt an AI assistant to generate one and publish it on ArcadeLab by pasting the HTML at arcadelab.ai/publish.",
      },
    ],
    featured: true,
    relatedArticleSlugs: [
      "build-physics-simulation-with-claude",
      "publish-interactive-visualization-online",
      "share-interactive-thing-made-with-ai",
    ],
    relatedPromptSlugs: ["make-an-interactive-visualization"],
  },

  "flow-field-bloom-arcadelab": {
    longDescription:
      "A generative-art canvas where hundreds of particles drift along an invisible, slowly evolving vector field, laying down flowing ribbons of color. Tap anywhere to drop a 'bloom' — a burst of particles and a swirl injected into the field. It is a living painting that never quite settles, and a clear demonstration of how simple flow fields produce organic, emergent art.",
    educationalTopics: [
      "generative art",
      "flow fields",
      "vector fields",
      "particle systems",
      "creative coding",
      "emergent behavior",
    ],
    learningResourceType: "Generative Art",
    educationalLevel: "Beginner",
    faqs: [
      {
        question: "What is a flow field?",
        answer:
          "A flow field assigns a direction to every point in space. When particles read the direction beneath them and steer that way each frame, their paths trace out smooth, coordinated curves — the basis of much generative art.",
      },
      {
        question: "Does this use a noise library like Perlin noise?",
        answer:
          "No. The field is built from layered sine functions of x, y, and time — a self-contained pseudo-noise function — so the whole piece is one HTML file with no external libraries.",
      },
      {
        question: "Can I make generative art and share it online?",
        answer:
          "Yes. ArcadeLab hosts any single-file HTML interactive content, including generative art. Paste a complete HTML file at arcadelab.ai/publish to get a permanent shareable URL — no signup, no build tools.",
      },
    ],
    featured: true,
    relatedArticleSlugs: [
      "share-p5js-sketch-as-playable-url",
      "share-interactive-thing-made-with-ai",
      "publish-interactive-visualization-online",
    ],
    relatedPromptSlugs: ["make-an-interactive-visualization"],
  },

  "mandelbrot-voyager-arcadelab": {
    longDescription:
      "An interactive explorer for the Mandelbrot set — one of mathematics' most famous fractals. Tap anywhere to dive deeper, and the same swirling, infinitely detailed structure keeps unfolding no matter how far you zoom. Smooth continuous-iteration coloring and rising iteration depth keep every level of the descent sharp.",
    educationalTopics: [
      "Mandelbrot set",
      "fractals",
      "complex numbers",
      "iteration and recursion",
      "self-similarity",
      "mathematics",
    ],
    learningResourceType: "Interactive Demo",
    educationalLevel: "High School",
    faqs: [
      {
        question: "What is the Mandelbrot set?",
        answer:
          "It is the set of complex numbers c for which the sequence z → z² + c stays bounded. Coloring each pixel by how quickly that sequence escapes produces the intricate, infinitely detailed fractal you can explore here.",
      },
      {
        question: "Why does the detail never run out as I zoom in?",
        answer:
          "The Mandelbrot set is self-similar and infinitely complex: its boundary contains structure at every scale. This explorer raises the iteration count as you zoom so deep regions stay crisp instead of turning into flat blobs.",
      },
      {
        question: "Is this really a single HTML file?",
        answer:
          "Yes — it renders the fractal in non-blocking chunks on the 2D canvas, with no libraries or build step. You can publish a math explorer like this on ArcadeLab by pasting the HTML at arcadelab.ai/publish.",
      },
    ],
    featured: true,
    relatedArticleSlugs: [
      "publish-interactive-visualization-online",
      "make-interactive-explainer-with-ai",
      "share-interactive-thing-made-with-ai",
    ],
    relatedPromptSlugs: ["make-an-interactive-visualization"],
  },

  "pocket-sequencer-arcadelab": {
    longDescription:
      "A step sequencer that turns a grid into music. Each row is a note from a pentatonic scale and each column is a beat — tap cells to build a loop, press play, and a playhead sweeps the grid triggering notes through the Web Audio API. Because the scale is pentatonic, anything you tap in sounds good, which makes it a friendly first encounter with how rhythm and melody are constructed.",
    educationalTopics: [
      "step sequencers",
      "rhythm and melody",
      "pentatonic scale",
      "Web Audio API",
      "music theory",
      "sound synthesis",
    ],
    learningResourceType: "Interactive Demo",
    educationalLevel: "Beginner",
    faqs: [
      {
        question: "What is a step sequencer?",
        answer:
          "A step sequencer is a grid where rows are pitches and columns are beats. Lighting up a cell schedules that note on that beat; looping the grid plays your pattern over and over. It is the core idea behind most electronic music tools.",
      },
      {
        question: "Why does everything I tap sound good together?",
        answer:
          "The rows are tuned to a pentatonic scale — a five-note scale with no harsh intervals — so any combination of notes sounds consonant. That lets beginners experiment freely without 'wrong' notes.",
      },
      {
        question: "How does it make sound with no audio files?",
        answer:
          "It synthesizes every note live with Web Audio oscillators and a gain envelope, scheduled with a look-ahead timer so the audio stays locked to the visual playhead. The whole instrument is one HTML file you can publish on ArcadeLab.",
      },
    ],
    featured: true,
    relatedArticleSlugs: [
      "share-interactive-thing-made-with-ai",
      "publish-single-file-html-game",
      "make-interactive-explainer-with-ai",
    ],
    relatedPromptSlugs: ["make-a-game-for-my-kid"],
  },

  "boids-flock-arcadelab": {
    longDescription:
      "A flocking simulation built on Craig Reynolds' classic 'boids' model. A few hundred simple agents each follow just three local rules — separation, alignment, and cohesion — and from those rules a lifelike flock emerges. Tune each rule with a slider, or tap to scatter the flock like a predator, and watch how collective behavior changes in real time.",
    educationalTopics: [
      "flocking and boids",
      "emergent behavior",
      "agent-based simulation",
      "complex systems",
      "self-organization",
      "Craig Reynolds boids model",
    ],
    learningResourceType: "Simulation",
    educationalLevel: "Middle School",
    faqs: [
      {
        question: "What are boids?",
        answer:
          "Boids are simulated agents from Craig Reynolds' 1986 model. Each one follows three rules relative to nearby neighbors — steer away to avoid crowding (separation), match their average heading (alignment), and move toward their center (cohesion).",
      },
      {
        question: "Why is this a good example of emergent behavior?",
        answer:
          "No boid is told to 'form a flock.' The flock is emergent: it arises purely from many agents following the same simple local rules. Adjusting the sliders shows how small rule changes reshape the whole group's behavior.",
      },
      {
        question: "Can I publish a simulation like this?",
        answer:
          "Yes. This is one self-contained HTML file using the 2D canvas — no libraries. Paste a complete HTML file at arcadelab.ai/publish to host an interactive simulation with a permanent URL.",
      },
    ],
    featured: true,
    relatedArticleSlugs: [
      "build-physics-simulation-with-claude",
      "publish-interactive-visualization-online",
      "share-interactive-thing-made-with-ai",
    ],
    relatedPromptSlugs: ["make-an-interactive-visualization"],
  },

  "lights-out-arcadelab": {
    longDescription:
      "The classic Lights Out puzzle, fully playable in the browser. Tapping a light toggles it and its four orthogonal neighbors; the goal is to switch every light off. Every board is generated by applying random valid presses to a solved grid, so it is always guaranteed solvable — a tidy, satisfying puzzle with a surprising amount of mathematics underneath.",
    educationalTopics: [
      "logic puzzles",
      "Lights Out puzzle",
      "parity and toggling",
      "problem solving",
      "puzzle game design",
    ],
    learningResourceType: "Game",
    educationalLevel: "Beginner",
    faqs: [
      {
        question: "How do you play Lights Out?",
        answer:
          "Tap any light and it flips on or off along with its up, down, left, and right neighbors. You win when every light on the board is off. It takes planning, because each move affects several cells at once.",
      },
      {
        question: "Is every puzzle solvable?",
        answer:
          "Yes. Each board starts fully solved and is scrambled by a series of random valid presses, so a solution always exists — you just have to find it. Press order does not matter, which is a neat property of the puzzle.",
      },
      {
        question: "Can I build and share a puzzle game like this?",
        answer:
          "Yes. Lights Out is a single self-contained HTML file. ArcadeLab lets kids and creators publish browser games by pasting their HTML at arcadelab.ai/publish — no signup, no build tools.",
      },
    ],
    featured: true,
    relatedArticleSlugs: [
      "publish-single-file-html-game",
      "single-file-html-game-template",
      "game-ideas-you-can-build-with-ai-tonight",
    ],
    relatedPromptSlugs: ["make-a-game-for-my-kid"],
  },

  "planet-explorer-arcadelab": {
    longDescription:
      "An interactive data visualization of the eight planets of the Solar System. Map any data — distance from the Sun, diameter, mass, moon count, orbital period — to the X axis, Y axis, or bubble size, and the chart animates smoothly to the new view. Hover or tap any planet for its full stats. It turns a table of planetary facts into something you can explore and compare at a glance.",
    educationalTopics: [
      "data visualization",
      "the Solar System",
      "the eight planets",
      "bubble charts",
      "comparing data dimensions",
      "astronomy",
    ],
    learningResourceType: "Interactive Demo",
    educationalLevel: "Middle School",
    faqs: [
      {
        question: "What can I learn from Planet Explorer?",
        answer:
          "By remapping the axes you can see relationships in the Solar System directly — how Jupiter dwarfs the rocky inner planets, how moon counts climb with distance from the Sun, and how orbital period grows with distance.",
      },
      {
        question: "Why is it a bubble chart?",
        answer:
          "A bubble chart shows three variables at once — X, Y, and bubble size — so you can compare planets across multiple dimensions in a single picture instead of reading a table row by row.",
      },
      {
        question: "Can I build an interactive data visualization like this?",
        answer:
          "Yes. This is one self-contained HTML file with the dataset embedded inline and drawn on the 2D canvas. Paste a complete HTML file at arcadelab.ai/publish to publish a data visualization with a permanent URL.",
      },
    ],
    featured: true,
    relatedArticleSlugs: [
      "single-file-data-viz-publishing",
      "publish-interactive-visualization-online",
      "share-d3-visualization-no-build",
    ],
    relatedPromptSlugs: ["make-an-interactive-visualization"],
  },

  "the-lighthouse-keeper-arcadelab": {
    longDescription:
      "An atmospheric interactive story. You are the keeper of Gull Rock Light on a stormy night, and the choices you make — what you carry, whether you light the lamp, which danger you face — branch the tale toward one of several distinct endings. It is a small, well-crafted example of stateful branching narrative: a story that reads differently every time.",
    educationalTopics: [
      "interactive fiction",
      "branching narrative",
      "choose-your-own-adventure",
      "narrative state and flags",
      "interactive storytelling",
      "creative writing",
    ],
    learningResourceType: "Explorable",
    educationalLevel: "Beginner",
    faqs: [
      {
        question: "What is interactive fiction?",
        answer:
          "Interactive fiction is a story the reader steers by making choices. Instead of one fixed path, the narrative branches: different decisions lead to different scenes and different endings.",
      },
      {
        question: "How does the story remember my choices?",
        answer:
          "It tracks simple state flags — like which item you picked up or whether you lit the lamp — and uses them to unlock or hide later choices and to decide which ending you reach. That is the core technique behind branching narrative design.",
      },
      {
        question: "Can I publish an interactive story online?",
        answer:
          "Yes. The Lighthouse Keeper is a single self-contained HTML file. ArcadeLab hosts interactive stories, games, and explorables — paste your HTML at arcadelab.ai/publish for a permanent shareable URL.",
      },
    ],
    featured: true,
    relatedArticleSlugs: [
      "host-interactive-essay-online",
      "make-interactive-explainer-with-ai",
      "share-interactive-thing-made-with-ai",
    ],
    relatedPromptSlugs: ["make-a-game-for-my-kid"],
  },
  "gear-train-arcadelab": {
    longDescription:
      "A hands-on gear simulation for young kids. Drag any of the three meshing gears and the whole train spins together — turn the big gear and the little one whirls around far faster. A colored marker on each gear makes the speed difference easy to see, and a live readout shows the gear ratio between the biggest and smallest gear. It's a playful first look at how gears trade speed for size in bikes, clocks, and machines.",
    educationalTopics: [
      "gears",
      "gear ratio",
      "simple machines",
      "rotational speed",
      "mechanical engineering",
      "physics",
    ],
    learningResourceType: "Interactive Demo",
    educationalLevel: "Elementary School",
    faqs: [
      {
        question: "What is a gear ratio?",
        answer:
          "A gear ratio compares how fast two connected gears spin. If a big gear has 30 teeth and a small gear has 10 teeth, the ratio is 1:3 — the small gear spins three times for every one turn of the big gear. Counting teeth is the easiest way to predict the ratio.",
      },
      {
        question: "Why does the small gear spin faster?",
        answer:
          "Meshing gears push each other tooth by tooth, so they move the same number of teeth past the contact point. A small gear has fewer teeth, so it must spin around more times to keep up with a big gear. Fewer teeth means more turns.",
      },
      {
        question: "How do kids use this simulation?",
        answer:
          "Just drag any gear with a finger or mouse and the whole train turns. Watch the marker dots to compare speeds and read the gear ratio at the bottom. It works on tablets and phones with no setup.",
      },
    ],
    featured: true,
  },
  "steam-engine-arcadelab": {
    longDescription:
      "A see-through steam engine kids can run themselves. Slide the heat up and a fire glows under the boiler, water bubbles into steam, the steam shoves a piston back and forth, and a connecting rod spins a giant flywheel. The whole chain — heat to steam to motion — happens right in front of you, and the flywheel speeds up or slows down as you change the fire. It's a friendly introduction to how engines turned heat into power and started the Industrial Revolution.",
    educationalTopics: [
      "steam engine",
      "energy transformation",
      "heat energy",
      "pistons and crankshafts",
      "Industrial Revolution",
      "physics",
    ],
    learningResourceType: "Simulation",
    educationalLevel: "Elementary School",
    faqs: [
      {
        question: "How does a steam engine work?",
        answer:
          "A fire heats water in a boiler until it turns into steam. Steam takes up much more space than water, so it pushes hard on a piston. The piston is linked by a rod to a crankshaft, which turns the back-and-forth push into spinning motion that drives a flywheel.",
      },
      {
        question: "Why does the flywheel spin faster with more heat?",
        answer:
          "More heat boils the water faster and makes more steam, so the piston gets pushed harder and more often. That extra push speeds up the flywheel. Turn the heat down and the engine slows; turn it off and it stops.",
      },
      {
        question: "What does the heat slider do?",
        answer:
          "The heat slider controls the fire. At zero the engine is cold and still. As you slide it up you see more flames, more steam, and a faster flywheel — a clear picture of heat energy becoming motion.",
      },
    ],
    featured: true,
  },
  "pulley-lifter-arcadelab": {
    longDescription:
      "A pulley sandbox that lets kids feel mechanical advantage. Thread the rope through 1, 2, or 3 pulleys, then drag the rope handle to hoist a heavy crate. With one pulley the pull is hard; add pulleys and the pull gets easier — but you have to pull that much more rope. Live effort and rope-length meters make the trade-off obvious: pulleys don't create free energy, they swap a long easy pull for a short hard one.",
    educationalTopics: [
      "pulleys",
      "mechanical advantage",
      "simple machines",
      "force and effort",
      "work and energy",
      "physics",
    ],
    learningResourceType: "Simulation",
    educationalLevel: "Elementary School",
    faqs: [
      {
        question: "How does a pulley make lifting easier?",
        answer:
          "A pulley system shares the weight of a load across several strands of rope. With two supporting strands you only pull half the weight, with three strands a third. The catch is that you must pull the rope two or three times as far.",
      },
      {
        question: "What is mechanical advantage?",
        answer:
          "Mechanical advantage is how much a machine multiplies your force. A 3-pulley system has a mechanical advantage of about 3 — you push with one-third the force, but over three times the distance. Total work stays the same.",
      },
      {
        question: "Why do you pull more rope with more pulleys?",
        answer:
          "Energy is conserved. Lifting a crate one meter takes the same amount of work no matter what. If the machine cuts your force to a third, it has to make up for it by having you pull three times as much rope.",
      },
    ],
    featured: true,
  },
  "spacetime-sheet-arcadelab": {
    longDescription:
      "A playful model of how gravity works in Einstein's general relativity. A heavy mass sits in the middle of a stretchy grid and dents it into a deep well — the bigger the mass, the deeper the dip. Flick marbles across the sheet and watch them curve, loop into orbits, or spiral inward. Gravity here isn't a pull; it's marbles rolling along curved space. The classic rubber-sheet picture made interactive.",
    educationalTopics: [
      "gravity",
      "general relativity",
      "curved spacetime",
      "orbits",
      "mass and space",
      "physics",
    ],
    learningResourceType: "Simulation",
    educationalLevel: "Elementary School",
    faqs: [
      {
        question: "What is the spacetime sheet model?",
        answer:
          "It is a way to picture gravity. Imagine space as a stretchy sheet. A heavy object like a star dents the sheet, and anything moving nearby rolls along the curve. Planets orbit because they are following the bent shape of space around a star.",
      },
      {
        question: "Why do the marbles orbit instead of falling straight in?",
        answer:
          "A marble with sideways speed keeps moving forward as it also rolls toward the dip. Those two motions combine into a curved path that loops around the mass — an orbit. Too slow and it spirals in; just right and it circles.",
      },
      {
        question: "Does a bigger mass really bend space more?",
        answer:
          "Yes. In the simulation a bigger mass makes a deeper well, and in real space more massive objects curve spacetime more strongly. That stronger curve is why heavy stars hold planets in tighter, faster orbits.",
      },
    ],
    featured: true,
  },
  "moon-phases-orrery-arcadelab": {
    longDescription:
      "A hands-on orrery that finally makes Moon phases click. The Sun lights one side of everything; drag the Moon around its orbit and an inset shows exactly what the Moon looks like from Earth — new, crescent, quarter, gibbous, or full. Day and night sweep across Earth at the same time. Kids discover that phases aren't shadows of the Earth, just our changing view of the Moon's sunlit half.",
    educationalTopics: [
      "moon phases",
      "orbits",
      "the solar system",
      "day and night",
      "astronomy",
      "space science",
    ],
    learningResourceType: "Interactive Demo",
    educationalLevel: "Elementary School",
    faqs: [
      {
        question: "What causes the phases of the Moon?",
        answer:
          "The Sun always lights up one half of the Moon. As the Moon orbits Earth, we see different amounts of that lit half — sometimes all of it (full moon), sometimes none (new moon), and crescents and quarters in between.",
      },
      {
        question: "Are moon phases caused by Earth's shadow?",
        answer:
          "No — that is a common mix-up. Earth's shadow only touches the Moon during a lunar eclipse. Ordinary phases happen because we are viewing the Moon's sunlit side from different angles as it orbits.",
      },
      {
        question: "How long does it take the Moon to go through all its phases?",
        answer:
          "About 29.5 days. That full cycle from one new moon to the next is where the idea of a month comes from.",
      },
    ],
    featured: true,
  },
  "states-of-matter-arcadelab": {
    longDescription:
      "A box of particles that shows why ice, water, and steam are the same stuff. Slide from cold to hot and watch a locked, vibrating solid loosen into a flowing liquid and then break apart into a free-flying gas — and cool it back down to reverse every step. The particles move faster and glow warmer as the temperature climbs, making the link between heat, particle speed, and state of matter clear and tangible.",
    educationalTopics: [
      "states of matter",
      "solids liquids and gases",
      "melting and boiling",
      "heat and temperature",
      "particle motion",
      "chemistry",
    ],
    learningResourceType: "Simulation",
    educationalLevel: "Elementary School",
    faqs: [
      {
        question: "What are the three states of matter shown here?",
        answer:
          "Solid, liquid, and gas. In a solid the particles are locked in a neat pattern and only vibrate. In a liquid they slide past each other and flow. In a gas they fly freely and spread out to fill the space.",
      },
      {
        question: "How does heat change the state of matter?",
        answer:
          "Heat gives particles energy to move faster. Enough heat lets a solid's particles break free and flow as a liquid, and even more heat lets them escape into a gas. Cooling takes energy away and the changes reverse.",
      },
      {
        question: "Is it the same material in all three states?",
        answer:
          "Yes. Ice, liquid water, and steam are all water — the same particles, just moving at different speeds. Changing state does not change what the substance is made of.",
      },
    ],
    featured: true,
  },
  "simple-circuit-arcadelab": {
    longDescription:
      "A friendly electric circuit kids can switch on and off. Tap the switch to close the loop and the bulb lights up while glowing dots show current flowing from the battery. Toggle between a series circuit and a parallel circuit with two bulbs and watch the brightness change — series bulbs share the push and shine dimmer, parallel bulbs each get the full push and shine bright. A clear first look at how electricity flows.",
    educationalTopics: [
      "electric circuits",
      "electricity",
      "series and parallel circuits",
      "current and switches",
      "energy",
      "physics",
    ],
    learningResourceType: "Interactive Demo",
    educationalLevel: "Elementary School",
    faqs: [
      {
        question: "What makes a circuit light a bulb?",
        answer:
          "A bulb lights when there is a complete, unbroken loop from the battery, through the wires and bulb, and back. The switch is a gap in that loop — close it and current flows, open it and the bulb goes dark.",
      },
      {
        question: "What is the difference between series and parallel circuits?",
        answer:
          "In a series circuit the bulbs sit on one single loop and share the battery's push, so each shines dimmer. In a parallel circuit each bulb has its own loop to the battery, so each gets the full push and shines bright.",
      },
      {
        question: "What are the moving dots in the simulation?",
        answer:
          "The dots represent electric current — the flow of charge around the circuit. They move only when the circuit is complete, which helps kids see that electricity needs a closed path.",
      },
    ],
    featured: true,
  },
  "wave-tank-arcadelab": {
    longDescription:
      "A water tank for exploring how waves behave. Tap the surface to send circular ripples spreading outward, then switch on a second source and watch two sets of waves cross. Where crests meet they pile up into bright bands; where a crest meets a trough they cancel into calm dark bands. That pattern — interference — is how scientists understand sound, light, and every other kind of wave.",
    educationalTopics: [
      "waves",
      "ripples",
      "wave interference",
      "constructive and destructive interference",
      "sound and light",
      "physics",
    ],
    learningResourceType: "Simulation",
    educationalLevel: "Elementary School",
    faqs: [
      {
        question: "What is wave interference?",
        answer:
          "Interference is what happens when two waves overlap. Where two crests meet they add up into a bigger wave (constructive interference). Where a crest meets a trough they cancel out into stillness (destructive interference).",
      },
      {
        question: "Why do bright and dark bands appear with two sources?",
        answer:
          "Each point in the tank is a different distance from the two sources. At some spots the waves always arrive in step and reinforce — bright bands. At others they arrive out of step and cancel — dark bands.",
      },
      {
        question: "Do real waves do this too?",
        answer:
          "Yes. Water, sound, and light waves all interfere the same way. The interference of light is what creates the colorful patterns you see in soap bubbles and on CDs.",
      },
    ],
    featured: true,
  },
  "pitch-lab-arcadelab": {
    longDescription:
      "A pluckable string that lets kids see and hear pitch at the same time. Pluck it and the string vibrates with a visible wobble while a tone plays. Slide the length and tension controls: a shorter or tighter string vibrates faster, wobbles quicker, and sounds higher; a longer or looser string is slower and lower. The motion you watch and the note you hear always match — the secret behind every guitar, piano, and violin.",
    educationalTopics: [
      "sound",
      "pitch and frequency",
      "vibration",
      "musical instruments",
      "waves",
      "physics of music",
    ],
    learningResourceType: "Interactive Demo",
    educationalLevel: "Elementary School",
    faqs: [
      {
        question: "What makes a sound high or low?",
        answer:
          "Pitch depends on how fast something vibrates. Fast vibrations make a high sound; slow vibrations make a low sound. The number of vibrations each second is called the frequency.",
      },
      {
        question: "How do length and tension change the pitch?",
        answer:
          "A shorter string or a tighter (higher-tension) string vibrates faster, so the pitch goes up. A longer or looser string vibrates slower, so the pitch goes down. Instruments are tuned by adjusting exactly these things.",
      },
      {
        question: "Why does the audio only start after I tap?",
        answer:
          "Web browsers block sound until you interact with the page, to stop sites from playing noise on their own. Tapping or plucking the string is what switches the audio on.",
      },
    ],
    featured: true,
  },
  "magnet-playground-arcadelab": {
    longDescription:
      "A magnet sandbox that makes invisible forces visible. Drag a bar magnet and its field lines bend and flow with it, curving from the north pole to the south pole. Bring a second magnet close to feel poles attract and repel, watch a compass needle swing to point along the field, and sprinkle iron filings that snap into the field's shape. A tactile introduction to magnetism and magnetic fields.",
    educationalTopics: [
      "magnetism",
      "magnetic fields",
      "magnetic poles",
      "attraction and repulsion",
      "compasses",
      "physics",
    ],
    learningResourceType: "Simulation",
    educationalLevel: "Elementary School",
    faqs: [
      {
        question: "What are magnetic field lines?",
        answer:
          "Field lines are a way to draw the invisible magnetic force around a magnet. They flow out of the north pole and curve back into the south pole. Where the lines are crowded, the magnet is strongest.",
      },
      {
        question: "Why do magnets attract and repel?",
        answer:
          "Every magnet has a north and a south pole. Opposite poles (north and south) pull toward each other, while like poles (north and north, or south and south) push apart.",
      },
      {
        question: "How does a compass work?",
        answer:
          "A compass needle is a tiny magnet that is free to spin. It turns until it lines up with the magnetic field around it — which is why a compass points along Earth's own magnetic field toward the poles.",
      },
    ],
    featured: true,
  },
};

export function getGameOverride(slug: string): GameSeoOverride | undefined {
  return GAME_OVERRIDES[slug];
}

export function isFeaturedGame(slug: string): boolean {
  return GAME_OVERRIDES[slug]?.featured === true;
}

/** Returns all featured game slugs. Used for homepage / library landing surfaces. */
export function getFeaturedGameSlugs(): string[] {
  return Object.entries(GAME_OVERRIDES)
    .filter(([, override]) => override.featured)
    .map(([slug]) => slug);
}
