import { Link } from "react-router-dom";

const communityStats = [
  { label: "Original recipes", value: "4.2k+", description: "Crafted, tested, and plated by Savora cooks." },
  { label: "Cuisines explored", value: "38", description: "From Gujarati brunches to Neapolitan nights." },
  { label: "Weekly cook-alongs", value: "12", description: "Hosted by creators across the globe." },
];

const pillars = [
  {
    title: "Celebrate stories",
    description:
      "Every recipe arrives with memories, playlists, and plating rituals. We preserve the human notes behind each dish.",
    icon: "📖",
  },
  {
    title: "Cook with confidence",
    description:
      "Step-by-step techniques, substitution tips, and nutrition spotlights guide both first-time cooks and seasoned hosts.",
    icon: "🍳",
  },
  {
    title: "Share generously",
    description:
      "Swap tweaks, bookmark favourites, and host your own micro-collections for friends, family, or supper clubs.",
    icon: "💌",
  },
];

const timeline = [
  {
    year: "2019",
    title: "The first supper club",
    description:
      "Savora began as a neighbourhood potluck where friends documented heritage recipes on index cards and photo rolls.",
  },
  {
    year: "2021",
    title: "Recipes meet pixels",
    description:
      "We launched the digital studio to capture plating, texture, and storytelling with the same warmth as the dinner table.",
  },
  {
    year: "2023",
    title: "Global cook-room",
    description:
      "Live cook-alongs, curated playlists, and ingredient swaps turned Savora into a vibrant, always-open kitchen arcade.",
  },
  {
    year: "Today",
    title: "You at the table",
    description:
      "Whether you’re fermenting, flash-searing, or folding pastry, you belong here. Bring your story—we’ll set the table.",
  },
];

const coreValues = [
  {
    heading: "Inclusive flavours",
    body: "Every palate matters. We champion cuisines that are often underrepresented, spotlighting indigenous and diaspora voices.",
  },
  {
    heading: "Learning by doing",
    body: "Interactive walkthroughs, timers, and shareable prep lists empower newer cooks to try bold techniques without hesitation.",
  },
  {
    heading: "Care for the planet",
    body: "Seasonal swaps, low-waste pantry challenges, and climate-friendly ingredient guides keep sustainability on the menu.",
  },
];

const AboutPage = () => (
  <div className="page about">
  <section className="about-hero">
      <div className="about-hero__content">
        <span className="about-hero__tag">Where recipes become rituals</span>
        <h1>Sharing plates, stories, and sparks of flavour.</h1>
        <p>
          Savora brings together storytellers, home cooks, and culinary explorers under one digital roof. What started as
          a tiny supper club now houses a global kitchen powered by community love, cultural curiosity, and playful plating.
        </p>
        <div className="about-hero__stats">
          {communityStats.map((stat) => (
            <article key={stat.label} className="about-stat">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
              <p>{stat.description}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="about-hero__media">
        <div className="about-hero__card">
          <h2>Our kitchen manifesto</h2>
          <ul>
            <li>Season with memories and share the credit.</li>
            <li>Invite new voices into every course.</li>
            <li>Balance joy, nourishment, and sustainability.</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="panel about-pillars">
      <header className="about-section-header">
        <h2>What flavours Savora?</h2>
        <p>
          Our platform blends editorial curation, cultural exchange, and culinary mentorship. These pillars guide everything
          from homepage showcases to the way we moderate comments.
        </p>
      </header>
      <div className="about-pillars__grid">
        {pillars.map((pillar) => (
          <article key={pillar.title} className="about-pillars__card">
            <span className="about-pillars__icon" aria-hidden="true">
              {pillar.icon}
            </span>
            <h3>{pillar.title}</h3>
            <p>{pillar.description}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="panel about-values">
      <header className="about-section-header">
        <h2>How we care for every cook</h2>
      </header>
      <div className="about-values__grid">
        {coreValues.map((value) => (
          <article key={value.heading} className="about-values__card">
            <h3>{value.heading}</h3>
            <p>{value.body}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="about-timeline panel">
      <header className="about-section-header">
        <h2>Our story so far</h2>
        <p>We’ve grown with each shared dish—and so has the table.</p>
      </header>
      <div className="about-timeline__steps">
        {timeline.map((entry) => (
          <article key={entry.year} className="about-timeline__item">
            <div className="about-timeline__year">{entry.year}</div>
            <div className="about-timeline__content">
              <h3>{entry.title}</h3>
              <p>{entry.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section className="about-cta">
      <div className="about-cta__content">
        <h2>Set the next table with us.</h2>
        <p>
          Start a collection, host a virtual cook-along, or simply bookmark tonight’s dinner. Savora is your lab for flavour
          experiments and your lounge for sharing them.
        </p>
      </div>
      <Link to="/register" className="btn btn--primary">
        Join the community
      </Link>
    </section>
  </div>
);

export default AboutPage;
