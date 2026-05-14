'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, ClipboardList, Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Question {
  id: string;
  question: string;
  category: string | null;
  display_order: number;
}

interface AnalysisResult {
  score: number;
  level: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  recommendations: string[];
}

function buildAnalysis(score: number, total: number): AnalysisResult {
  const ratio = total > 0 ? score / total : 0;

  if (ratio <= 0.33) {
    return {
      score,
      level: 'low',
      title: 'Vaše telo je v dobrem ravnotežju',
      message:
        'Glede na vaše odgovore se vaše telo in um zaenkrat dobro spopadata z vsakdanjimi obremenitvami. Še vedno priporočamo redno preventivo za ohranjanje vitalnosti.',
      recommendations: [
        'MotioScan – 3D analiza telesne drže za preventivni vpogled',
        'Posvet in predstavitev (15 min, 9 €) za usmerjeno svetovanje',
        'Iteracare ali manualna terapija za sprostitev in regeneracijo',
      ],
    };
  }

  if (ratio <= 0.66) {
    return {
      score,
      level: 'medium',
      title: 'Vaše telo kaže prve znake preobremenitve',
      message:
        'Vaši odgovori nakazujejo, da telo občuti nekaj kroničnega stresa ali napetosti. Pravočasna obravnava lahko prepreči poslabšanje in vrne ravnotežje.',
      recommendations: [
        'Prvi pregled + meritev s Physio Motio + celovit personaliziran plan',
        'Paket 3 obravnave – usmerjena terapija za sprostitev napetosti',
        'TECAR ali manualna terapija za ciljno obravnavo bolečin',
      ],
    };
  }

  return {
    score,
    level: 'high',
    title: 'Vaše telo potrebuje celostno obravnavo',
    message:
      'Vaši odgovori kažejo na večje število kroničnih obremenitev. Priporočamo celostno obravnavo, ki naslovi vzrok in ne le simptome.',
    recommendations: [
      'Prva posvetovalna obravnava z meritvijo in osebnim planom',
      'Paket 6 ali 9 obravnav za celostno regeneracijo',
      'Univerzum paket – kombinacija MIS, manualne terapije in AO Scan',
    ],
  };
}

export default function VprasalnikPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [gdpr, setGdpr] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    supabase
      .from('questionnaire_questions')
      .select('id, question, category, display_order')
      .eq('active', true)
      .order('display_order', { ascending: true })
      .then(({ data }: { data: Question[] | null }) => {
        if (data) setQuestions(data);
        setLoading(false);
      });

    supabase.auth.getUser().then(({ data: { user } }: { data: { user: any } }) => {
      if (user?.email) setEmail(user.email);
      const meta = user?.user_metadata as any;
      if (meta?.full_name) setFullName(meta.full_name);
    });
  }, []);

  const handleAnswer = (questionId: string, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Vnesite vaš e-poštni naslov.');
      return;
    }
    if (!gdpr) {
      setError('Za nadaljevanje sprejmite pogoje obdelave podatkov (GDPR).');
      return;
    }
    if (Object.keys(answers).length < questions.length) {
      setError('Prosimo, odgovorite na vsa vprašanja.');
      return;
    }

    setSubmitting(true);

    const score = Object.values(answers).filter(Boolean).length;
    const analysis = buildAnalysis(score, questions.length);

    const { data: { user } } = await supabase.auth.getUser();

    const answersPayload = questions.map((q) => ({
      question_id: q.id,
      question: q.question,
      answer: Boolean(answers[q.id]),
    }));

    const { error: insertError } = await supabase
      .from('questionnaire_responses')
      .insert({
        user_id: user?.id ?? null,
        email: email.trim().toLowerCase(),
        full_name: fullName.trim() || null,
        answers: answersPayload,
        score,
        analysis: analysis.title,
        gdpr_consent: true,
      });

    setSubmitting(false);

    if (insertError) {
      setError(`Napaka: ${insertError.message}`);
      return;
    }

    setResult(analysis);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-gray-500">Nalagam vprašalnik...</div>
      </div>
    );
  }

  if (result) {
    const palette =
      result.level === 'low'
        ? 'from-emerald-500 to-emerald-700'
        : result.level === 'medium'
        ? 'from-amber-500 to-orange-600'
        : 'from-rose-500 to-red-600';

    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#00B5AD]/5 to-white pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            <div className={`bg-gradient-to-r ${palette} p-8 text-white`}>
              <div className="flex items-center gap-3 mb-3">
                <Sparkles size={28} />
                <span className="text-sm font-semibold uppercase tracking-[0.2em]">
                  Vaša brezplačna analiza
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{result.title}</h1>
              <p className="text-white/90">
                Rezultat: <strong>{result.score}</strong> / {questions.length} pozitivnih odgovorov
              </p>
            </div>

            <div className="p-8 space-y-8">
              <p className="text-lg text-gray-700 leading-relaxed">{result.message}</p>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Naša priporočila za vas:</h2>
                <ul className="space-y-3">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="text-[#00B5AD] mt-0.5 shrink-0" size={20} />
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/rezervacija"
                  className="flex-1 px-6 py-3 bg-[#00B5AD] hover:bg-[#009891] text-white font-semibold rounded-lg text-center transition-colors flex items-center justify-center gap-2"
                >
                  Rezerviraj termin <ArrowRight size={18} />
                </Link>
                <Link
                  href="/kontakt"
                  className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-900 font-semibold rounded-lg text-center hover:border-[#00B5AD] hover:text-[#00B5AD] transition-colors"
                >
                  Stopi v stik
                </Link>
              </div>

              <p className="text-sm text-gray-500 text-center">
                Vaš vprašalnik je shranjen. Če imate uporabniški račun, ga najdete v razdelku
                <Link href="/dashboard" className="text-[#00B5AD] hover:underline ml-1">
                  Dashboard
                </Link>
                .
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#00B5AD]/5 to-white pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00B5AD]/10 rounded-full border border-[#00B5AD]/30 mb-4">
            <ClipboardList className="text-[#00B5AD]" size={18} />
            <span className="text-sm font-semibold text-[#00B5AD] tracking-wide">
              Brezplačni vprašalnik
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Pridobite brezplačno analizo vašega stanja
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Odgovorite na {questions.length} kratkih vprašanj in v hipu prejmite osebno
            priporočilo, kako naprej. Brez obveznosti.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl p-6 md:p-10 space-y-8"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ime in priimek <span className="text-gray-400 font-normal">(neobvezno)</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B5AD] focus:border-transparent"
                placeholder="Ana Novak"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                E-pošta <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B5AD] focus:border-transparent"
                placeholder="vas@email.si"
              />
            </div>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:border-[#00B5AD]/30 transition-colors"
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00B5AD] text-white text-sm font-bold">
                    {idx + 1}
                  </span>
                  <p className="font-medium text-gray-900 leading-snug pt-1">{q.question}</p>
                </div>
                <div className="flex gap-3 ml-11">
                  <button
                    type="button"
                    onClick={() => handleAnswer(q.id, true)}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                      answers[q.id] === true
                        ? 'bg-[#00B5AD] text-white shadow-md'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-[#00B5AD]'
                    }`}
                  >
                    Da
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAnswer(q.id, false)}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                      answers[q.id] === false
                        ? 'bg-gray-700 text-white shadow-md'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Ne
                  </button>
                </div>
              </div>
            ))}
          </div>

          <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl bg-[#00B5AD]/5 border border-[#00B5AD]/20">
            <input
              type="checkbox"
              checked={gdpr}
              onChange={(e) => setGdpr(e.target.checked)}
              className="mt-1 h-5 w-5 accent-[#00B5AD]"
            />
            <span className="text-sm text-gray-700 leading-relaxed">
              Strinjam se z obdelavo svojih osebnih podatkov za namene priprave brezplačne
              analize in stika s strani ORI 369. Podatki so obravnavani v skladu z GDPR
              in se ne posredujejo tretjim osebam.
            </span>
          </label>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-4 bg-[#00B5AD] hover:bg-[#009891] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? 'Pošiljam...' : 'Pridobi brezplačno analizo'}
            {!submitting && <ArrowRight size={20} />}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
