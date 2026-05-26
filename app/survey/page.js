'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'

const QUESTIONS = [
  {
    id: 'healthcare',
    topic: 'Healthcare',
    question: 'The federal government should play a larger role in ensuring Americans have access to healthcare coverage.',
    icon: '🏥',
  },
  {
    id: 'climate',
    topic: 'Climate & Energy',
    question: 'Environmental regulations on energy production and emissions should be strengthened, even if it increases costs for businesses.',
    icon: '🌍',
  },
  {
    id: 'taxes',
    topic: 'Taxation',
    question: 'The current tax system places too much burden on middle and lower income Americans relative to the wealthy.',
    icon: '💰',
  },
  {
    id: 'immigration',
    topic: 'Immigration',
    question: 'U.S. immigration policy should prioritize increasing legal pathways over stricter border enforcement.',
    icon: '🗽',
  },
  {
    id: 'guns',
    topic: 'Gun Policy',
    question: 'The right to own firearms should be preserved, with minimal additional federal restrictions beyond current law.',
    icon: '⚖️',
  },
  {
    id: 'education',
    topic: 'Education',
    question: 'Federal funding and oversight of public education should be increased to reduce inequality between school districts.',
    icon: '🎓',
  },
  {
    id: 'defense',
    topic: 'Defense & Foreign Policy',
    question: 'Maintaining a strong military and active global presence is essential to protecting American interests abroad.',
    icon: '🛡️',
  },
  {
    id: 'economy',
    topic: 'Economy',
    question: 'Free markets with limited government intervention produce better economic outcomes than heavily regulated ones.',
    icon: '📈',
  },
  {
    id: 'social',
    topic: 'Social Programs',
    question: 'Federal spending on social safety net programs like Medicare and Social Security should be maintained or expanded.',
    icon: '🤝',
  },
  {
    id: 'criminal',
    topic: 'Criminal Justice',
    question: 'Reducing incarceration rates and reforming sentencing guidelines should be a federal priority.',
    icon: '🏛️',
  },
  {
    id: 'ai',
    topic: 'Artificial Intelligence',
    question: 'The federal government should take an active role in regulating how artificial intelligence is developed and used.',
    icon: '🤖',
  },
  {
    id: 'partisanship',
    topic: 'Party Partisanship',
    question: 'Elected officials should be willing to compromise across party lines, even if it means moving away from their party\'s platform.',
    icon: '🤝',
  },
  {
    id: 'domestic',
    topic: 'Domestic Policy',
    question: 'The U.S. should reduce foreign aid spending and redirect those funds toward domestic needs like infrastructure and housing.',
    icon: '🏗️',
  },
  {
    id: 'country',
    topic: 'State of the Country',
    question: 'The policies of the current federal government are moving the country in the wrong direction.',
    icon: '🇺🇸',
  },
  {
    id: 'termlimits',
    topic: 'Term Limits',
    question: 'Members of Congress should be subject to term limits to prevent career politicians from holding office indefinitely.',
    icon: '⏳',
  },
]

const SCALE = [
  { value: 2, label: 'Strongly Agree' },
  { value: 1, label: 'Agree' },
  { value: 0, label: 'Neutral' },
  { value: -1, label: 'Disagree' },
  { value: -2, label: 'Strongly Disagree' },
]

const MEMBER_POSITIONS = {
  healthcare: { D: 1.8, R: -1.6, I: 1.9 },
  climate: { D: 1.7, R: -1.5, I: 1.8 },
  taxes: { D: 1.5, R: -1.7, I: 1.6 },
  immigration: { D: 1.4, R: -1.6, I: 1.3 },
  guns: { D: -1.4, R: 1.6, I: -1.2 },
  education: { D: 1.7, R: -1.3, I: 1.6 },
  defense: { D: -0.5, R: 1.6, I: -0.8 },
  economy: { D: -1.4, R: 1.7, I: -1.5 },
  social: { D: 1.8, R: -1.5, I: 1.9 },
  criminal: { D: 1.6, R: -1.2, I: 1.7 },
  ai: { D: 1.5, R: -0.8, I: 1.2 },
  partisanship: { D: 0.8, R: -1.2, I: 1.9 },
  domestic: { D: -0.6, R: 1.4, I: 0.8 },
  country: { D: -1.2, R: 1.0, I: 1.5 },
  termlimits: { D: -0.5, R: 1.3, I: 1.6 },
}

const FEATURED_MEMBERS = [
  { bioguideId: 'S001217', name: 'Rick Scott', state: 'FL', party: 'R', partyName: 'Republican' },
  { bioguideId: 'M001244', name: 'Ashley Moody', state: 'FL', party: 'R', partyName: 'Republican' },
  { bioguideId: 'W000817', name: 'Elizabeth Warren', state: 'MA', party: 'D', partyName: 'Democrat' },
  { bioguideId: 'S000033', name: 'Bernie Sanders', state: 'VT', party: 'I', partyName: 'Independent' },
  { bioguideId: 'C001098', name: 'Ted Cruz', state: 'TX', party: 'R', partyName: 'Republican' },
  { bioguideId: 'M000355', name: 'Mitch McConnell', state: 'KY', party: 'R', partyName: 'Republican' },
  { bioguideId: 'S000148', name: 'Chuck Schumer', state: 'NY', party: 'D', partyName: 'Democrat' },
  { bioguideId: 'K000367', name: 'Amy Klobuchar', state: 'MN', party: 'D', partyName: 'Democrat' },
  { bioguideId: 'P000603', name: 'Rand Paul', state: 'KY', party: 'R', partyName: 'Republican' },
  { bioguideId: 'W000805', name: 'Mark Warner', state: 'VA', party: 'D', partyName: 'Democrat' },
]

function scoreAlignment(answers) {
  return FEATURED_MEMBERS.map(member => {
    let totalScore = 0
    let maxScore = 0
    QUESTIONS.forEach(q => {
      const userAnswer = answers[q.id] ?? 0
      const partyPosition = MEMBER_POSITIONS[q.id][member.party] ?? 0
      const diff = Math.abs(userAnswer - partyPosition)
      const score = ((4 - diff) / 4) * 100
      totalScore += score
      maxScore += 100
    })
    return {
      ...member,
      alignment: Math.round((totalScore / maxScore) * 100),
    }
  }).sort((a, b) => b.alignment - a.alignment)
}

const PARTY_COLORS = {
  R: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
  D: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
  I: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100' },
}

export default function SurveyPage() {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [started, setStarted] = useState(false)

  function handleAnswer(value) {
    const newAnswers = { ...answers, [QUESTIONS[currentQ].id]: value }
    setAnswers(newAnswers)
    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(q => q + 1), 300)
    } else {
      setResults(scoreAlignment(newAnswers))
    }
  }

  function restart() {
    setCurrentQ(0)
    setAnswers({})
    setResults(null)
    setRevealed(false)
    setStarted(false)
  }

  const progress = ((currentQ + (answers[QUESTIONS[currentQ]?.id] !== undefined ? 1 : 0)) / QUESTIONS.length) * 100

  if (!started) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 pt-28 pb-20 text-center">
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-revela-blue bg-revela-blue-light px-4 py-2 rounded-full mb-6">
            Voter Values Survey
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-revela-navy mb-4">
            Who do you actually align with?
          </h1>
          <p className="text-gray-500 text-lg mb-6 leading-relaxed">
            Answer 15 questions on the issues that matter most to you. We'll match you to the Congress members whose voting records best reflect your values — no party labels until the reveal.
          </p>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 text-left space-y-3">
            {[
              '15 neutral, nonpartisan questions',
              'Matched to real congressional voting records',
              'No party labels until the final reveal',
              'Takes about 3 minutes',
            ].map(item => (
              <div key={item} className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-5 h-5 rounded-full bg-revela-blue-light flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
                {item}
              </div>
            ))}
          </div>
          <button
            onClick={() => setStarted(true)}
            className="bg-revela-blue text-white px-8 py-4 rounded-xl text-base font-medium hover:bg-revela-blue-dark transition-colors"
          >
            Start the survey →
          </button>
          <p className="text-xs text-gray-400 mt-4">Your answers are never stored or shared.</p>
        </div>
      </main>
    )
  }

  if (results) {
    const top3 = results.slice(0, 3)
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 pt-28 pb-20">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-medium tracking-widest uppercase text-revela-blue bg-revela-blue-light px-4 py-2 rounded-full mb-4">
              Your Results
            </span>
            <h1 className="font-display text-4xl font-bold text-revela-navy mb-3">
              {revealed ? 'Your top matches' : 'Ready for the reveal?'}
            </h1>
            <p className="text-gray-500">
              {revealed
                ? 'Based on your answers, these Congress members align most with your values.'
                : "We've matched you to 3 Congress members. Tap reveal to see who they are."}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {top3.map((member, i) => {
              const party = PARTY_COLORS[member.party]
              return (
                <div key={member.bioguideId} className="bg-white border border-gray-100 rounded-2xl p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden shrink-0">
                      {revealed ? (
                        <img
                          src={`https://bioguide.congress.gov/bioguide/photo/${member.bioguideId[0]}/${member.bioguideId}.jpg`}
                          className="w-full h-full object-cover"
                          onError={e => { e.target.style.display = 'none' }}
                          alt={member.name}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-200">#{i + 1}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      {revealed ? (
                        <>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-revela-navy">{member.name}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${party.bg} ${party.text} ${party.border}`}>
                              {member.partyName}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">{member.state} · U.S. Senator</p>
                        </>
                      ) : (
                        <div className="h-4 bg-gray-100 rounded w-32 mb-2 animate-pulse" />
                      )}
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-400">Alignment</span>
                          <span className="text-sm font-bold text-revela-blue">{member.alignment}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-revela-blue rounded-full transition-all duration-700"
                            style={{ width: `${member.alignment}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {revealed && (
                    <div className="mt-3 pt-3 border-t border-gray-50">
                      <Link href={`/congress/${member.bioguideId}`} className="text-sm text-revela-blue hover:underline">
                        View full profile & voting record →
                      </Link>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="w-full bg-revela-blue text-white py-4 rounded-xl text-base font-medium hover:bg-revela-blue-dark transition-colors mb-4"
            >
              Reveal my matches →
            </button>
          ) : (
            <div className="bg-revela-blue-light border border-revela-blue/20 rounded-2xl p-5 mb-6 text-center">
              <p className="text-sm text-revela-navy mb-3">Surprised by your results? Explore all 535 Congress members and their full voting records.</p>
              <Link
                href="/congress"
                className="inline-block text-sm font-medium text-white bg-revela-blue px-6 py-2.5 rounded-lg hover:bg-revela-blue-dark transition-colors"
              >
                Browse Congress directory →
              </Link>
            </div>
          )}

          <button
            onClick={restart}
            className="w-full border border-gray-200 text-gray-500 py-3 rounded-xl text-sm hover:border-revela-blue hover:text-revela-blue transition-colors"
          >
            Retake the survey
          </button>
        </div>
      </main>
    )
  }

  const q = QUESTIONS[currentQ]
  const selectedAnswer = answers[q.id]

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 pt-28 pb-20">

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400">Question {currentQ + 1} of {QUESTIONS.length}</span>
            <span className="text-xs text-gray-400">{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-revela-blue rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-6">
          <div className="text-3xl mb-4">{q.icon}</div>
          <span className="text-xs font-medium tracking-widest uppercase text-revela-blue">{q.topic}</span>
          <h2 className="font-display text-2xl font-bold text-revela-navy mt-2 mb-8 leading-snug">
            {q.question}
          </h2>
          <div className="space-y-3">
            {SCALE.map(option => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full text-left px-5 py-3.5 rounded-xl border text-sm font-medium transition-all ${
                  selectedAnswer === option.value
                    ? 'border-revela-blue bg-revela-blue-light text-revela-blue'
                    : 'border-gray-100 bg-white text-gray-600 hover:border-revela-blue/40 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
            disabled={currentQ === 0}
            className="text-sm text-gray-400 hover:text-revela-navy transition-colors disabled:opacity-30"
          >
            ← Previous
          </button>
          {selectedAnswer !== undefined && currentQ < QUESTIONS.length - 1 && (
            <button
              onClick={() => setCurrentQ(q => q + 1)}
              className="text-sm text-revela-blue hover:underline"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
