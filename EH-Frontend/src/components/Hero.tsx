
import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const elements = heroRef.current?.querySelectorAll('.animate-reveal');
          elements?.forEach((el, i) => {
            setTimeout(() => {
              el.classList.add('reveal');
            }, i * 200);
          });
        }
      },
      { threshold: 0.1 }
    );
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={heroRef}
      id='hero'
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 -right-64 w-96 h-96 bg-tech-100 rounded-full filter blur-3xl opacity-50 animate-float"></div>
        <div className="absolute bottom-1/4 -left-32 w-72 h-72 bg-tech-100 rounded-full filter blur-3xl opacity-40 animate-float animation-delay-400"></div>
      </div>
      
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        {/* Hero Content */}
        <div className="text-center md:text-left">
          <h1 className="animate-reveal text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span>Empowering Young Women in Tech</span>
          </h1>
          <h2 className="animate-reveal text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto md:mx-0">
            Unlocking Digital Skills for a Future of Leadership and Bridging the Gender Gap in Africa's Tech Industry
          </h2>
          <div className="animate-reveal flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="btn-primary group">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="btn-secondary">
              Learn More
            </button>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="relative animate-reveal">
          <div className="absolute inset-0 bg-gradient-to-tr from-tech-50/30 to-tech-200/20 rounded-3xl transform rotate-3 scale-95"></div>
          <div className="relative overflow-hidden rounded-3xl shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1573164574572-cb89e39749b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80" 
              alt="Young women coding together" 
              className="w-full h-auto object-cover transform transition-transform duration-1000 hover:scale-105"
            />
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-12 rounded-full border-2 border-tech-200 flex justify-center">
          <div className="w-1.5 h-3 bg-tech-400 rounded-full mt-2 animate-pulse-soft"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
