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
  
  return <canvas ref={canvasRef} className="particle-canvas" />;
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
    <div className="portfolio-container">
      <style>{`
        /* Component Styles */
        .portfolio-container {
          position: relative;
          min-height: 100vh;
        }
        
        .particle-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
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
        
        /* Blog grid */
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }
        
        /* Section styles */
        .section {
          position: relative;
          z-index: 1;
        }
        
        /* Navigation */
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          padding: 1.5rem 2rem;
          background: linear-gradient(180deg, rgba(10,10,15,0.95) 0%, transparent 100%);
        }
        
        .nav-container {
          max-width: 80rem;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .nav-logo {
          font-size: 1.5rem;
          font-weight: bold;
          letter-spacing: -0.05em;
          font-family: 'Space Mono', monospace;
        }
        
        .nav-links {
          display: none;
          gap: 2rem;
        }
        
        @media (min-width: 768px) {
          .nav-links {
            display: flex;
          }
        }
        
        .nav-link-item {
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9ca3af;
          padding: 0.5rem 0;
          font-family: 'Space Mono', monospace;
          transition: color 0.3s ease;
        }
        
        .nav-link-item:hover {
          color: #fff;
        }
        
        .nav-cta {
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
          font-family: 'Space Mono', monospace;
          transition: all 0.3s ease;
        }
        
        .nav-cta:hover {
          background: #fff;
          color: #000;
        }
        
        /* Hero section */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6rem 2rem 3rem;
        }
        
        .hero-container {
          max-width: 80rem;
          margin: 0 auto;
          width: 100%;
          display: grid;
          gap: 2rem;
          align-items: center;
        }
        
        @media (min-width: 1024px) {
          .hero-container {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }
        
        .hero-subtitle {
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          margin-bottom: 1.5rem;
          color: #00ff88;
          font-family: 'Space Mono', monospace;
        }
        
        .hero-title {
          font-size: 3.75rem;
          font-weight: bold;
          line-height: 1;
          margin-bottom: 2rem;
          font-family: 'Outfit', sans-serif;
        }
        
        @media (min-width: 768px) {
          .hero-title {
            font-size: 6rem;
          }
        }
        
        .hero-description {
          font-size: 1.25rem;
          color: #9ca3af;
          max-width: 32rem;
          margin-bottom: 2rem;
          line-height: 1.75;
        }
        
        .hero-links {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        
        .social-link {
          width: 3rem;
          height: 3rem;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .social-link:hover {
          border-color: #00ff88;
          color: #00ff88;
        }
        
        .social-link svg {
          width: 1.25rem;
          height: 1.25rem;
        }
        
        /* Section common styles */
        .section-container {
          max-width: 80rem;
          margin: 0 auto;
        }
        
        .section-subtitle {
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          margin-bottom: 1rem;
          color: #00ff88;
          font-family: 'Space Mono', monospace;
        }
        
        .section-title {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 2rem;
        }
        
        @media (min-width: 768px) {
          .section-title {
            font-size: 3.75rem;
          }
        }
        
        /* About section */
        .about-section {
          padding: 6rem 2rem;
        }
        
        .about-grid {
          display: grid;
          gap: 4rem;
        }
        
        @media (min-width: 1024px) {
          .about-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        
        .about-text {
          color: #9ca3af;
          font-size: 1.125rem;
          line-height: 1.75;
        }
        
        .about-text p {
          margin-bottom: 1.5rem;
        }
        
        .about-text .highlight {
          color: #00ff88;
        }
        
        .stats-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .stat-card {
          flex: 1;
          min-width: 140px;
          padding: 1.5rem;
          border-radius: 0.75rem;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .stat-value {
          font-size: 1.875rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        
        .stat-label {
          font-size: 0.875rem;
          color: #9ca3af;
        }
        
        .badge-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .badge-card {
          flex: 1;
          min-width: 100px;
          padding: 1.25rem;
          border-radius: 0.75rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .badge-icon {
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
        }
        
        .badge-title {
          font-size: 0.875rem;
          color: #9ca3af;
        }
        
        .badge-subtitle {
          font-size: 0.75rem;
          color: #4b5563;
        }
        
        /* Blog section */
        .blog-section {
          padding: 6rem 2rem;
        }
        
        .blog-description {
          color: #6b7280;
          margin-bottom: 3rem;
          max-width: 42rem;
        }
        
        .blog-card-inner {
          position: relative;
          padding: 2rem;
          border-radius: 1rem;
          background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(255, 255, 255, 0.05);
          cursor: pointer;
          transition: all 0.5s ease;
          display: block;
          text-decoration: none;
          color: inherit;
        }
        
        .blog-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        
        .blog-category {
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-radius: 9999px;
          font-family: 'Space Mono', monospace;
        }
        
        .blog-date {
          font-size: 0.75rem;
          color: #4b5563;
          font-family: 'Space Mono', monospace;
        }
        
        .blog-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.75rem;
          color: #fff;
          transition: color 0.3s ease;
        }
        
        .blog-excerpt {
          font-size: 0.875rem;
          color: #9ca3af;
          line-height: 1.75;
          margin-bottom: 1.5rem;
        }
        
        .blog-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }
        
        /* Skills section */
        .skills-section {
          padding: 6rem 2rem;
        }
        
        .skills-grid {
          display: grid;
          gap: 4rem;
        }
        
        @media (min-width: 1024px) {
          .skills-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        
        .skills-description {
          color: #9ca3af;
          font-size: 1.125rem;
          margin-bottom: 3rem;
        }
        
        .skill-item {
          margin-bottom: 1.5rem;
        }
        
        .skill-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        
        .skill-name {
          font-weight: 500;
        }
        
        .skill-level {
          color: #6b7280;
          font-family: 'Space Mono', monospace;
        }
        
        .skill-bar-container {
          height: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 9999px;
          overflow: hidden;
        }
        
        .skill-bar-fill {
          height: 100%;
          border-radius: 9999px;
          transform-origin: left;
          transform: scaleX(0);
        }
        
        .skills-sidebar {
          position: relative;
        }
        
        @media (min-width: 1024px) {
          .skills-sidebar {
            position: sticky;
            top: 8rem;
          }
        }
        
        .skills-card {
          padding: 2rem;
          border-radius: 1rem;
          background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .skills-card-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        
        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        
        .tag {
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          cursor: default;
        }
        
        .tag:hover {
          border-color: #00ff88;
          color: #00ff88;
        }
        
        .github-link {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .github-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .github-icon svg {
          width: 1.5rem;
          height: 1.5rem;
          color: #00ff88;
        }
        
        .github-info-label {
          font-size: 0.875rem;
          color: #9ca3af;
        }
        
        .github-info-link {
          color: #00ff88;
        }
        
        .github-info-link:hover {
          text-decoration: underline;
        }
        
        /* Contact section */
        .contact-section {
          padding: 6rem 2rem;
        }
        
        .contact-container {
          max-width: 56rem;
          margin: 0 auto;
          text-align: center;
        }
        
        .contact-title {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 2rem;
        }
        
        @media (min-width: 768px) {
          .contact-title {
            font-size: 4.5rem;
          }
        }
        
        .contact-description {
          font-size: 1.25rem;
          color: #9ca3af;
          margin-bottom: 3rem;
          max-width: 42rem;
          margin-left: auto;
          margin-right: auto;
        }
        
        .contact-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          justify-content: center;
        }
        
        @media (min-width: 640px) {
          .contact-buttons {
            flex-direction: row;
          }
        }
        
        .btn-primary {
          padding: 1rem 2rem;
          background: #fff;
          color: #000;
          font-weight: 600;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          background: #00ff88;
        }
        
        .btn-primary svg {
          width: 1.25rem;
          height: 1.25rem;
          transition: transform 0.3s ease;
        }
        
        .btn-primary:hover svg {
          transform: translateX(4px);
        }
        
        .btn-secondary {
          padding: 1rem 2rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 9999px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.3s ease;
        }
        
        .btn-secondary:hover {
          border-color: #00ff88;
          color: #00ff88;
        }
        
        /* Footer */
        .footer {
          padding: 3rem 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .footer-container {
          max-width: 80rem;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: center;
        }
        
        @media (min-width: 768px) {
          .footer-container {
            flex-direction: row;
            justify-content: space-between;
          }
        }
        
        .footer-logo {
          font-size: 1.5rem;
          font-weight: bold;
          letter-spacing: -0.05em;
          font-family: 'Space Mono', monospace;
        }
        
        .footer-copyright {
          font-size: 0.875rem;
          color: #4b5563;
          font-family: 'Space Mono', monospace;
        }
        
        .footer-social {
          display: flex;
          gap: 1rem;
        }
        
        .footer-social-link {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .footer-social-link:hover {
          border-color: #00ff88;
          color: #00ff88;
        }
        
        .footer-social-link svg {
          width: 1.25rem;
          height: 1.25rem;
        }
        
        /* Carousel indicator */
        .carousel-indicators {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 1rem;
        }
        
        .carousel-indicator {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 9999px;
          opacity: 0.6;
          transition: all 0.3s ease;
        }
        
        .carousel-hint {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.75rem;
          color: #4b5563;
          font-family: 'Space Mono', monospace;
        }
        
        /* Projects anchor */
        .projects-anchor {
          padding: 2rem;
          text-align: center;
        }
        
        .projects-anchor-text {
          font-size: 0.875rem;
          color: #4b5563;
          font-family: 'Space Mono', monospace;
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
      <nav className="nav">
        <div className="nav-container">
          <div 
            className="nav-logo"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <span style={{ color: '#fff' }}>T</span>
            <span style={{ color: '#00ff88' }}>.</span>
            <span style={{ color: '#fff' }}>C</span>
          </div>
          
          <div className="nav-links">
            {['About', 'Projects', 'Blog', 'Skills', 'Contact'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`}
                className="nav-link nav-link-item"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {item}
              </a>
            ))}
          </div>
          
          <a 
            href="mailto:thinktanktom@proton.me"
            className="nav-cta"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            Let's Talk
          </a>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="hero section" id="hero">
        <div className="hero-container">
          <div>
            <Reveal delay={0}>
              <p className="hero-subtitle">
                Blockchain Architect • DeFi Builder
              </p>
            </Reveal>
            
            <Reveal delay={100}>
              <h1 className="hero-title">
                <AnimatedName>THOMAS</AnimatedName>
                <br />
                <span className="gradient-text">C.</span>
              </h1>
            </Reveal>
            
            <Reveal delay={200}>
              <p className="hero-description">
                I don't just write code — I build sustainable businesses. 
                From whitepaper to mainnet, I architect protocols that 
                <span style={{ color: '#00ff88' }}> move money</span>.
              </p>
            </Reveal>
            
            <Reveal delay={300}>
              <div className="hero-links">
                <a 
                  href="https://www.linkedin.com/in/thomas-c-7a8ba3184/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="https://github.com/thinktanktom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </Reveal>
          </div>
          
          {/* Projects Carousel */}
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
                            style={{ 
                              width: '12px', 
                              height: '12px', 
                              borderRadius: '50%', 
                              marginBottom: '1rem',
                              background: project.color, 
                              boxShadow: `0 0 20px ${project.color}` 
                            }}
                          />
                          <span 
                            style={{ 
                              fontSize: '0.75rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '9999px',
                              display: 'inline-block',
                              marginBottom: '0.75rem',
                              background: `${project.color}20`,
                              color: project.color,
                              fontFamily: 'Space Mono, monospace'
                            }}
                          >
                            {project.role}
                          </span>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{project.name}</h3>
                          <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: '1.75' }}>
                            {project.description}
                          </p>
                        </div>
                        
                        <div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            {project.tech.slice(0, 3).map((tech) => (
                              <span 
                                key={tech}
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  fontSize: '0.75rem',
                                  borderRadius: '4px',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                  color: '#6b7280'
                                }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.75rem', color: '#4b5563', fontFamily: 'Space Mono, monospace' }}>
                              {project.period}
                            </span>
                            <div 
                              style={{
                                width: '2rem',
                                height: '2rem',
                                borderRadius: '50%',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                              }}
                            >
                              <svg style={{ width: '0.75rem', height: '0.75rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            
            <div className="carousel-indicators">
              {projects.map((project) => (
                <div 
                  key={project.name}
                  className="carousel-indicator"
                  style={{ background: project.color }}
                />
              ))}
            </div>
            
            <p className="carousel-hint">
              Hover to pause • {projects.length} projects
            </p>
          </Reveal>
        </div>
      </section>
      
      {/* About Section */}
      <section className="about-section section" id="about">
        <div className="section-container">
          <div className="about-grid">
            <div>
              <Reveal>
                <p className="section-subtitle">// About</p>
              </Reveal>
              
              <Reveal delay={100}>
                <h2 className="section-title">
                  Building the <br />
                  <span className="gradient-text">future of finance</span>
                </h2>
              </Reveal>
              
              <Reveal delay={200}>
                <div className="about-text">
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
                    I'm <span className="highlight">MTCNA certified</span> and experienced 
                    in bridging the gap between complex engineering and market-ready solutions.
                  </p>
                </div>
              </Reveal>
            </div>
            
            <div style={{ paddingLeft: '0' }}>
              <Reveal delay={300}>
                <div className="stats-grid">
                  <div 
                    className="stat-card pulse-border"
                    style={{ 
                      background: 'rgba(0,255,136,0.05)',
                      border: '1px solid rgba(0,255,136,0.2)'
                    }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <div className="stat-value" style={{ color: '#00ff88' }}>5+</div>
                    <div className="stat-label">Years Exp</div>
                  </div>
                  <div 
                    className="stat-card pulse-border"
                    style={{ 
                      background: 'rgba(0,212,255,0.05)',
                      border: '1px solid rgba(0,212,255,0.2)'
                    }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <div className="stat-value" style={{ color: '#00d4ff' }}>8</div>
                    <div className="stat-label">Chains</div>
                  </div>
                  <div 
                    className="stat-card pulse-border"
                    style={{ 
                      background: 'rgba(255,0,102,0.05)',
                      border: '1px solid rgba(255,0,102,0.2)'
                    }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <div className="stat-value" style={{ color: '#ff0066' }}>100%</div>
                    <div className="stat-label">Success</div>
                  </div>
                </div>
              </Reveal>
              
              <Reveal delay={400}>
                <div className="badge-grid">
                  <div 
                    className="badge-card pulse-border"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <div className="badge-icon">🎓</div>
                    <div className="badge-title">BTech CS</div>
                    <div className="badge-subtitle">SRM 2017-21</div>
                  </div>
                  <div 
                    className="badge-card pulse-border"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <div className="badge-icon">🏅</div>
                    <div className="badge-title">MTCNA</div>
                    <div className="badge-subtitle">Certified</div>
                  </div>
                  <div 
                    className="badge-card pulse-border"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <div className="badge-icon">⭐</div>
                    <div className="badge-title">Top Rated</div>
                    <div className="badge-subtitle">Plus</div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      
      {/* Projects Anchor */}
      <section className="projects-anchor section" id="projects">
        <Reveal>
          <p className="projects-anchor-text">↑ Projects showcased in the hero carousel above</p>
        </Reveal>
      </section>
      
      {/* Blog Section */}
      <section className="blog-section section" id="blog">
        <div className="section-container">
          <Reveal>
            <p className="section-subtitle">// Blog</p>
          </Reveal>
          
          <Reveal delay={100}>
            <h2 className="section-title">
              Thoughts & <span className="gradient-text">Insights</span>
            </h2>
          </Reveal>
          
          <Reveal delay={150}>
            <p className="blog-description">
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
                  className="blog-card blog-card-inner"
                  style={{ 
                    '--accent-color': blog.color,
                    animationDelay: `${index * 0.15}s`
                  }}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className="blog-meta">
                    <span 
                      className="blog-category"
                      style={{ 
                        background: `${blog.color}15`,
                        color: blog.color
                      }}
                    >
                      {blog.category}
                    </span>
                    <span className="blog-date">{blog.date}</span>
                  </div>
                  
                  <h3 className="blog-title">{blog.title}</h3>
                  
                  <p className="blog-excerpt">{blog.excerpt}</p>
                  
                  <div className="blog-link" style={{ color: blog.color }}>
                    <span>View project</span>
                    <svg className="blog-arrow" style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section className="skills-section section" id="skills">
        <div className="section-container">
          <div className="skills-grid">
            <div>
              <Reveal>
                <p className="section-subtitle">// Technical Stack</p>
              </Reveal>
              
              <Reveal delay={100}>
                <h2 className="section-title">
                  Skills that <span className="gradient-text">matter</span>
                </h2>
              </Reveal>
              
              <Reveal delay={200}>
                <p className="skills-description">
                  I'm a language and framework agnostic engineer. The right tool for the job 
                  is always my priority, without ever compromising on technical integrity.
                </p>
              </Reveal>
              
              <div>
                {skills.map((skill, index) => (
                  <Reveal key={skill.name} delay={300 + index * 50}>
                    <div className="skill-item">
                      <div className="skill-header">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-level">{skill.level}%</span>
                      </div>
                      <div className="skill-bar-container">
                        <div 
                          className="skill-bar-fill"
                          style={{ 
                            width: `${skill.level}%`,
                            background: `linear-gradient(90deg, #00ff88 0%, #00d4ff ${skill.level}%)`,
                            animation: 'fillBar 1.5s ease forwards',
                            animationDelay: `${0.3 + index * 0.1}s`
                          }}
                        />
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
            
            <div className="skills-sidebar">
              <Reveal delay={400}>
                <div className="skills-card">
                  <h3 className="skills-card-title">Also proficient in</h3>
                  <div className="tags-container">
                    {['API', 'DApps', 'Cryptocurrency', 'Front-End', 'DevOps', 'Web3', 'Smart Contracts', 'Machine Learning', 'Image Processing', 'LLMs'].map((tag) => (
                      <span 
                        key={tag}
                        className="tag"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="github-link">
                    <div className="github-icon">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="github-info-label">GitHub since 2017</div>
                      <a 
                        href="https://github.com/thinktanktom" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="github-info-link"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                      >
                        @thinktanktom
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="contact-section section" id="contact">
        <div className="contact-container">
          <Reveal>
            <p className="section-subtitle">// Get in Touch</p>
          </Reveal>
          
          <Reveal delay={100}>
            <h2 className="contact-title">
              Let's build<br />
              <span className="gradient-text">something great</span>
            </h2>
          </Reveal>
          
          <Reveal delay={200}>
            <p className="contact-description">
              Currently open to innovative projects that require high-level technical leadership. 
              Available during PST and UTC business hours.
            </p>
          </Reveal>
          
          <Reveal delay={300}>
            <div className="contact-buttons">
              <a 
                href="https://www.upwork.com/freelancers/~018a1dbf1094588c7e"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                Hire on Upwork
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              
              <a 
                href="https://www.linkedin.com/in/thomas-c-7a8ba3184/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
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
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <span style={{ color: '#fff' }}>T</span>
            <span style={{ color: '#00ff88' }}>.</span>
            <span style={{ color: '#fff' }}>C</span>
          </div>
          
          <p className="footer-copyright">© 2025 Thomas C. All rights reserved.</p>
          
          <div className="footer-social">
            <a 
              href="https://github.com/thinktanktom"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a 
              href="https://www.linkedin.com/in/thomas-c-7a8ba3184/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}