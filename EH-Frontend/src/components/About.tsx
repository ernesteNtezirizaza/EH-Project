
import React, { useEffect, useRef } from 'react';
import { Code, BookOpen, Users, Award } from 'lucide-react';

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const elements = sectionRef.current?.querySelectorAll('.animate-reveal');
          elements?.forEach((el, i) => {
            setTimeout(() => {
              el.classList.add('reveal');
            }, i * 200);
          });
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section id="about" ref={sectionRef} className="container-section">
      <div className="text-center mb-16">
        <h2 className="section-title animate-reveal">Our Mission</h2>
        <p className="section-subtitle mx-auto animate-reveal">
          Empowering young women in Kayonza, Rwanda through technology education, creating pathways to success in the digital economy.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Image Section */}
        <div className="relative animate-reveal order-2 md:order-1">
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" 
              alt="Young women learning together" 
              className="w-full h-auto object-cover transition-transform duration-1000 hover:scale-105"
            />
          </div>
          <div className="absolute -top-6 -left-6 glass-dark rounded-xl p-4 shadow-lg max-w-xs hidden md:block">
            <p className="text-sm font-medium">
              "Technology is a powerful equalizer that provides access to opportunity regardless of gender or location."
            </p>
          </div>
        </div>
        
        {/* Text Section */}
        <div className="order-1 md:order-2">
          <div className="animate-reveal">
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-muted-foreground mb-6">
              We're on a mission to bridge the gender gap in Africa's tech industry by providing young women in Rwanda with the tools, skills, and confidence they need to thrive in the digital economy.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="animate-reveal flex items-start">
              <div className="h-12 w-12 rounded-lg bg-tech-100 flex items-center justify-center text-tech-600 mr-4">
                <Code size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Essential Digital Skills</h4>
                <p className="text-muted-foreground">
                  We teach practical coding skills with real-world applications, preparing students for careers in technology.
                </p>
              </div>
            </div>
            
            <div className="animate-reveal flex items-start">
              <div className="h-12 w-12 rounded-lg bg-tech-100 flex items-center justify-center text-tech-600 mr-4">
                <Users size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Supportive Community</h4>
                <p className="text-muted-foreground">
                  Our program fosters a collaborative environment where young women support and inspire each other.
                </p>
              </div>
            </div>
            
            <div className="animate-reveal flex items-start">
              <div className="h-12 w-12 rounded-lg bg-tech-100 flex items-center justify-center text-tech-600 mr-4">
                <BookOpen size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Continuous Learning</h4>
                <p className="text-muted-foreground">
                  We provide ongoing education and resources to help our students stay current with evolving technologies.
                </p>
              </div>
            </div>
            
            <div className="animate-reveal flex items-start">
              <div className="h-12 w-12 rounded-lg bg-tech-100 flex items-center justify-center text-tech-600 mr-4">
                <Award size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Career Opportunities</h4>
                <p className="text-muted-foreground">
                  We connect our graduates with internships and job opportunities in the tech industry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
