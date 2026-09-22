export default function Page() {
  return (
    <main className="page">
      <a className="back" href="/">← HOME</a>
      <p className="eyebrow">IRONFORGE / TRANSFORMATIONS</p>
      <h1>TRANSFORMATIONS <i></i></h1>
      <p className="pageLead">Explore the IRONFORGE transformations experience.</p>
      <section className="pageGrid">
        <article>
          <span className="num">IRONFORGE</span>
          <h2>MEMBER STORIES</h2>
          <p>Progress is personal. Explore member journeys and training milestones.</p>
          <a className="textLink" href="/#contact">EXPLORE →</a>
        </article>
        <article>
          <span className="num">IRONFORGE</span>
          <h2>CONSISTENCY</h2>
          <p>Structured programs and coaching help turn training into a repeatable habit.</p>
          <a className="textLink" href="/#contact">EXPLORE →</a>
        </article>
        <article>
          <span className="num">IRONFORGE</span>
          <h2>PERFORMANCE</h2>
          <p>Track strength, conditioning and movement improvements over time.</p>
          <a className="textLink" href="/#contact">EXPLORE →</a>
        </article>
      </section>
      <a className="btn primary" href="/#membership">START TRAINING →</a>
    </main>
  );
}