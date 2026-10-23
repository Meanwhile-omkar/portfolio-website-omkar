'use client';

export default function About() {
  return (
    <section id="about" className="relative py-36 bg-deep border-t border-border z-10">
      <div className="max-w-[1100px] mx-auto px-12">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold mb-4 flex items-center gap-3">
          01 / Philosophy
          <span className="flex-1 max-w-[60px] h-[1px] bg-gold opacity-40"></span>
        </p>
        <h2 className="font-display text-[clamp(36px,5vw,64px)] font-bold leading-[1.0] tracking-[-0.02em] text-cream">
          Not the most <em className="italic text-gold">obvious</em><br />move. The right one.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mt-16">
          <div className="relative p-10 border border-border rounded bg-surface">
            <div className="absolute -top-7 left-10 text-[56px] text-gold leading-none">♞</div>
            <p className="font-display text-[22px] italic text-gold mb-4 mt-2">
              "The knight doesn't move like anyone else."
            </p>
            <p className="text-[14px] text-cream-dim leading-[1.8]">
              The queen has raw power. The rook has straight-line dominance. But the knight? The knight sees around corners. It jumps over obstacles. It attacks from angles no one anticipates.
              <br /><br />
              That's the mindset I bring — whether it's building an ML pipeline or breaking down a business problem for a case competition. I don't do the obvious. I find the L-shaped path that others miss.
              <br /><br />
              I'm pursuing Data Science Engineering — but my north star has always been <strong className="text-gold">strategic consulting and product management</strong>. The technical depth is my edge. The business thinking is my calling.
            </p>
          </div>

          <div className="flex flex-col gap-7">
            {[
              { num: '9+', label: 'Case Competitions', sub: 'Strategy · Product · Analytics · Finance' },
              { num: '5', label: 'Internships Completed', sub: 'ML · Product · Research · Marketing' },
              { num: '8', label: 'Projects Built', sub: 'AI · Full-Stack · Hackathon · Product' },
              { num: '∞', label: 'L-shaped moves remaining', sub: 'The knight never runs out of angles' },
            ].map((stat, i) => (
              <div key={i} className={`flex items-baseline gap-4 pb-7 ${i < 3 ? 'border-b border-border' : ''}`}>
                <div className="font-display text-5xl font-black text-gold leading-none">{stat.num}</div>
                <div>
                  <div className="text-[13px] text-cream-dim leading-[1.5]">{stat.label}</div>
                  <div className="font-mono text-[10px] text-[rgba(245,239,224,0.3)] tracking-[0.1em] uppercase">{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
