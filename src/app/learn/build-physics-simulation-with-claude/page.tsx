import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("build-physics-simulation-with-claude")!;

export const metadata: Metadata = {
  title: article.title,
  description: article.description,
  alternates: { canonical: `https://arcadelab.ai/learn/${article.slug}` },
  openGraph: {
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    title: article.title,
    description: article.description,
    url: `https://arcadelab.ai/learn/${article.slug}`,
    type: "article",
  },
};

const FAQS = [
  {
    question: "Do I need to know physics to build a simulation?",
    answer:
      "It helps to understand the system you want to show, but you do not need to derive the equations. An AI assistant knows the standard models — gravity, springs, orbits, collisions — and can implement them. Your job is to describe the behavior you want.",
  },
  {
    question: "Should I use a physics library or write the math myself?",
    answer:
      "For colliding rigid bodies, a library like Matter.js saves real effort. For a pendulum, orbits, or a particle field, a few lines of math on a canvas is simpler and lighter. Match the tool to the system rather than reaching for a library by default.",
  },
  {
    question: "Will the simulation run smoothly in a browser?",
    answer:
      "Yes, for most simulations. A canvas updated inside a requestAnimationFrame loop handles thousands of particles comfortably. Performance only becomes a concern with very large particle counts or heavy per-frame math.",
  },
  {
    question: "Can a physics simulation be published like a game?",
    answer:
      "Yes. A simulation is a single self-contained HTML file, the same shape as a browser game. ArcadeLab publishes it the same way, with the same sandbox and the same paste-and-go flow.",
  },
  {
    question: "How do I make the simulation teach something?",
    answer:
      "Add controls. A simulation with sliders for gravity, mass, or speed lets a viewer build intuition by experimenting. The interaction is what turns a moving picture into a tool for understanding.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        Describe the system you want to simulate — gravity, a pendulum, orbiting
        bodies, colliding shapes — and ask your AI assistant for it as a single
        self-contained HTML file using the canvas API. Add controls so viewers
        can change the variables. Publish the file for a URL anyone can open.
        ArcadeLab hosts physics simulations exactly the way it hosts games.
      </QuickAnswer>

      <p>
        A physics simulation is one of the most rewarding things to build with an
        AI assistant. It looks impressive, it teaches something real, and it fits
        neatly into a single HTML file. Here is how to get from an idea to a
        published, interactive simulation.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What makes a good first physics simulation?
      </h2>
      <p>
        Start with a system that has one or two variables and visible motion. A
        bouncing ball under gravity, a swinging pendulum, two bodies in orbit, a
        mass on a spring, a field of drifting particles. Each is simple enough to
        get right quickly and interesting enough to be worth sharing. Save the
        many-body, fluid, and soft-body simulations for later.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I prompt for a physics simulation?
      </h2>
      <p>
        Name the system and the format together: &quot;Build a single
        self-contained HTML file that simulates a double pendulum on a canvas
        that resizes to the window.&quot; Describe what should move and how. Then
        ask for the variables to be adjustable. Keeping the request to one system
        gets a working result faster than asking for a physics playground all at
        once.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Should I use a physics library?
      </h2>
      <p>
        It depends on the system. For rigid bodies that collide and stack,
        Matter.js does the hard work — list it as a library in the ARCADELAB
        header and ArcadeLab injects it. For continuous systems like orbits,
        pendulums, and springs, the math is short and a plain canvas is lighter
        and easier to read. Tell the assistant which approach you want so it does
        not pull in a library you do not need.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I make it interactive?
      </h2>
      <p>
        A simulation becomes a teaching tool the moment a viewer can change it.
        Add sliders for the constants — gravity, mass, length, speed — and a
        reset button. Let the viewer drag a body to set its starting position.
        Each control is a small request to the assistant, and each one makes the
        simulation more worth sharing.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I publish the simulation?
      </h2>
      <p>
        Test the file in a browser, then paste it at arcadelab.ai/publish for a
        permanent URL. A simulation is a single self-contained HTML file, so it
        publishes exactly like a game. For the broader category, see{" "}
        <a
          href="/learn/publish-interactive-visualization-online"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          where to publish an interactive visualization online
        </a>
        .
      </p>
      <p>Built a simulation? Publish it at arcadelab.ai/publish.</p>
    </ArticleLayout>
  );
}
