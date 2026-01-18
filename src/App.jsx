import './index.css'; // 👈 This connects your code to Tailwind
import { useState, useEffect, useRef } from 'react';


// Animated particle grid background
const ParticleGrid = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    let mouse = { x: null, y: null };
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    
    const particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
      });
    }
    
    const handleMouse = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouse);
    
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 136, 0.8)';
        ctx.fill();
        
        particles.forEach((p2, j) => {
          if (i === j) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 255, 136, ${0.15 - dist / 1000})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
        
        if (mouse.x && mouse.y) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(255, 0, 102, ${0.3 - dist / 700})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });
      
      animationId = requestAnimationFrame(animate);
    };
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
};

// Animated name with stroke reveal and glow
const AnimatedName = ({ children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <span className={`animated-name-wrapper ${className}`}>
      <span className={`animated-name ${isVisible ? 'revealed' : ''}`}>
        {children.split('').map((char, i) => (
          <span 
            key={i} 
            className="char"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {char}
          </span>
        ))}
      </span>
      <span className={`animated-name-outline ${isVisible ? 'revealed' : ''}`} aria-hidden="true">
        {children.split('').map((char, i) => (
          <span 
            key={i} 
            className="char-outline"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {char}
          </span>
        ))}
      </span>
    </span>
  );
};

// Scroll reveal wrapper
const Reveal = ({ children, delay = 0, direction = 'up' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  
  const transforms = {
    up: 'translateY(60px)',
    down: 'translateY(-60px)',
    left: 'translateX(60px)',
    right: 'translateX(-60px)'
  };
  
  return (
    <div
      ref={ref}
      style={{
        transform: isVisible ? 'translate(0)' : transforms[direction],
        opacity: isVisible ? 1 : 0,
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

// Main component
export default function ThomasPortfolio() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    const handleMouse = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);
  
  // PROJECTS DATA - Add new projects here and they'll automatically appear in the carousel
  const projects = [
    {
      name: 'BankX Protocol',
      role: 'Lead Developer',
      period: '2021 - Present',
      description: 'Built the entire protocol ecosystem from whitepaper to production. Live on 8 chains including PulseChain. Passed audits from CoinFabrik and Immunefi.',
      tech: ['Solidity', 'Rust', 'Node.js', 'Web3'],
      color: '#00ff88'
    },
    {
      name: 'CtrlBit',
      role: 'Co-Founder',
      period: '2024 - Present',
      description: 'SaaS infrastructure for Mikrotik network management. Centralized monitoring, zero-touch provisioning, and secure remote access for global ISPs.',
      tech: ['DevOps', 'Docker', 'API', 'Infrastructure'],
      color: '#ff0066'
    },
    {
      name: 'Nord Finance',
      role: 'Core Contributor',
      period: '2021',
      description: 'Designed yield farming algorithms and loan regulatory software for this DeFi protocol.',
      tech: ['DeFi', 'Smart Contracts', 'Ethereum'],
      color: '#00d4ff'
    }
  ];
  
  // BLOG DATA - Add new blog posts here and they'll automatically appear with animations
  const blogs = [
    {
      title: 'Building a Decentralized Freelancing Platform with Chainlink',
      excerpt: 'How I architected a blockchain-based freelancing platform using Chainlink oracles for secure payments and dispute resolution. A deep dive into smart contract design for gig economy applications.',
      date: '2024',
      category: 'DeFi',
      color: '#00ff88',
      link: 'https://github.com/thinktanktom/Chainlink-Guild-Protocol'
    },
    {
      title: 'Integrating Venus Protocol with PancakeSwap for Yield Optimization',
      excerpt: 'A technical walkthrough of building a staking contract that combines PancakeSwap LP tokens with Venus Protocol lending to maximize yield. Includes smart contract architecture and security considerations.',
      date: '2024',
      category: 'Smart Contracts',
      color: '#00d4ff',
      link: 'https://github.com/thinktanktom/Venus-Protocol-Integration'
    },
    {
      title: 'On-Chain Randomization for NFT Minting: A Hashmasks Fork',
      excerpt: 'Exploring verifiable randomness in NFT generation. How I customized the Hashmasks approach to create truly random, on-chain NFT attributes without relying on off-chain metadata.',
      date: '2023',
      category: 'NFTs',
      color: '#ff0066',
      link: 'https://github.com/thinktanktom/onchain-randomization'
    },
    {
      title: 'Cross-Chain Token Bridges: ERC20 to BEP20 Migration',
      excerpt: 'Building a cross-chain bridge API for seamless token migration between Ethereum and Binance Smart Chain. Covers security patterns, atomic swaps, and handling chain reorganizations.',
      date: '2023',
      category: 'Infrastructure',
      color: '#00ff88',
      link: '#'
    },
    {
      title: 'Automatic Watermark Detection Using Deep Learning',
      excerpt: 'My research project on using convolutional neural networks for digital watermark detection in images. A blend of AI and image processing techniques for content authentication.',
      date: '2021',
      category: 'AI/ML',
      color: '#00d4ff',
      link: 'https://github.com/thinktanktom/automatic-watermark-detection'
    }
  ];
  
  const skills = [
    { name: 'Solidity', level: 95 },
    { name: 'Rust', level: 88 },
    { name: 'Node.js', level: 92 },
    { name: 'Ethereum', level: 94 },
    { name: 'Docker', level: 85 },
    { name: 'DApps', level: 90 }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          background: #0a0a0f;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          overflow-x: hidden;
          cursor: none;
        }
        
        .custom-cursor {
          width: 20px;
          height: 20px;
          border: 2px solid #00ff88;
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          transition: transform 0.15s ease, background 0.15s ease;
          mix-blend-mode: difference;
        }
        
        .custom-cursor.hovering {
          transform: scale(2);
          background: #00ff88;
        }
        
        .cursor-dot {
          width: 6px;
          height: 6px;
          background: #00ff88;
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9999;
        }
        
        .animated-name-wrapper {
          position: relative;
          display: inline-block;
        }
        
        .animated-name {
          position: relative;
          display: inline-block;
        }
        
        .animated-name .char {
          display: inline-block;
          opacity: 0;
          transform: translateY(40px) rotateX(-90deg);
          animation: charReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animated-name-outline {
          position: absolute;
          top: 0;
          left: 0;
          -webkit-text-stroke: 2px #00ff88;
          color: transparent;
          filter: blur(0px);
          opacity: 0;
        }
        
        .animated-name-outline.revealed {
          animation: glowPulse 3s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animated-name-outline .char-outline {
          display: inline-block;
          opacity: 0;
          animation: outlineReveal 1s ease forwards;
        }
        
        @keyframes charReveal {
          0% {
            opacity: 0;
            transform: translateY(40px) rotateX(-90deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
          }
        }
        
        @keyframes outlineReveal {
          0% { opacity: 0; }
          50% { opacity: 0.8; }
          100% { opacity: 0.3; }
        }
        
        @keyframes glowPulse {
          0%, 100% { 
            filter: blur(4px) drop-shadow(0 0 10px #00ff88);
            opacity: 0.3;
          }
          50% { 
            filter: blur(8px) drop-shadow(0 0 20px #00ff88) drop-shadow(0 0 40px #00d4ff);
            opacity: 0.5;
          }
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #00ff88 0%, #00d4ff 50%, #ff0066 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hover-lift {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 30px 60px -20px rgba(0, 255, 136, 0.3);
        }
        
        .skill-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .skill-fill {
          height: 100%;
          background: linear-gradient(90deg, #00ff88, #00d4ff);
          border-radius: 2px;
          transform-origin: left;
          animation: fillBar 1.5s ease forwards;
        }
        
        @keyframes fillBar {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        
        .pulse-border {
          position: relative;
        }
        
        .pulse-border::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(45deg, #00ff88, #00d4ff, #ff0066, #00ff88);
          background-size: 400% 400%;
          border-radius: inherit;
          z-index: -1;
          animation: borderGlow 4s linear infinite;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .pulse-border:hover::before {
          opacity: 1;
        }
        
        @keyframes borderGlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .nav-link {
          position: relative;
          overflow: hidden;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: #00ff88;
          transform: translateX(-101%);
          transition: transform 0.3s ease;
        }
        
        .nav-link:hover::after {
          transform: translateX(0);
        }
        
        .scanline {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.03) 2px,
            rgba(0, 0, 0, 0.03) 4px
          );
          pointer-events: none;
          z-index: 100;
        }
        
        .noise {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
          z-index: 99;
        }
        
        .carousel-container {
          perspective: 1500px;
          height: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
        }
        
        .carousel {
          position: relative;
          width: 100%;
          max-width: 340px;
          height: 380px;
          transform-style: preserve-3d;
          animation: rotisserie 15s linear infinite;
        }
        
        .carousel:hover {
          animation-play-state: paused;
        }
        
        .carousel-item {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: visible;
          transform-style: preserve-3d;
          transition: transform 0.5s ease;
        }
        
        @keyframes rotisserie {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        
        .carousel-card {
          width: 320px;
          height: 360px;
          padding: 1.5rem;
          border-radius: 1.5rem;
          background: linear-gradient(135deg, rgba(20, 20, 30, 0.98) 0%, rgba(10, 10, 15, 0.99) 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255, 255, 255, 0.05) inset;
        }
        
        .carousel-card:hover {
          border-color: rgba(0, 255, 136, 0.4);
          box-shadow: 
            0 35px 60px -15px rgba(0, 0, 0, 0.7),
            0 0 60px -10px rgba(0, 255, 136, 0.3);
          transform: scale(1.02);
        }
        
        /* Blog card animations */
        .blog-card {
          opacity: 0;
          transform: translateY(40px) scale(0.95);
          animation: blogReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        @keyframes blogReveal {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .blog-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--accent-color), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .blog-card:hover::before {
          opacity: 1;
        }
        
        .blog-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 40px 80px -20px rgba(0, 255, 136, 0.2);
        }
        
        .blog-card:hover .blog-arrow {
          transform: translateX(8px);
        }
        
        .blog-arrow {
          transition: transform 0.3s ease;
        }
        
        /* Magnetic hover effect for blog cards */
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }
      `}</style>
      
      {/* Custom Cursor */}
      <div 
        className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
        style={{ left: cursorPos.x - 10, top: cursorPos.y - 10 }}
      />
      <div 
        className="cursor-dot"
        style={{ left: cursorPos.x - 3, top: cursorPos.y - 3 }}
      />
      
      {/* Overlays */}
      <div className="scanline" />
      <div className="noise" />
      
      {/* Particle Background */}
      <ParticleGrid />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6" style={{ background: 'linear-gradient(180deg, rgba(10,10,15,0.95) 0%, transparent 100%)' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="text-2xl font-bold tracking-tighter"
            style={{ fontFamily: 'Space Mono, monospace' }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <span className="text-white">T</span>
            <span style={{ color: '#00ff88' }}>.</span>
            <span className="text-white">C</span>
          </div>
          
          <div className="hidden md:flex gap-8">
            {['About', 'Projects', 'Blog', 'Skills', 'Contact'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`}
                className="nav-link text-sm uppercase tracking-widest text-gray-400 hover:text-white transition-colors py-2"
                style={{ fontFamily: 'Space Mono, monospace' }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {item}
              </a>
            ))}
          </div>
          
          <a 
            href="mailto:contact@thomas.dev"
            className="px-6 py-3 text-sm uppercase tracking-wider border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-300"
            style={{ fontFamily: 'Space Mono, monospace' }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            Let's Talk
          </a>
        </div>
      </nav>
      
      {/* Hero Section - Now with Carousel */}
      <section className="min-h-screen flex items-center justify-center relative px-8 pt-24 pb-12" id="hero">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Bio */}
          <div>
            <Reveal delay={0}>
              <p 
                className="text-sm uppercase tracking-[0.3em] mb-6"
                style={{ fontFamily: 'Space Mono, monospace', color: '#00ff88' }}
              >
                Blockchain Architect • DeFi Builder
              </p>
            </Reveal>
            
            <Reveal delay={100}>
              <h1 className="text-6xl md:text-8xl font-bold leading-none mb-8" style={{ fontFamily: 'Outfit, sans-serif' }}>
                <AnimatedName>THOMAS</AnimatedName>
                <br />
                <span className="gradient-text">C.</span>
              </h1>
            </Reveal>
            
            <Reveal delay={200}>
              <p className="text-xl text-gray-400 max-w-lg mb-8 leading-relaxed">
                I don't just write code — I build sustainable businesses. 
                From whitepaper to mainnet, I architect protocols that 
                <span style={{ color: '#00ff88' }}> move money</span>.
              </p>
            </Reveal>
            
            <Reveal delay={300}>
              <div className="flex gap-4 items-center">
                <a 
                  href="https://www.linkedin.com/in/thomas-c-7a8ba3184/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-[#00ff88] hover:text-[#00ff88] transition-colors duration-300"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="https://github.com/thinktanktom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-[#00ff88] hover:text-[#00ff88] transition-colors duration-300"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </Reveal>
          </div>
          
          {/* Right side - Projects Carousel */}
          <Reveal delay={400} direction="left">
            <div className="carousel-container">
              <div className="carousel">
                {projects.map((project, index) => {
                  const angle = (360 / projects.length) * index;
                  const radius = 340;
                  return (
                    <div 
                      key={project.name}
                      className="carousel-item"
                      style={{
                        transform: `rotateY(${angle}deg) translateZ(${radius}px)`
                      }}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                    >
                      <div className="carousel-card">
                        <div>
                          <div 
                            className="w-3 h-3 rounded-full mb-4"
                            style={{ background: project.color, boxShadow: `0 0 20px ${project.color}` }}
                          />
                          <span 
                            className="text-xs uppercase tracking-wider px-3 py-1 rounded-full inline-block mb-3"
                            style={{ 
                              background: `${project.color}20`,
                              color: project.color,
                              fontFamily: 'Space Mono, monospace'
                            }}
                          >
                            {project.role}
                          </span>
                          <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                          <p className="text-gray-400 text-sm leading-relaxed">
                            {project.description}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.tech.slice(0, 3).map((tech) => (
                              <span 
                                key={tech}
                                className="px-2 py-1 text-xs rounded border border-white/10 text-gray-500"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600" style={{ fontFamily: 'Space Mono, monospace' }}>
                              {project.period}
                            </span>
                            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-[#00ff88] hover:bg-[#00ff88]/10 transition-all duration-300 cursor-pointer">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Project indicators */}
            <div className="flex justify-center gap-3 mt-4">
              {projects.map((project) => (
                <div 
                  key={project.name}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{ background: project.color, opacity: 0.6 }}
                />
              ))}
            </div>
            
            <p className="text-center text-gray-600 text-xs mt-4" style={{ fontFamily: 'Space Mono, monospace' }}>
              Hover to pause • {projects.length} projects
            </p>
          </Reveal>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-24 px-8 relative" id="about">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <Reveal>
                <p 
                  className="text-sm uppercase tracking-[0.3em] mb-4"
                  style={{ fontFamily: 'Space Mono, monospace', color: '#00ff88' }}
                >
                  // About
                </p>
              </Reveal>
              
              <Reveal delay={100}>
                <h2 className="text-5xl md:text-6xl font-bold mb-8">
                  Building the <br />
                  <span className="gradient-text">future of finance</span>
                </h2>
              </Reveal>
              
              <Reveal delay={200}>
                <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
                  <p>
                    With over 5 years in the international startup ecosystem, I specialize in 
                    building robust, scalable products from the ground up. I'm a language and 
                    framework agnostic engineer who prioritizes using the right tool for the job.
                  </p>
                  <p>
                    I began my career in 2019 translating high-level AI research papers into 
                    functional products. Since then, I've architected facial recognition systems, 
                    image processing pipelines, and LLM-based regulatory software for fintech 
                    startups across Europe and Asia.
                  </p>
                  <p>
                    I'm <span style={{ color: '#00ff88' }}>MTCNA certified</span> and experienced 
                    in bridging the gap between complex engineering and market-ready solutions.
                  </p>
                </div>
              </Reveal>
            </div>
            
            <div className="lg:pl-12">
              <Reveal delay={300}>
                <div className="flex flex-wrap gap-4">
                  <div 
                    className="flex-1 min-w-[140px] p-6 rounded-xl text-center pulse-border transition-all duration-300"
                    style={{ 
                      background: 'rgba(0,255,136,0.05)',
                      border: '1px solid rgba(0,255,136,0.2)',
                      borderRadius: '12px'
                    }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <div className="text-3xl font-bold mb-2" style={{ color: '#00ff88' }}>5+</div>
                    <div className="text-sm text-gray-400">Years Exp</div>
                  </div>
                  <div 
                    className="flex-1 min-w-[140px] p-6 rounded-xl text-center pulse-border transition-all duration-300"
                    style={{ 
                      background: 'rgba(0,212,255,0.05)',
                      border: '1px solid rgba(0,212,255,0.2)',
                      borderRadius: '12px'
                    }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <div className="text-3xl font-bold mb-2" style={{ color: '#00d4ff' }}>8</div>
                    <div className="text-sm text-gray-400">Chains</div>
                  </div>
                  <div 
                    className="flex-1 min-w-[140px] p-6 rounded-xl text-center pulse-border transition-all duration-300"
                    style={{ 
                      background: 'rgba(255,0,102,0.05)',
                      border: '1px solid rgba(255,0,102,0.2)',
                      borderRadius: '12px'
                    }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <div className="text-3xl font-bold mb-2" style={{ color: '#ff0066' }}>100%</div>
                    <div className="text-sm text-gray-400">Success</div>
                  </div>
                </div>
              </Reveal>
              
              <Reveal delay={400}>
                <div className="mt-8 flex flex-wrap gap-4">
                  <div 
                    className="flex-1 min-w-[100px] p-5 rounded-xl text-center pulse-border"
                    style={{ 
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px'
                    }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <div className="text-xl mb-1">🎓</div>
                    <div className="text-sm text-gray-400">BTech CS</div>
                    <div className="text-xs text-gray-600">SRM 2017-21</div>
                  </div>
                  <div 
                    className="flex-1 min-w-[100px] p-5 rounded-xl text-center pulse-border"
                    style={{ 
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px'
                    }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <div className="text-xl mb-1">🏅</div>
                    <div className="text-sm text-gray-400">MTCNA</div>
                    <div className="text-xs text-gray-600">Certified</div>
                  </div>
                  <div 
                    className="flex-1 min-w-[100px] p-5 rounded-xl text-center pulse-border"
                    style={{ 
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px'
                    }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <div className="text-xl mb-1">⭐</div>
                    <div className="text-sm text-gray-400">Top Rated</div>
                    <div className="text-xs text-gray-600">Plus</div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      
      {/* Projects Section (Anchor for nav) */}
      <section className="py-8" id="projects">
        <div className="max-w-7xl mx-auto px-8">
          <Reveal>
            <div className="text-center">
              <p className="text-gray-600 text-sm" style={{ fontFamily: 'Space Mono, monospace' }}>
                ↑ Projects showcased in the hero carousel above
              </p>
            </div>
          </Reveal>
        </div>
      </section>
      
      {/* Blog Section */}
      <section className="py-24 px-8 relative" id="blog">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <p 
              className="text-sm uppercase tracking-[0.3em] mb-4"
              style={{ fontFamily: 'Space Mono, monospace', color: '#00ff88' }}
            >
              // Blog
            </p>
          </Reveal>
          
          <Reveal delay={100}>
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              Thoughts & <span className="gradient-text">Insights</span>
            </h2>
          </Reveal>
          
          <Reveal delay={150}>
            <p className="text-gray-500 mb-12 max-w-2xl">
              Writing about blockchain development, DeFi protocols, and building products that scale.
            </p>
          </Reveal>
          
          <div className="blog-grid">
            {blogs.map((blog, index) => (
              <Reveal key={blog.title} delay={200 + index * 100}>
                <a 
                  href={blog.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blog-card relative p-8 rounded-2xl cursor-pointer transition-all duration-500 block"
                  style={{ 
                    '--accent-color': blog.color,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    animationDelay: `${index * 0.15}s`,
                    textDecoration: 'none'
                  }}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span 
                      className="px-3 py-1 text-xs uppercase tracking-wider rounded-full"
                      style={{ 
                        background: `${blog.color}15`,
                        color: blog.color,
                        fontFamily: 'Space Mono, monospace'
                      }}
                    >
                      {blog.category}
                    </span>
                    <span className="text-xs text-gray-600" style={{ fontFamily: 'Space Mono, monospace' }}>
                      {blog.date}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[#00ff88] transition-colors">
                    {blog.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {blog.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm" style={{ color: blog.color }}>
                    <span>View project</span>
                    <svg className="w-4 h-4 blog-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
          
          {blogs.length === 0 && (
            <Reveal delay={200}>
              <div 
                className="text-center py-16 rounded-2xl"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
                  border: '1px dashed rgba(255,255,255,0.1)'
                }}
              >
                <p className="text-gray-500">Blog posts coming soon...</p>
              </div>
            </Reveal>
          )}
        </div>
      </section>
      
      {/* Skills Section */}
      <section className="py-24 px-8 relative" id="skills">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <Reveal>
                <p 
                  className="text-sm uppercase tracking-[0.3em] mb-4"
                  style={{ fontFamily: 'Space Mono, monospace', color: '#00ff88' }}
                >
                  // Technical Stack
                </p>
              </Reveal>
              
              <Reveal delay={100}>
                <h2 className="text-5xl md:text-6xl font-bold mb-8">
                  Skills that <span className="gradient-text">matter</span>
                </h2>
              </Reveal>
              
              <Reveal delay={200}>
                <p className="text-gray-400 text-lg mb-12">
                  I'm a language and framework agnostic engineer. The right tool for the job 
                  is always my priority, without ever compromising on technical integrity.
                </p>
              </Reveal>
              
              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <Reveal key={skill.name} delay={300 + index * 50}>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-gray-500" style={{ fontFamily: 'Space Mono, monospace' }}>
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${skill.level}%`,
                            background: `linear-gradient(90deg, #00ff88 0%, #00d4ff ${skill.level}%)`,
                            animation: 'fillBar 1.5s ease forwards',
                            animationDelay: `${0.3 + index * 0.1}s`,
                            transformOrigin: 'left',
                            transform: 'scaleX(0)'
                          }}
                        />
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <Reveal delay={400}>
                <div 
                  className="sticky top-32 p-8 rounded-2xl"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <h3 className="text-xl font-semibold mb-6">Also proficient in</h3>
                  <div className="flex flex-wrap gap-3">
                    {['API', 'DApps', 'Cryptocurrency', 'Front-End', 'DevOps', 'Web3', 'Smart Contracts', 'Machine Learning', 'Image Processing', 'LLMs'].map((tag) => (
                      <span 
                        key={tag}
                        className="px-4 py-2 rounded-full text-sm border border-white/10 hover:border-[#00ff88] hover:text-[#00ff88] transition-colors cursor-default"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#00ff88]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">GitHub since 2017</div>
                        <a 
                          href="https://github.com/thinktanktom" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00ff88] hover:underline"
                          onMouseEnter={() => setIsHovering(true)}
                          onMouseLeave={() => setIsHovering(false)}
                        >
                          @thinktanktom
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-24 px-8 relative" id="contact">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <p 
              className="text-sm uppercase tracking-[0.3em] mb-4"
              style={{ fontFamily: 'Space Mono, monospace', color: '#00ff88' }}
            >
              // Get in Touch
            </p>
          </Reveal>
          
          <Reveal delay={100}>
            <h2 className="text-5xl md:text-7xl font-bold mb-8">
              Let's build<br />
              <span className="gradient-text">something great</span>
            </h2>
          </Reveal>
          
          <Reveal delay={200}>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Currently open to innovative projects that require high-level technical leadership. 
              Available during PST and UTC business hours.
            </p>
          </Reveal>
          
          <Reveal delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.upwork.com/freelancers/~018a1dbf1094588c7e"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 bg-white text-black font-semibold rounded-full flex items-center justify-center gap-3 hover:bg-[#00ff88] transition-all duration-300"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                Hire on Upwork
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              
              <a 
                href="https://www.linkedin.com/in/thomas-c-7a8ba3184/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-white/30 rounded-full font-semibold hover:border-[#00ff88] hover:text-[#00ff88] transition-all duration-300 flex items-center justify-center gap-3"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                Connect on LinkedIn
              </a>
            </div>
          </Reveal>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div 
            className="text-2xl font-bold tracking-tighter"
            style={{ fontFamily: 'Space Mono, monospace' }}
          >
            <span className="text-white">T</span>
            <span style={{ color: '#00ff88' }}>.</span>
            <span className="text-white">C</span>
          </div>
          
          <p className="text-gray-600 text-sm" style={{ fontFamily: 'Space Mono, monospace' }}>
            © 2025 Thomas C. All rights reserved.
          </p>
          
          <div className="flex gap-4">
            <a 
              href="https://github.com/thinktanktom"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-[#00ff88] hover:text-[#00ff88] transition-colors"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a 
              href="https://www.linkedin.com/in/thomas-c-7a8ba3184/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-[#00ff88] hover:text-[#00ff88] transition-colors"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
