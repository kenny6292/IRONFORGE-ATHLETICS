export default function About() {
  return (
    <main className="page">
      <a className="back" href="/">← HOME</a>
      <p className="eyebrow">IRONFORGE ATHLETICS</p>
      <h1>TRAIN HARD.<br /><i>TRAIN SMART.</i></h1>
      <p className="pageLead">IRONFORGE is a performance-focused training environment built around structured programming, expert coaching and consistent progress.</p>
      <section className="pageGrid">
        <article>
          <h2>OUR METHOD</h2>
          <p>Every program combines progressive overload, conditioning, recovery and coaching feedback. Training should be demanding, measurable and sustainable.</p>
        </article>
        <article>
          <h2>OUR MISSION</h2>
          <p>Give every member the tools, environment and accountability needed to build strength and confidence.</p>
        </article>
      </section>
      <a className="btn primary" href="/#membership">EXPLORE MEMBERSHIP →</a>
    </main>
  );
}
