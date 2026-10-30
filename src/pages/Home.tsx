import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import ComparisonTable, { TypologyRadar } from '../components/ComparisonTable';
import { Globe2, Users, BookMarked, Mic2, ArrowRight } from 'lucide-react';
import { SECTIONS } from '../sections';
import TodayPanel from '../components/TodayPanel';
import { useI18n } from '../i18n/context';

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Home() {
  const { t } = useI18n();
  const h = t.home;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-14">
      <TodayPanel />

      {/* Hero */}
      <motion.section
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-buryat-100 text-buryat-700 text-sm font-medium mb-2">
          <span>ISO 639-3: bua</span>
          <span className="opacity-40">|</span>
          <span>{h.family}</span>
        </div>
        <h1
          lang="bua"
          className="text-5xl sm:text-6xl font-buryat font-bold text-stone-900 leading-tight"
        >
          Буряад хэлэн
        </h1>
        <p className="text-xl text-stone-500 max-w-2xl mx-auto">{h.hero}</p>
      </motion.section>

      {/* Quick stats */}
      <motion.section
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { icon: Users, label: h.stats.speakers, value: '~461 000' },
          { icon: Globe2, label: h.stats.wordOrder, value: 'SOV' },
          { icon: BookMarked, label: h.stats.cases, value: h.stats.casesValue },
          { icon: Mic2, label: h.stats.harmony, value: h.stats.harmonyValue },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="card text-center py-5">
            <Icon size={22} className="mx-auto text-buryat-400 mb-2" />
            <p className="text-xl font-bold text-stone-800">{value}</p>
            <p className="text-xs text-stone-500 mt-0.5">{label}</p>
          </div>
        ))}
      </motion.section>

      {/* Language overview */}
      <motion.section
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.5, delay: 0.15 }}
        className="grid md:grid-cols-2 gap-6"
      >
        <div className="card space-y-3">
          <h2 className="text-lg font-semibold text-stone-800">{h.profileTitle}</h2>
          {h.profile.map(([k, v]) => (
            <div key={k} className="flex gap-2 text-sm">
              <span className="text-stone-500 w-28 shrink-0">{k}</span>
              <span className="text-stone-700">{v}</span>
            </div>
          ))}
        </div>
        <div className="card space-y-3">
          <h2 className="text-lg font-semibold text-stone-800">{h.featuresTitle}</h2>
          <ul className="space-y-2 text-sm text-stone-700">
            {h.features.map(f => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* Navigation cards */}
      <motion.section
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-stone-800 mb-4">{h.explore}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS.filter(s => s.to !== '/').map(({ to, icon: Icon, key }) => (
            <NavLink
              key={to}
              to={to}
              className="card group flex gap-4 items-start hover:shadow-md hover:border-buryat-200 transition-all"
            >
              <span className="shrink-0 rounded-xl bg-buryat-50 text-buryat-600 p-2.5 group-hover:bg-buryat-100 transition-colors">
                <Icon size={22} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1 font-semibold text-stone-800 group-hover:text-buryat-700 transition-colors">
                  {t.sections[key].label}
                  <ArrowRight
                    size={15}
                    aria-hidden="true"
                    className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                  />
                </span>
                <span className="block text-sm text-stone-500 mt-1">{t.sections[key].desc}</span>
              </span>
            </NavLink>
          ))}
        </div>
      </motion.section>

      {/* Comparison */}
      <motion.section
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.5, delay: 0.25 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-stone-800">{h.comparison}</h2>
        <ComparisonTable />
        <TypologyRadar />
      </motion.section>
    </div>
  );
}
