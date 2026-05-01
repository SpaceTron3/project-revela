import Navbar from '../components/Navbar'
import WaitlistForm from '../components/WaitlistForm'

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
    title: 'Verified candidate profiles',
    desc: 'Every profile is sourced from public records, official filings, and verified statements. No spin. No speculation.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'Side-by-side comparisons',
    desc: 'Compare candidates on the issues that matter — policy stances, voting history, and campaign funding.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 20V10M12 20V4M6 20v-6"/>
      </svg>
    ),
    title: 'Real-time updates',
    desc: 'Get notified when a candidate changes their stance or files new disclosures — before election day.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Your district, your ballot',
    desc: 'Enter your address and instantly see every race you\'ll vote on — from president to local school board.',
  },
]

const steps = [
  { num: '01', title: 'Enter your address', desc: 'We map your location to your exact voting district — federal, state, and local.' },
  { num: '02', title: 'See your full ballot', desc: 'Every race, every candidate, all in one place. No searching required.' },
  { num: '03', title: 'Compare and decide', desc: 'Dig into verified profiles, policy positions, and funding sources side by side.' },
  { num: '04', title: 'Vote with confidence', desc: 'Walk into the booth knowing exactly who you\'re voting for and why.' },
]

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-28 px-6 max-w-5xl mx-auto text-center">
        <div className="animate-fade-up delay-1">
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-revela-blue bg-revela-blue-light px-4 py-2 rounded-full mb-8">
            Civic transparency platform
          </span>
        </div>

        <h1 className="animate-fade-up delay-2 font-display text-5xl md:text-7xl font-bold leading-tight tracking-tight text-revela-navy mb-6">
          Know who you're <br/>
          <em className="text-revela-blue not-italic">really</em> voting for.
        </h1>

        <p className="animate-fade-up delay-3 text-lg md:text-xl text-gray-500 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
          Project Revela cuts through the noise — delivering clear, unbiased, up-to-date
          information on every candidate running for office in your district.
        </p>

        <div className="animate-fade-up delay-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <WaitlistForm />
        </div>

        <p className="animate-fade-up delay-5 text-xs text-gray-400 mt-4">
          Free for every American voter. Always.
        </p>
      </section>

      {/* Stats */}
      <section className="bg-revela-navy py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {[
            { num: '50', label: 'States covered at launch' },
            { num: '100%', label: 'Free for all voters' },
            { num: '0', label: 'Political bias. Ever.' },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-display text-5xl font-bold text-white mb-2">{s.num}</div>
              <div className="text-sm text-blue-200">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-28 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-medium tracking-widest uppercase text-revela-blue mb-3">What we offer</p>
          <h2 className="font-display text-4xl font-bold text-revela-navy">
            Everything you need to vote informed.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((f) => (
            <div key={f.title} className="border border-gray-100 rounded-2xl p-8 hover:border-revela-blue/30 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-xl bg-revela-blue-light flex items-center justify-center text-revela-blue mb-5">
                {f.icon}
              </div>
              <h3 className="font-medium text-revela-navy text-base mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gray-50 py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-medium tracking-widest uppercase text-revela-blue mb-3">Simple by design</p>
            <h2 className="font-display text-4xl font-bold text-revela-navy">How it works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="flex gap-5">
                <div className="font-display text-4xl font-bold text-revela-blue/20 leading-none w-12 shrink-0">{s.num}</div>
                <div>
                  <h3 className="font-medium text-revela-navy mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="py-28 px-6 max-w-3xl mx-auto text-center">
        <p className="text-xs font-medium tracking-widest uppercase text-revela-blue mb-6">Our mission</p>
        <blockquote className="font-display text-3xl md:text-4xl font-bold text-revela-navy leading-tight mb-8">
          "Democracy works best when voters are informed."
        </blockquote>
        <p className="text-base text-gray-500 leading-relaxed">
          Project Revela was built on the belief that every American voter — regardless of their background,
          education, or resources — deserves access to clear, verified, and complete information about
          who is asking for their vote. We are nonpartisan by principle, free by design, and accountable
          to the public interest.
        </p>
      </section>

      {/* Waitlist CTA */}
      <section id="waitlist" className="bg-revela-navy py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Be the first to know.
          </h2>
          <p className="text-blue-200 text-base mb-10">
            Project Revela launches ahead of the next major election cycle.
            Join our waitlist and we'll notify you the moment we go live.
          </p>
          <div className="flex justify-center">
            <WaitlistForm dark />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-display font-bold text-revela-navy">
            Project <span className="text-revela-blue">Revela</span>
          </span>
          <p className="text-xs text-gray-400 text-center">
            © 2026 Project Revela. Built for the American voter.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-revela-navy transition-colors">Privacy</a>
            <a href="#" className="hover:text-revela-navy transition-colors">Terms</a>
            <a href="mailto:hello@projectrevela.org" className="hover:text-revela-navy transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
