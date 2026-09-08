import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sun,
  CloudRain,
  Zap,
  ArrowRight,
  Sparkles,
  BarChart3,
  Layers,
  IndianRupee,
  MapPin,
  Droplets,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-orange-300 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sun className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <span className="text-2xl font-black tracking-tight text-white font-['Outfit',sans-serif]">
              Sun<span className="text-amber-400">Track</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                लॉग इन
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="solar" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                निःशुल्क शुरू करें
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-orange-500/8 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>भारत का स्मार्ट सोलर पैनल क्लीनिंग शेड्यूलर</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-['Outfit',sans-serif] leading-tight">
            जानें कब धोएँ अपने{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500 bg-clip-text text-transparent">
              सोलर पैनल
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            SunTrack स्थानीय मौसम पूर्वानुमान, वर्षा संभावना, धूल संचय और शुष्क दिनों का विश्लेषण
            करके बताता है — अभी साफ करें, या बारिश का इंतज़ार करें। बिजली उत्पादन में ₹ की बचत करें।
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="solar" size="lg" className="w-full sm:w-auto text-base">
                लाइव डेमो आज़माएं →
              </Button>
            </Link>
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base">
                निःशुल्क खाता बनाएं
              </Button>
            </Link>
          </div>

          {/* Indian-context Quick Stats */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
              <span className="block text-[10px] uppercase text-slate-400 font-semibold">औसत दक्षता हानि</span>
              <span className="text-xl font-bold text-amber-400 font-['Outfit',sans-serif]">15% – 25%</span>
            </div>
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
              <span className="block text-[10px] uppercase text-slate-400 font-semibold">पानी बचत</span>
              <span className="text-xl font-bold text-sky-400 font-['Outfit',sans-serif]">~150 लीटर/धुलाई</span>
            </div>
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
              <span className="block text-[10px] uppercase text-slate-400 font-semibold">निर्णय इंजन</span>
              <span className="text-xl font-bold text-emerald-400 font-['Outfit',sans-serif]">100% व्याख्येय</span>
            </div>
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
              <span className="block text-[10px] uppercase text-slate-400 font-semibold">लाइव पूर्वानुमान</span>
              <span className="text-xl font-bold text-slate-200 font-['Outfit',sans-serif]">5-दिन मौसम</span>
            </div>
          </div>
        </div>
      </section>

      {/* Indian Solar Context Banner */}
      <section className="py-8 px-6 bg-gradient-to-r from-amber-950/30 via-slate-900/60 to-orange-950/30 border-t border-amber-500/10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-amber-300 font-['Outfit',sans-serif]">
              भारत के शीर्ष सौर राज्यों के लिए अनुकूलित
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              राजस्थान, गुजरात, महाराष्ट्र, तेलंगाना, तमिलनाडु और आंध्र प्रदेश जैसे उच्च-विकिरण राज्यों के लिए
              विशेष रूप से कैलिब्रेटेड। मानसून पूर्व और पश्चात धूल चक्र को ध्यान में रखा गया है।
            </p>
          </div>
          <div className="flex items-center gap-6 shrink-0 text-xs text-slate-400">
            <div className="text-center">
              <span className="block text-lg font-bold text-amber-400 font-['Outfit',sans-serif]">750+</span>
              <span>GW लक्ष्य 2030</span>
            </div>
            <div className="text-center">
              <span className="block text-lg font-bold text-emerald-400 font-['Outfit',sans-serif]">₹8–10</span>
              <span>प्रति यूनिट बचत</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 px-6 bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit',sans-serif]">
              स्मार्ट सौर बुद्धिमत्ता के लिए निर्मित
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              मौसम विज्ञान और सौर इंजीनियरिंग के सिद्धांतों को मिलाकर आपके फोटोवोल्टाइक निवेश की सुरक्षा करें।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3 bg-slate-900/50 hover:border-sky-500/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <CloudRain className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                72-घंटे वर्षा पूर्वानुमान
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                अनावश्यक सफाई रोकता है। यदि 72 घंटों में &gt;60% संभावना से &gt;5mm वर्षा आने वाली
                है, तो इंजन <strong className="text-sky-300">WAIT_FOR_RAIN</strong> का संकेत देता है।
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-slate-900/50 hover:border-amber-500/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                धूल संचय गणितीय मॉडल
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                लगातार शुष्क दिन, झुकाव कोण, हवा की गति और आर्द्रता — सब कुछ मापा जाता है।
                कोई black-box अनुमान नहीं, पूरी तरह पारदर्शी सूत्र।
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-slate-900/50 hover:border-emerald-500/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <IndianRupee className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                ₹ ROI ट्रैकर
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                हर सफाई लॉग करें, पानी और मज़दूरी का खर्च ट्रैक करें, और जीवनभर
                में बचाई गई बिजली का ₹ मूल्य देखें।
              </p>
            </Card>
          </div>

          {/* Secondary feature row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-3 bg-slate-900/50 hover:border-rose-500/20 transition-colors flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white font-['Outfit',sans-serif]">
                  दक्षता इतिहास चार्ट
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  इंटरैक्टिव Recharts ग्राफ़ — पिछले 30 दिनों का दक्षता क्षरण और
                  अगले 7 दिनों का प्रोजेक्शन एक साथ।
                </p>
              </div>
            </Card>

            <Card className="p-6 space-y-3 bg-slate-900/50 hover:border-purple-500/20 transition-colors flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0 mt-0.5">
                <Droplets className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white font-['Outfit',sans-serif]">
                  मानसून-स्मार्ट शेड्यूलिंग
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  भारतीय मानसून सीज़न में प्राकृतिक वर्षा से पैनल की सफाई को
                  ट्रैक करें — पानी और मेहनत दोनों बचाएं।
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Decision Tree Showcase */}
      <section className="py-16 px-6 bg-slate-900/30 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-['Outfit',sans-serif]">
                निर्धारक निर्णय अवस्थाएं
              </h3>
              <p className="text-xs text-slate-400">
                SunTrack इंजन प्रत्येक सौर स्थापना के लिए यह 4 अवस्थाएं लागू करता है:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 space-y-1.5 hover:border-rose-500/50 transition-colors">
              <div className="font-bold text-rose-400 uppercase text-[11px] tracking-wide">🔴 CLEAN_NOW</div>
              <p className="text-slate-300">हानि ≥ 15%, लंबे समय से शुष्क मौसम। आज ही सफाई करें — उत्पादन तुरंत बढ़ेगा।</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1.5 hover:border-amber-500/50 transition-colors">
              <div className="font-bold text-amber-400 uppercase text-[11px] tracking-wide">🟡 CLEAN_SOON</div>
              <p className="text-slate-300">हानि 8–15%, 3+ दिन शुष्क पूर्वानुमान। अगले सप्ताहांत सफाई की योजना बनाएं।</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-sky-500/30 space-y-1.5 hover:border-sky-500/50 transition-colors">
              <div className="font-bold text-sky-400 uppercase text-[11px] tracking-wide">🔵 WAIT_FOR_RAIN</div>
              <p className="text-slate-300">72 घंटों में ≥60% वर्षा संभावना। पानी और मज़दूरी बचाएं, प्रकृति को काम करने दें।</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1.5 hover:border-emerald-500/50 transition-colors">
              <div className="font-bold text-emerald-400 uppercase text-[11px] tracking-wide">🟢 NO_ACTION</div>
              <p className="text-slate-300">पैनल हाल ही में साफ हुए या &gt;92% स्वास्थ्य सूचकांक पर चल रहे हैं।</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 px-6 py-8 text-center text-xs text-slate-500 space-y-2">
        <p>© 2026 SunTrack — Solar Panel Cleaning &amp; Maintenance Scheduler | भारत के लिए निर्मित 🇮🇳</p>
        <p className="max-w-xl mx-auto text-[11px] text-slate-400">
          अस्वीकरण: यह एक गणितीय सॉफ्टवेयर अनुमान मॉडल है जो मौसम संबंधी टेलीमेट्री पर आधारित है।
          यह एक शैक्षणिक Capstone परियोजना के रूप में विकसित किया गया है।
        </p>
      </footer>
    </div>
  );
};
