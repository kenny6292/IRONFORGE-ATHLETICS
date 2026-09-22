export default function Page() {
  return (
    <main className="page">
      <a className="back" href="/">← HOME</a>
      <p className="eyebrow">IRONFORGE / BLOG</p>
      <h1>BLOG <i></i></h1>
      <p className="pageLead">Explore the IRONFORGE blog experience.</p>
      <section className="pageGrid">
        <article>
          <span className="num">IRONFORGE</span>
          <h2>TRAINING</h2>
          <p>Programming, strength and conditioning education.</p>
          <a className="textLink" href="/#contact">EXPLORE →</a>
        </article>
        <article>
          <span className="num">IRONFORGE</span>
          <h2>RECOVERY</h2>
          <p>Practical recovery, mobility and training-readiness guidance.</p>
          <a className="textLink" href="/#contact">EXPLORE →</a>
        </article>
        <article>
          <span className="num">IRONFORGE</span>
          <h2>LIFESTYLE</h2>
          <p>Sustainable habits that support an active lifestyle.</p>
          <a className="textLink" href="/#contact">EXPLORE →</a>
        </article>
      </section>
      <a className="btn primary" href="/#membership">START TRAINING →</a>
    </main>
  );
}
