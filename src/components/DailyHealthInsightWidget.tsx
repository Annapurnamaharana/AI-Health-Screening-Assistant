import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sparkles,
  RefreshCw,
  Heart,
  Volume2,
  VolumeX,
  Share2,
  Check,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Activity,
  Flame,
  Droplet,
  Moon,
  Wind,
  Clock,
} from 'lucide-react';
import { HealthInsight, HealthInsightCategory } from '../types';
import { getDailyHealthInsight, getRandomHealthInsight } from '../data/healthInsights';
import { useLanguage } from '../i18n/LanguageContext';

export const DailyHealthInsightWidget: React.FC = () => {
  const [insight, setInsight] = useState<HealthInsight>(() => getDailyHealthInsight());
  const [loading, setLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isHelpful, setIsHelpful] = useState<boolean>(false);
  const [helpfulCount, setHelpfulCount] = useState<number>(42);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [sourceMode, setSourceMode] = useState<'server' | 'local'>('server');
  const { t } = useLanguage();

  // Format today's date for clinical relevance
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  // Fetch from server API with seamless local fallback
  const fetchInsight = useCallback(async (random = false, excludeId?: string) => {
    setLoading(true);
    // Stop any ongoing speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      const url = random
        ? `/api/daily-health-insight?random=true${excludeId ? `&excludeId=${encodeURIComponent(excludeId)}` : ''}`
        : '/api/daily-health-insight';

      const res = await fetch(url);
      if (!res.ok) throw new Error('API server unavailable');
      const data = await res.json();
      if (data && data.insight) {
        setInsight(data.insight);
        setSourceMode('server');
      } else {
        throw new Error('Invalid response structure');
      }
    } catch {
      // Local fallback
      const fallback = random ? getRandomHealthInsight(excludeId) : getDailyHealthInsight();
      setInsight(fallback);
      setSourceMode('local');
    } finally {
      // Smooth animation grace time
      setTimeout(() => {
        setLoading(false);
      }, 250);
    }
  }, []);

  // Fetch upon initial mount / login simulation
  useEffect(() => {
    fetchInsight(false);
    // Check local storage for previous helpful rating
    const savedHelpful = localStorage.getItem(`hp_helpful_${insight.id}`);
    if (savedHelpful === 'true') {
      setIsHelpful(true);
    }
  }, [fetchInsight, insight.id]);

  // Handle Text-to-Speech
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${insight.title}. ${insight.tip} Recommended action: ${insight.actionItem}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Handle Copy to clipboard
  const handleCopy = async () => {
    const text = `💡 Daily Health Insight: ${insight.title}\n\n${insight.tip}\n\n🎯 Action Item: ${insight.actionItem}\n— Aura Health IoT Assistant`;
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  // Toggle helpful status
  const handleToggleHelpful = () => {
    if (isHelpful) {
      setIsHelpful(false);
      setHelpfulCount((prev) => Math.max(0, prev - 1));
      localStorage.removeItem(`hp_helpful_${insight.id}`);
    } else {
      setIsHelpful(true);
      setHelpfulCount((prev) => prev + 1);
      localStorage.setItem(`hp_helpful_${insight.id}`, 'true');
    }
  };

  // Return category styling & icon
  const getCategoryMeta = (cat: HealthInsightCategory) => {
    switch (cat) {
      case 'Cardiovascular':
        return {
          icon: Activity,
          color: 'text-rose-600 dark:text-rose-400',
          bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60',
          badge: 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300',
          link: '/live-dashboard',
          linkText: 'Check Heart Rate',
        };
      case 'Respiratory':
        return {
          icon: Wind,
          color: 'text-cyan-600 dark:text-cyan-400',
          bg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800/60',
          badge: 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300',
          link: '/live-dashboard',
          linkText: 'Verify SpO2 Telemetry',
        };
      case 'Metabolic':
        return {
          icon: Flame,
          color: 'text-amber-600 dark:text-amber-400',
          bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60',
          badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
          link: '/bmi-calculator',
          linkText: 'Calculate Metabolic BMI',
        };
      case 'Sleep & Recovery':
        return {
          icon: Moon,
          color: 'text-indigo-600 dark:text-indigo-400',
          bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60',
          badge: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300',
          link: '/health-screening',
          linkText: 'Run Health Screening',
        };
      case 'Hydration & Nutrition':
        return {
          icon: Droplet,
          color: 'text-teal-600 dark:text-teal-400',
          bg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800/60',
          badge: 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300',
          link: '/disease-library',
          linkText: 'View Disease Library',
        };
      case 'Vital Signs & Telemetry':
        return {
          icon: Stethoscope,
          color: 'text-emerald-600 dark:text-emerald-400',
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60',
          badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
          link: '/live-dashboard',
          linkText: 'Explore IoT Telemetry',
        };
      case 'Stress Management':
      default:
        return {
          icon: Heart,
          color: 'text-purple-600 dark:text-purple-400',
          bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/60',
          badge: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300',
          link: '/health-screening',
          linkText: 'AI Stress Evaluation',
        };
    }
  };

  const meta = getCategoryMeta(insight.category);
  const CategoryIcon = meta.icon;

  return (
    <div
      id="daily-health-insight-widget"
      className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all duration-300"
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 dark:bg-cyan-500/5 blur-3xl pointer-events-none rounded-full" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400 border border-blue-200/60 dark:border-cyan-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {t('home.dailyHealthInsight', 'Daily Health Insight')}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold bg-blue-100/80 dark:bg-cyan-950/60 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-cyan-800">
                {sourceMode === 'server' ? 'Live Telemetry API' : 'Medical Archive'}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{todayFormatted}</span>
              <span>•</span>
              <span>{insight.readTime}</span>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {/* Read Aloud button */}
          {'speechSynthesis' in window && (
            <button
              type="button"
              onClick={toggleSpeech}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isSpeaking ? 'Stop listening' : 'Listen to insight'}
              aria-label="Listen to Health Insight"
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="hidden md:inline text-[11px]">{isSpeaking ? 'Stop' : t('common.listen', 'Listen')}</span>
            </button>
          )}

          {/* Copy Tip button */}
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1"
            title="Copy insight"
            aria-label="Copy Health Insight"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden md:inline text-[11px]">{isCopied ? 'Copied' : t('common.share', 'Share')}</span>
          </button>

          {/* Fetch New Randomized Insight button */}
          <button
            type="button"
            onClick={() => fetchInsight(true, insight.id)}
            disabled={loading}
            className="px-3 py-2 rounded-xl bg-blue-50 dark:bg-cyan-500/10 hover:bg-blue-100 dark:hover:bg-cyan-500/20 border border-blue-200 dark:border-cyan-500/30 text-blue-700 dark:text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Fetch another randomized tip"
            aria-label="Shuffle Health Insight"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{t('home.newInsight', 'New Insight')}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`mt-5 transition-opacity duration-200 ${loading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
          {/* Left: Tip details */}
          <div className="space-y-3.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${meta.badge}`}>
                <CategoryIcon className="w-3.5 h-3.5" />
                <span>{insight.category}</span>
              </span>

              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                {insight.relatedVital}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
              {insight.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {insight.tip}
            </p>

            {/* Actionable Takeaway Callout */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  {t('home.recommendedPractice', "Today's Recommended Practice:")}
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-normal">
                  {insight.actionItem}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Quick Action & Reaction Card */}
          <div className="w-full lg:w-72 shrink-0 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                {t('home.evidenceSource', 'Evidence Source')}
              </span>
              <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300 leading-tight">
                {insight.evidenceSource}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2">
              <NavLink
                to={meta.link}
                className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-between shadow-xs transition-colors"
              >
                <span>{meta.linkText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </NavLink>

              <button
                type="button"
                onClick={handleToggleHelpful}
                className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isHelpful
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Mark this tip as helpful"
                aria-label="Mark tip as helpful"
              >
                <Heart className={`w-3.5 h-3.5 ${isHelpful ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isHelpful ? t('home.markedHelpful', 'Marked as Helpful') : t('home.helpfulInsight', 'Helpful Insight')}</span>
                <span className="text-[10px] font-mono opacity-80">({helpfulCount})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
