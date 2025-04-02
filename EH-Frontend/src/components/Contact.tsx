
import React, { useEffect, useRef, useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle form submission
    console.log('Form submitted:', formState);
    // For now, just reset the form
    setFormState({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    alert('Thank you for your message! We will get back to you soon.');
  };
  
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
    <section id="contact" ref={sectionRef} className="container-section bg-gray-50">
      <div className="text-center mb-16">
        <h2 className="section-title animate-reveal">Get In Touch</h2>
        <p className="section-subtitle mx-auto animate-reveal">
          Have questions about our programs or interested in partnering with us? We'd love to hear from you.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="animate-reveal">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tech-500 focus:border-transparent transition-all"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tech-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tech-500 focus:border-transparent transition-all"
                    placeholder="What is this regarding?"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tech-500 focus:border-transparent transition-all"
                    placeholder="Your message..."
                    required
                  />
                </div>
                
                <div>
                  <button type="submit" className="btn-primary w-full group">
                    Send Message
                    <Send size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="space-y-8">
          <div className="animate-reveal">
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <p className="text-muted-foreground mb-8">
              We're based in Kayonza, Rwanda, but our impact reaches across the country and beyond. Reach out to learn more about our programs.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="h-12 w-12 rounded-lg bg-tech-100 flex items-center justify-center text-tech-600 mr-4">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Location</h4>
                  <p className="text-muted-foreground">
                    Kayonza Innovation Hub<br />
                    Eastern Province, Rwanda
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-12 w-12 rounded-lg bg-tech-100 flex items-center justify-center text-tech-600 mr-4">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Email</h4>
                  <a href="mailto:info@empowerher.tech" className="text-tech-600 hover:text-tech-700 transition-colors">
                    info@empowerher.tech
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-12 w-12 rounded-lg bg-tech-100 flex items-center justify-center text-tech-600 mr-4">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Phone</h4>
                  <a href="tel:+250790728121" className="text-tech-600 hover:text-tech-700 transition-colors">
                    +250 790 728 121
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
