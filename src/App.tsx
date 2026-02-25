/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Mail,
  MapPin,
  Globe,
  MessageCircle,
  Instagram,
  ChefHat,
  ShoppingBag,
  Info,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// --- Types ---

interface Course {
  id: string;
  title: string;
  subtitle: string;
  difficulty: number;
  description: string;
  image: string;
  lessons: string[];
}

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  weight: string;
  ingredients: string;
  images: string[];
  preorderEnd: string;
  pickupStart: string;
  pickupEnd: string;
  pickupTime: string;
  tag: string;
}

const PREORDER_PRODUCTS: Product[] = [
  {
    id: 'peanut-nougat',
    title: '花生牛軋糖',
    price: 650,
    originalPrice: 680,
    weight: '500g±5g (一袋2盒)',
    ingredients: '花生、水貽、糖、奶粉、奶油、蛋、海鹽。',
    images: [
      'https://picsum.photos/seed/nougat1/800/800',
      'https://picsum.photos/seed/nougat2/800/800',
      'https://picsum.photos/seed/nougat3/800/800'
    ],
    preorderEnd: '115/02/01',
    pickupStart: '115/02/09',
    pickupEnd: '115/02/12',
    pickupTime: '16:00-18:00',
    tag: '春節限定 • 限量預購'
  },
  {
    id: 'log-cake',
    title: '樹幹蛋糕',
    price: 780,
    weight: '600g±5g (一袋5片)',
    ingredients: '水貽、糖、牛奶、奶油、蛋、海鹽。',
    images: [
      'https://picsum.photos/seed/logcake1/800/800',
      'https://picsum.photos/seed/logcake2/800/800',
      'https://picsum.photos/seed/logcake3/800/800'
    ],
    preorderEnd: '115/03/01',
    pickupStart: '115/02/09',
    pickupEnd: '115/03/01',
    pickupTime: '16:00-18:00',
    tag: '人氣推薦 • 限量預訂'
  },
  {
    id: 'cookie-gift-box',
    title: '經典手工餅乾禮盒',
    price: 520,
    weight: '450g±5g (一盒)',
    ingredients: '麵粉、奶油、糖、蛋、可可粉、抹茶粉、堅果。',
    images: [
      'https://picsum.photos/seed/cookies1/800/800',
      'https://picsum.photos/seed/cookies2/800/800',
      'https://picsum.photos/seed/cookies3/800/800'
    ],
    preorderEnd: '115/04/01',
    pickupStart: '115/03/15',
    pickupEnd: '115/04/01',
    pickupTime: '16:00-18:00',
    tag: '常態供應 • 預約製作'
  }
];

const COURSES: Course[] = [
  {
    id: 'sponge-cake',
    title: '基礎海綿蛋糕研修班',
    subtitle: '獻給烘焙新手的第一堂課',
    difficulty: 1,
    description: '如果你是烘焙新手，想要初踏入烘焙大門！不妨從橙工房經典的基礎課程開啟吧！為期 4 堂課程，幫您重新建立基礎蛋糕理論。探討甜點界最精深的學問：磅蛋糕、戚風蛋糕、海綿蛋糕、蛋糕捲。',
    image: 'https://picsum.photos/seed/bakery-cake/800/600',
    lessons: ['老奶奶檸檬磅蛋糕', '輕甜芋香海綿蛋糕', '唐寧伯爵奶茶生乳捲', '鹽漬櫻花紅豆抹茶戚風']
  },
  {
    id: 'tart-pastry',
    title: '基礎塔類甜點研修班',
    subtitle: '融會貫通塔派知識',
    difficulty: 1,
    description: '建構式系統化教學：甜酥、沙布列、油酥、酥脆麵團。再也不會塔、派傻傻分不清！為期 4 堂課程，帶你融會貫通塔派知識。',
    image: 'https://picsum.photos/seed/bakery-pastry/800/600',
    lessons: ['香烤蜂蜜乳酪葡萄柚塔', '青檸蘿勒檸檬字母塔', '法式杏仁生巧克力塔', '法式肉桂杏仁蘋果塔']
  },
  {
    id: 'dreamy-cookies',
    title: '夢幻餅乾研修班',
    subtitle: '油、糖、粉的比例運用',
    difficulty: 2,
    description: '餅乾雖常被視為烘焙入門，但光是「油、糖、粉」的比例運用，就有千萬種變化。餅乾研修的 3 堂課，包含各 5-7 種餅乾，帶你進入夢幻世界。',
    image: 'https://picsum.photos/seed/bakery-cookies/800/600',
    lessons: ['古早味台灣餅乾盒', '許願餅乾盒', '小花圈餅乾盒']
  },
  {
    id: 'bread-master',
    title: '手工麵包大師班',
    subtitle: '掌握發酵與揉捏的藝術',
    difficulty: 3,
    description: '深入探討歐式麵包與日式軟麵包的差異，從菌種培養到烘烤出爐，完整掌握麵包靈魂。',
    image: 'https://picsum.photos/seed/bakery-bread/800/600',
    lessons: ['低溫熟成法國長棍', '日式生吐司', '手作肉桂捲', '天然酵母鄉村麵包']
  }
];

// --- Components ---

const CourseDetailPage = ({ course, onBack }: { course: Course, onBack: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-4xl mx-auto py-12 px-6"
  >
    <button 
      onClick={onBack}
      className="mb-8 flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors text-sm font-medium"
    >
      <ArrowRight className="w-4 h-4 rotate-180" />
      返回課程列表
    </button>

    <div className="space-y-12">
      <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 md:p-12">
          <p className="text-orange-400 font-bold tracking-widest uppercase text-sm mb-2">{course.subtitle}</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{course.title}</h1>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <span>難易度</span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={cn("text-lg", i < course.difficulty ? "text-orange-400" : "text-white/20")}>★</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 border-l-4 border-orange-500 pl-4">課程介紹</h2>
            <p className="text-slate-600 leading-relaxed text-lg">{course.description}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-l-4 border-orange-500 pl-4">系列課程內容</h2>
            <div className="space-y-4">
              {course.lessons.map((lesson, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center font-bold shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-slate-800 font-medium">{lesson}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-orange-50 rounded-3xl p-8 border border-orange-100 sticky top-24">
            <h3 className="text-xl font-bold text-slate-900 mb-4">立即報名</h3>
            <p className="text-sm text-slate-600 mb-6">加入橙工房，開啟您的烘焙之旅。專業師資手把手教學，保證學會不失敗。</p>
            <a 
              href="https://line.me/R/ti/p/@846vdklj" 
              target="_blank" 
              rel="noreferrer"
              className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              預約課程 (Line)
            </a>
            <div className="mt-4 text-center">
              <p className="text-[10px] text-slate-400">或連繫：citruslife@yahoo.com.tw</p>
            </div>
            <div className="mt-6 pt-6 border-t border-orange-200 space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-orange-500" />
                包含所有食材與工具
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-orange-500" />
                課後成品可帶回分享
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-orange-500" />
                提供詳細配方講義
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const PreorderPage = () => {
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  
  const product = PREORDER_PRODUCTS[activeProductIndex];

  const nextProduct = () => {
    setActiveProductIndex((prev) => (prev + 1) % PREORDER_PRODUCTS.length);
  };

  const prevProduct = () => {
    setActiveProductIndex((prev) => (prev - 1 + PREORDER_PRODUCTS.length) % PREORDER_PRODUCTS.length);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto py-8 md:py-16 px-4 md:px-8"
    >
      {/* Product Selector - Horizontal Scroll on Mobile */}
      <div className="flex overflow-x-auto pb-4 mb-12 gap-3 no-scrollbar md:justify-center">
        {PREORDER_PRODUCTS.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => {
              setActiveProductIndex(idx);
            }}
            className={cn(
              "whitespace-nowrap px-6 py-3 rounded-full text-sm font-bold transition-all shrink-0",
              activeProductIndex === idx 
                ? "bg-orange-500 text-white shadow-lg shadow-orange-200" 
                : "bg-white text-slate-500 border border-slate-200 hover:border-orange-300"
            )}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
        {/* Product Image Carousel */}
        <div className="space-y-6">
          <div className="relative aspect-square rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl border border-slate-100 group">
            <AnimatePresence mode="wait">
              <motion.img 
                key={product.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                src={product.images[0]} 
                alt={product.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            
            <button 
              onClick={prevProduct}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-800 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextProduct}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-800 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {PREORDER_PRODUCTS.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveProductIndex(i)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    activeProductIndex === i ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"
                  )} 
                />
              ))}
            </div>
          </div>
          <p className="text-[10px] md:text-xs text-slate-400 text-center italic">*照片包裝僅供參考，實際以現場為準。</p>
        </div>

        {/* Product Info */}
        <div className="space-y-8 md:space-y-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                {product.tag}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">{product.title}</h1>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-2xl md:text-4xl font-bold text-orange-600">NT ${product.price}</span>
                {product.originalPrice && (
                  <span className="text-base md:text-xl text-slate-400 line-through">NT ${product.originalPrice}</span>
                )}
                <span className="ml-2 text-[10px] md:text-sm font-bold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">嘗鮮價</span>
              </div>

              <div className="space-y-8">
                <section className="space-y-4">
                  <h2 className="text-xs md:text-sm font-bold text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Info className="w-4 h-4 text-orange-500" />
                    產品說明
                  </h2>
                  <ul className="space-y-4 text-slate-600 text-sm leading-relaxed">
                    <li className="flex justify-between items-center border-b border-slate-50 pb-3">
                      <span className="font-semibold text-slate-400">重量</span>
                      <span className="font-medium">{product.weight}</span>
                    </li>
                    <li className="flex justify-between items-start border-b border-slate-50 pb-3">
                      <span className="font-semibold text-slate-400 shrink-0">成分</span>
                      <span className="text-right font-medium max-w-[200px] md:max-w-none">{product.ingredients}</span>
                    </li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xs md:text-sm font-bold text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Clock className="w-4 h-4 text-orange-500" />
                    訂購方法
                  </h2>
                  <div className="bg-slate-50 rounded-[32px] p-6 md:p-8 space-y-5 text-sm text-slate-600 leading-relaxed">
                    <p className="font-bold text-slate-900">採用「預約制」訂購：</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">預訂時間</p>
                        <p className="font-medium">即日起開放至 <span className="text-orange-600 font-bold">{product.preorderEnd}</span></p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">取貨時間</p>
                        <p className="font-medium"><span className="text-orange-600 font-bold">{product.pickupStart} - {product.pickupEnd}</span></p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">取貨時段</p>
                        <p className="font-medium">{product.pickupTime}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">取貨地點</p>
                        <p className="font-medium">至工作房領取</p>
                      </div>
                    </div>
                    <p className="text-xs text-orange-500 font-bold bg-orange-50 inline-block px-3 py-1 rounded-full">* 數量不多，訂完為止</p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xs md:text-sm font-bold text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-slate-100 pb-3">
                    <User className="w-4 h-4 text-orange-500" />
                    如何下單
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500 mb-6">請私訊官方 LINE 或 FB message 並提供以下資訊：</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[
                      { label: '數量', desc: '要多少數量(幾袋)?' },
                      { label: '時間', desc: '您的取貨時間?' },
                      { label: '聯絡資訊', desc: '姓名與電話' }
                    ].map((item, i) => (
                      <div key={i} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-[10px] font-bold text-orange-500 uppercase mb-1.5 tracking-wider">{item.label}</p>
                        <p className="text-xs text-slate-700 font-bold">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href="https://line.me/R/ti/p/@846vdklj" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex-1 py-4 bg-green-500 text-white rounded-2xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Line 私訊訂購
                    </a>
                    <a 
                      href="https://www.facebook.com/profile.php?id=100069034187651" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      <span className="font-bold">FB</span>
                      私訊訂購
                    </a>
                  </div>
                </section>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const Header = ({ onViewChange, currentView }: { onViewChange: (view: 'preorder' | 'courses' | 'course-detail') => void, currentView: string }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: '教學課程', view: 'courses' as const },
    { label: '產品預購', view: 'preorder' as const },
    { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100069034187651' },
    { label: 'Instagram', href: 'https://www.instagram.com/citruslin2011' },
    { label: '部落格', href: 'https://citrus-cxi.blogspot.com/' },
  ];

  const handleNavClick = (view?: 'preorder' | 'courses' | 'course-detail', href?: string) => {
    if (view) onViewChange(view);
    if (href) window.open(href, '_blank');
    setIsMenuOpen(false);
  };

  return (
    <header className="py-4 md:py-6 px-4 md:px-8 border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleNavClick('courses')}>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-slate-100">
            <img 
              src="https://picsum.photos/seed/citrus-logo/200/200" 
              alt="澄工房 Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900">澄工房</h1>
          </div>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <button 
              key={link.label}
              onClick={() => handleNavClick(link.view, link.href)}
              className={cn(
                "text-sm font-bold transition-colors", 
                link.view === currentView ? "text-orange-600" : "text-slate-600 hover:text-orange-600"
              )}
            >
              {link.label}
            </button>
          ))}
          <a href="https://line.me/R/ti/p/@846vdklj" target="_blank" rel="noreferrer" className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600 transition-all shadow-sm flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Line 諮詢
          </a>
        </nav>

        {/* Mobile Nav Toggle */}
        <div className="lg:hidden flex items-center gap-4">
          <a href="https://line.me/R/ti/p/@846vdklj" target="_blank" rel="noreferrer" className="p-2 bg-green-500 text-white rounded-lg shadow-sm">
            <MessageCircle className="w-5 h-5" />
          </a>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-600 hover:text-orange-600 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <button 
                  key={link.label}
                  onClick={() => handleNavClick(link.view, link.href)}
                  className={cn(
                    "text-left py-3 text-lg font-bold border-b border-slate-50 last:border-0",
                    link.view === currentView ? "text-orange-600" : "text-slate-600"
                  )}
                >
                  {link.label}
                </button>
              ))}
              <a 
                href="https://line.me/R/ti/p/@846vdklj" 
                target="_blank" 
                rel="noreferrer" 
                className="mt-4 w-full py-4 bg-green-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Line 線上諮詢
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default function App() {
  const [view, setView] = useState<'preorder' | 'courses' | 'course-detail'>('courses');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const navigateToCourse = (course: Course) => {
    setSelectedCourse(course);
    setView('course-detail');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onViewChange={(v) => setView(v)} currentView={view} />

      <AnimatePresence mode="wait">
        {view === 'preorder' ? (
          <PreorderPage key="preorder" />
        ) : view === 'courses' ? (
          <motion.main 
            key="courses"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">蛋糕烘焙系列課程</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">不論創業接單、居家烘焙，橙工房讓你擁有成功的立基點，輕鬆製作各式精緻美型蛋糕！</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {COURSES.map((course) => (
                <div 
                  key={course.id}
                  onClick={() => navigateToCourse(course)}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 cursor-pointer"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-orange-600 uppercase tracking-widest">
                      難易度 {Array.from({ length: course.difficulty }).map(() => '★')}
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-2">{course.subtitle}</p>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">{course.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-6">{course.description}</p>
                    <div className="flex items-center text-orange-600 font-bold text-sm">
                      查看課程詳情
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.main>
        ) : (
      <CourseDetailPage 
        course={selectedCourse!} 
        onBack={() => setView('courses')} 
      />
    )}
  </AnimatePresence>

      <footer className="py-12 px-8 border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-slate-100">
                <img 
                  src="https://picsum.photos/seed/citrus-logo/200/200" 
                  alt="澄工房 Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-lg font-bold text-slate-900">澄工房</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              烘培坊
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="https://www.facebook.com/profile.php?id=100069034187651" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-orange-500 hover:text-white transition-all">
                <span className="font-bold text-xs">FB</span>
              </a>
              <a href="https://www.instagram.com/citruslin2011" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-pink-500 hover:text-white transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://line.me/R/ti/p/@846vdklj" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-green-500 hover:text-white transition-all">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="https://citrus-cxi.blogspot.com/" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-orange-500 hover:text-white transition-all">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">聯絡資訊</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>台北市萬華區武昌街2段 91巷8號 , Taipei, Taiwan, 108</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <a href="mailto:citruslife@yahoo.com.tw" className="hover:text-orange-600 transition-colors">citruslife@yahoo.com.tw</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600">
                <MessageCircle className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Line ID: citruslin2011</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">快速連結</h3>
            <ul className="space-y-2">
              <li><button onClick={() => setView('preorder')} className="text-sm text-slate-600 hover:text-orange-600 transition-colors">產品預購</button></li>
              <li><button onClick={() => setView('courses')} className="text-sm text-slate-600 hover:text-orange-600 transition-colors">教學課程列表</button></li>
              <li><a href="https://citrus-cxi.blogspot.com/" target="_blank" rel="noreferrer" className="text-sm text-slate-600 hover:text-orange-600 transition-colors">官方部落格</a></li>
              <li><a href="https://line.me/R/ti/p/@846vdklj" target="_blank" rel="noreferrer" className="text-sm text-slate-600 hover:text-orange-600 transition-colors">Line 線上諮詢</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">© 2025 橙工房 AI Studio. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">隱私權政策</a>
            <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">服務條款</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
