import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    q: 'Do I need sales experience to use Nova?',
    a: 'No. Nova hands you a ranked list of businesses that already need a website, so every conversation starts from a real gap you can point to. Most agency owners who close with Nova had never cold-pitched before.',
  },
  {
    q: 'What kind of businesses does Nova find?',
    a: 'Any local service niche you tell it to look for — plumbers, roofers, dentists, HVAC, landscaping, and hundreds more. You set the niche and city, Nova finds the businesses in it.',
  },
  {
    q: 'How does Nova find these leads?',
    a: 'Nova scans Google for local businesses and audits each one’s website, flagging the ones that are slow, broken, or missing entirely. You get a ranked hit-list, not a raw directory dump.',
  },
  {
    q: 'Can I export the leads?',
    a: 'Yes. Every search result can be exported so you can work leads in your own CRM, spreadsheet, or outreach tool alongside Nova’s built-in pipeline.',
  },
  {
    q: 'What makes Nova different from other lead tools?',
    a: 'Most lead tools stop at a list of business names. Nova scores each one on how badly they need a new site, then lets you build and publish that site from the same dashboard, in one flow.',
  },
  {
    q: 'How quickly can I start finding leads?',
    a: 'Sign up, describe a niche and city, and your first ranked list is ready in under a minute. No setup, no integrations to configure first.',
  },
  {
    q: 'Do businesses actually respond to these leads?',
    a: 'Nova only surfaces businesses with a genuine website gap, so the pitch is grounded in something real instead of a cold guess. Response rates come down to your outreach, but the opening is always warm.',
  },
]

function FaqItem({ item, open, onToggle }) {
  return (
    <div className="border-b border-white/10">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-6 text-left"
      >
        <span className="font-medium text-white">{item.q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-white/40 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <p className="pb-6 pr-8 text-sm leading-relaxed text-white/60">{item.a}</p>}
    </div>
  )
}

export default function FaqSection() {
  // Frozen tenji.ai reference (localhost:8000, 2026-07-21 1:1 pass) renders every FAQ
  // item collapsed on load — no item pre-opened.
  const [openIndex, setOpenIndex] = useState(-1)

  return (
    <section id="faq" className="scroll-mt-24 bg-[#0a0a10] px-8 py-28 text-white">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-bold sm:text-5xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          Have questions? We&rsquo;ve got answers.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/60">
          Here&rsquo;s everything you need to know before using Nova for your agency.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-3xl">
        {FAQS.map((item, i) => (
          <FaqItem key={item.q} item={item} open={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
        ))}
      </div>
    </section>
  )
}
