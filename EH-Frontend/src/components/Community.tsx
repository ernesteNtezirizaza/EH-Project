
import React, { useEffect, useRef } from 'react';
import { Quote } from 'lucide-react';

const Testimonial = ({ 
  quote, 
  name, 
  role, 
  image 
}: { 
  quote: string; 
  name: string; 
  role: string; 
  image: string; 
}) => (
  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 card-hover">
    <div className="mb-4 text-tech-500">
      <Quote size={24} />
    </div>
    <p className="text-foreground mb-6">{quote}</p>
    <div className="flex items-center">
      <img 
        src={image} 
        alt={name} 
        className="h-12 w-12 rounded-full object-cover mr-4"
      />
      <div>
        <h4 className="font-semibold">{name}</h4>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  </div>
);

const Community = () => {
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

  const testimonials = [
    {
      quote: "This program completely transformed my future. I went from having no coding experience to building full-stack applications and landing my first tech job.",
      name: "Grace Mutoni",
      role: "Software Developer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    {
      quote: "The mentorship I received was invaluable. My mentor not only taught me to code but helped me navigate the tech industry as a young woman.",
      name: "Clarisse Uwase",
      role: "UI/UX Designer",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    {
      quote: "The community I found here is like family. We support each other, share resources, and celebrate each other's victories in tech.",
      name: "Diane Ishimwe",
      role: "Web Developer",
      image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    }
  ];

  return (
    <section id="community" ref={sectionRef} className="container-section">
      <div className="text-center mb-16">
        <h2 className="section-title animate-reveal">Our Community</h2>
        <p className="section-subtitle mx-auto animate-reveal">
          Meet our inspiring graduates and hear their stories of transformation through technology education.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="animate-reveal">
            <Testimonial {...testimonial} />
          </div>
        ))}
      </div>

      {/* Impact Stats */}
      <div className="mt-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="animate-reveal">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-3xl md:text-4xl font-bold text-tech-600 mb-2">2,000+</h3>
              <p className="text-muted-foreground">Students Enrolled</p>
            </div>
          </div>
          <div className="animate-reveal">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-3xl md:text-4xl font-bold text-tech-600 mb-2">85%</h3>
              <p className="text-muted-foreground">Graduation Rate</p>
            </div>
          </div>
          <div className="animate-reveal">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-3xl md:text-4xl font-bold text-tech-600 mb-2">70%</h3>
              <p className="text-muted-foreground">Job Placement</p>
            </div>
          </div>
          <div className="animate-reveal">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-3xl md:text-4xl font-bold text-tech-600 mb-2">50+</h3>
              <p className="text-muted-foreground">Partner Companies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Join Community CTA */}
      <div className="mt-24 text-center">
        <div className="animate-reveal max-w-2xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Join Our Growing Community</h3>
          <p className="text-muted-foreground mb-8">
            Connect with mentors, peers, and industry professionals who are passionate about supporting women in tech.
          </p>
          <button className="btn-primary">
            Become a Member
          </button>
        </div>
      </div>
    </section>
  );
};

export default Community;
