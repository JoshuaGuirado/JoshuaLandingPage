import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import {
  ArrowRight,
  CheckCircle2,
  Laptop,
  Code2,
  BarChart,
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

const VideoBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden bg-slate-50 pointer-events-none">
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover opacity-[0.03] grayscale mix-blend-multiply"
      style={{ willChange: 'opacity, transform' }}
    >
      <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-plexus-background-2766-large.mp4" type="video/mp4" />
    </video>
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white"></div>
    {/* Animated Floating Orbs */}
    <motion.div
      animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-900/10 rounded-full blur-3xl"
    />
    <motion.div
      animate={{ y: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-400/10 rounded-full blur-3xl"
    />
  </div>
);

const BrandLogo = () => (
  <div className="flex items-center gap-3 cursor-pointer group">
    <div className="w-10 h-10 bg-slate-950 flex items-center justify-center rounded-xl shadow-lg border border-slate-800 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300 relative overflow-hidden">
      {/* Efeito Glow Interno */}
      <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full scale-150"></div>
      <svg className="w-6 h-6 text-white relative z-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M65 20V60C65 73.8 53.8 85 40 85C26.2 85 15 73.8 15 60V55" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M45 20H80" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
        <circle cx="20" cy="30" r="8" fill="#38bdf8" />
      </svg>
    </div>
    <span className="text-xl font-sans font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
      joshua
      <span className="font-medium text-blue-600">.dev</span>
    </span>
  </div>
);

const TiltedCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={`relative rounded-3xl ${className}`}
    >
      <div style={{ transform: "translateZ(30px)" }} className="relative h-full w-full">
        {children}
      </div>
    </motion.div>
  );
};

export default function App() {
  const [formData, setFormData] = useState({ name: '', whatsapp: '', email: '', service: '' });
  const [scrolled, setScrolled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Enviar formulário estilizado para o email via formsubmit.co
    try {
      await fetch("https://formsubmit.co/ajax/joshuafguirado@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `🔥 Novo Lead Landing Page: ${formData.name}`,
          _template: "box",
          Nome: formData.name,
          WhatsApp: formData.whatsapp,
          Email: formData.email,
          Interesse: formData.service,
          Aviso: "Solicitação recebida diretamente do seu site oficial."
        })
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      // 2. Redirecionar para o WhatsApp
      const message = `Olá Joshua! Meu nome é ${formData.name}. Tenho interesse no serviço de ${formData.service}. Meu email é ${formData.email}.`;
      window.open(`https://wa.me/5544999665711?text=${encodeURIComponent(message)}`, '_blank');

      setFormData({ name: '', whatsapp: '', email: '', service: '' });
    }
  };

  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-white text-slate-600 font-sans selection:bg-slate-200 selection:text-slate-900 overflow-x-hidden">

      {/* Navbar Animada */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/50 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <BrandLogo />
          <button
            onClick={scrollToContact}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-sm font-bold text-white hover:bg-blue-950 transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            Falar com Joshua <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section Premium */}
      <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 overflow-hidden flex items-center min-h-[90vh]">
        <VideoBackground />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Texto Hero com Stagger */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 }
                }
              }}
              className="text-left"
            >
              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Disponível para novos projetos
              </motion.div>

              <motion.h1
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="text-5xl lg:text-7xl font-sans font-extrabold tracking-tight text-slate-900 leading-[1.05] mb-6"
              >
                Engenharia de <br />
                <span className="text-blue-950 relative inline-block">
                  Conversão
                  <motion.svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-950/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <motion.path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5 }} />
                  </motion.svg>
                </span>.
              </motion.h1>

              <motion.p
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-light max-w-lg"
              >
                Estruturo arquiteturas digitais e landing pages de ultra-alta performance para negócios que não podem perder leads.
              </motion.p>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={scrollToContact}
                  className="px-8 py-4 rounded-xl bg-blue-950 text-white text-sm font-bold shadow-xl shadow-blue-950/20 hover:bg-slate-900 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                >
                  Começar Estruturação <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#projects"
                  onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="px-8 py-4 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center"
                >
                  Ver Portfólio
                </a>
              </motion.div>
            </motion.div>

            {/* Elemento Interativo Direito Estático e Otimizado */}
            <div className="relative hidden lg:block">
              <div className="w-full aspect-square max-w-md mx-auto relative rounded-[2rem] overflow-hidden bg-blue-950 shadow-2xl flex flex-col border-[6px] border-slate-200/50">
                {/* Window Header */}
                <div className="flex items-center px-6 py-4 border-b border-white/5 bg-slate-900/50">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                  </div>
                  <div className="mx-auto text-xs font-mono text-slate-400">engine.tsx</div>
                </div>

                {/* Code Body - Monochromatic site palette */}
                <div className="p-8 font-mono text-sm leading-relaxed text-blue-100 flex-1 bg-blue-950/20 flex flex-col justify-center">
                  <p><span className="text-slate-400">import</span> {'{'} HighEndLanding {'}'} <span className="text-slate-400">from</span> <span className="text-white">'@luxury/ui'</span>;</p>
                  <p className="mt-6"><span className="text-slate-400">export default function</span> <span className="text-blue-300">Architecture</span>() {'{'}</p>
                  <p className="ml-4"><span className="text-slate-400">return</span> (</p>
                  <div className="ml-8 border-l-2 border-slate-600/50 pl-4 py-2 my-2 space-y-2">
                    <p>{'<'}<span className="text-blue-300">HighEndLanding</span></p>
                    <p className="ml-4"><span className="text-slate-300">performance</span><span className="text-slate-500">=</span><span className="text-blue-200">"ultra"</span></p>
                    <p className="ml-4"><span className="text-slate-300">design</span><span className="text-slate-500">=</span><span className="text-blue-200">"premium"</span></p>
                    <p className="ml-4"><span className="text-slate-300">conversion</span><span className="text-slate-500">=</span>{'{'}<span className="text-white">optimized</span>{'}'}</p>
                    <p>{'/>'}</p>
                  </div>
                  <p className="ml-4">);</p>
                  <p>{'}'}</p>
                </div>

                {/* Badge Bottom */}
                <div className="absolute bottom-6 right-6 bg-slate-900/80 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                  <Laptop className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold tracking-wide uppercase text-blue-100">Otimizado</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Marquee Premium */}
      <div className="w-full bg-blue-950 py-4 overflow-hidden flex whitespace-nowrap relative z-10 shadow-inner">
        <div className="flex gap-16 items-center animate-[marquee_30s_linear_infinite] w-max opacity-90" style={{ willChange: 'transform' }}>
          {[...Array(12)].map((_, i) => (
            <span key={i} className="text-blue-100/70 font-bold uppercase tracking-widest text-xs flex items-center gap-16">
              <span>LANDING PAGES B2B</span>
              <span className="w-1 h-1 rounded-full bg-blue-400/50"></span>
              <span>LANDING PAGES HIGH-END</span>
              <span className="w-1 h-1 rounded-full bg-blue-400/50"></span>
              <span>SALES PAGES PREMIUM</span>
              <span className="w-1 h-1 rounded-full bg-blue-400/50"></span>
            </span>
          ))}
        </div>
      </div>

      {/* Serviços com Hover Effects */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-sans font-extrabold tracking-tight text-slate-900 mb-6">O que eu construo</h2>
            <p className="text-lg text-slate-500 font-light max-w-2xl mx-auto">Soluções diretas ao ponto. Sem enrolação de agência, apenas tecnologia focada em resultado e velocidade.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Box 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-slate-50 text-slate-700 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-950 group-hover:text-white transition-colors duration-300 shadow-inner">
                <Layers strokeWidth={1.5} className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Landing Pages Corporativas</h3>
              <p className="text-slate-600 font-light leading-relaxed mb-6">Páginas de alta conversão programadas do zero. Animações fluidas, SEO técnico imaculado e carregamento em milissegundos para não perder quem clica no seu anúncio.</p>
              <ul className="space-y-3">
                {['Alta Conversão', 'Design Exclusivo', 'Mobile First Real'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-950" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Box 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-blue-950 text-white p-10 rounded-3xl border border-transparent shadow-xl hover:shadow-2xl hover:shadow-blue-950/20 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 text-white backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                  <Code2 strokeWidth={1.5} className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Páginas de Vendas (Sales Pages)</h3>
                <p className="text-blue-100 font-light leading-relaxed mb-6">Estruturas altamente persuasivas focadas em Landing Pages de conversão direta. Copy visual refinado, velocidade extrema e arquitetura projetada para maximizar o ROI das suas campanhas.</p>
                <div className="flex gap-2 flex-wrap mt-auto pt-6">
                  {['React', 'Next.js', 'Tailwind', 'Node.js'].map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-bold tracking-wider text-blue-100 backdrop-blur-sm border border-white/5">{tech}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projetos com Efeito Hover Imersivo */}
      <section id="projects" className="py-32 bg-white relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-sans font-extrabold tracking-tight text-slate-900 mb-4">Portfólio em Execução</h2>
            <p className="text-lg text-slate-500 font-light max-w-xl">Interfaces construídas com rigor técnico e prontas para operar em larga escala.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {[
              { title: "RGuirado", cat: "Corporate Landing", desc: "Arquitetura institucional focada em captação B2B de alto ticket.", link: "https://process-r-guirado.vercel.app/" },
              { title: "Milchukova Bride", cat: "Luxury UI", desc: "Minimalismo extremo para mercado de alta-costura. Imagens fluidas e tipografia editorial.", link: "https://leravestidos.vercel.app/" },
              { title: "Shivuk AI", cat: "Sistema de IA", desc: "Sistema de marketing com IA focado em performance.", link: "https://shivuk-ai-main.vercel.app/" },
              { title: "Decisão Extrema", cat: "Gamification", desc: "Interface mobile-first imersiva. Menos menus, mais microinterações de retenção.", link: "https://decis-o-extrema.vercel.app/" }
            ].map((p, i) => (
              <motion.a
                key={i}
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative block"
              >
                <div className="absolute inset-0 bg-blue-900/30 rounded-3xl translate-x-2 translate-y-2 transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0"></div>
                <div className="relative bg-blue-950 border border-blue-900 rounded-3xl p-8 lg:p-10 transition-all duration-300 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] h-full flex flex-col">
                  <div className="flex justify-between items-start mb-12">
                    <span className="px-3 py-1 bg-blue-900/50 text-white text-xs font-bold uppercase tracking-widest rounded-lg border border-blue-800">{p.cat}</span>
                    <div className="w-10 h-10 rounded-full bg-blue-900/80 text-white flex items-center justify-center group-hover:bg-white group-hover:text-blue-950 transition-colors duration-300">
                      <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-3 transition-colors">{p.title}</h3>
                    <p className="text-blue-100 font-light leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* About Section com Imagem Pessoal Nova */}
      <section className="py-32 bg-slate-50 border-t border-slate-200 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-slate-800 rounded-[2.5rem] rotate-3 scale-105 opacity-20 blur-xl"></div>
              <TiltedCard className="aspect-[3/4] max-w-md mx-auto w-full rounded-[2.5rem] overflow-hidden bg-white shadow-2xl relative border-[6px] border-blue-950">
                <img
                  src="/foto-joshua.jpg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=800";
                  }}
                  alt="Joshua Guirado"
                  className="w-full h-full object-cover grayscale-[0.2] contrast-125 transition-all duration-700 hover:grayscale-0"
                  loading="lazy"
                />
              </TiltedCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-950/5 text-blue-950 text-xs font-bold uppercase tracking-widest mb-6">
                Consultor & Desenvolvedor
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">Por que eu não sou apenas um refazedor de templates.</h2>
              <div className="space-y-6 text-slate-600 text-lg font-light leading-relaxed">
                <p>
                  Sou <strong className="font-bold text-slate-900">Joshua Guirado</strong>, tenho 19 anos e construo ativos digitais com visão de negócio. A maior parte das agências passa 3 meses discutindo a cor de um botão e entregam sites pesados e genéricos.
                </p>
                <p>
                  A minha operação cruza <strong className="font-bold text-slate-900">Engenharia de Frontend</strong> sofisticada com táticas reais de consultoria B2B. As animações fluidas que você está vendo fluir nesta tela não quebram o celular do seu cliente, pelo contrário, injetam autoridade visual imediata na sua marca.
                </p>

                {/* O usuário solicitou a remoção da parte que fala 100% aqui */}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Contato Elegante */}
      <section id="contact" className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Inicie o seu projeto.</h2>
            <p className="text-xl text-slate-400 font-light mb-16 max-w-2xl mx-auto">Deixe seus dados e me conte brevemente o que você precisa construir. Eu respondo no WhatsApp com o plano de ação.</p>

            <form onSubmit={handleSubmit} className="text-left bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-2">Nome</label>
                  <input
                    type="text"
                    name="name" required value={formData.name} onChange={handleInputChange}
                    className="w-full px-6 py-5 bg-black/20 border border-white/10 rounded-2xl focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium text-white placeholder-slate-600"
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-2">WhatsApp</label>
                  <input
                    type="tel"
                    name="whatsapp" required value={formData.whatsapp} onChange={handleInputChange}
                    className="w-full px-6 py-5 bg-black/20 border border-white/10 rounded-2xl focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium text-white placeholder-slate-600"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-2">Email Corporativo</label>
                <input
                  type="email"
                  name="email" required value={formData.email} onChange={handleInputChange}
                  className="w-full px-6 py-5 bg-black/20 border border-white/10 rounded-2xl focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium text-white placeholder-slate-600"
                  placeholder="voce@empresa.com"
                />
              </div>

              <div className="mb-8">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-2">Como posso te ajudar?</label>
                <select
                  name="service" required value={formData.service} onChange={handleInputChange}
                  className="w-full px-6 py-5 bg-black/20 border border-white/10 rounded-2xl focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all appearance-none font-medium text-white [&>option]:text-slate-900"
                >
                  <option value="" disabled>Selecione um tópico principal</option>
                  <option value="Landing Pages">Landing Pages</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 bg-white text-slate-900 text-lg font-bold rounded-2xl hover:bg-slate-200 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Processando..." : "Enviar Solicitação"}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="bg-slate-950 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-6">
          <div className="flex gap-8">
            <a href="#projects" onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-sm font-medium text-slate-500 hover:text-white transition-colors">Portfólio</a>
            <a href="https://wa.me/5544999665711" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">Dúvidas Frequentes</a>
            <a href="#contact" onClick={scrollToContact} className="text-sm font-medium text-slate-500 hover:text-white transition-colors">Orçamento</a>
          </div>
          <p className="text-slate-600 text-sm font-light">
            © {new Date().getFullYear()} Joshua.dev. Design e Código Customizado.
          </p>
        </div>
      </footer>

    </div>
  );
}
