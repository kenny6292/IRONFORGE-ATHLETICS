export default function Page() {
  return (
    <main className="page">
      <a className="back" href="/">← HOME</a>
      <p className="eyebrow">IRONFORGE / TRAINERS</p>
      <h1>TRAINERS <i></i></h1>
      <p className="pageLead">Explore the IRONFORGE trainers experience.</p>
      <section className="pageGrid">
        <article>
          <span className="num">IRONFORGE</span>
          <h2>MARCUS REED</h2>
          <p>Strength & Conditioning Coach</p>
          <a className="textLink" href="/#contact">EXPLORE →</a>
        </article>
        <article>
          <span className="num">IRONFORGE</span>
          <h2>AMARA OKAFOR</h2>
          <p>Performance & Personal Training</p>
          <a className="textLink" href="/#contact">EXPLORE →</a>
        </article>
        <article>
          <span className="num">IRONFORGE</span>
          <h2>DANIEL COLE</h2>
          <p>Boxing & Conditioning Coach</p>
          <a className="textLink" href="/#contact">EXPLORE →</a>
        </article>
      </section>
      <a className="btn primary" href="/#membership">START TRAINING →</a>
    </main>
  );
}
