
import React, { useEffect, useRef } from 'react';
import { FileCode, Globe, Database, BarChart3, ArrowRight } from 'lucide-react';

const CourseCard = ({ 
  title, 
  description, 
  icon: Icon, 
  level, 
  weeks, 
  color 
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType; 
  level: string; 
  weeks: number; 
  color: string; 
}) => (
  <div className="card-hover rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm">
    <div className={`h-2 ${color}`}></div>
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`h-12 w-12 rounded-lg ${color.replace('bg-', 'bg-opacity-10 text-')} flex items-center justify-center`}>
          <Icon size={24} />
        </div>
        <div className="flex space-x-2">
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
            {level}
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
            {weeks} weeks
          </span>
        </div>
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <button className="text-tech-600 font-medium text-sm flex items-center hover:text-tech-700 transition-colors group">
        Learn More 
        <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
);

const Courses = () => {
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

  const courses = [
    {
      title: "Introduction to HTML & CSS",
      description: "Learn the building blocks of the web and create your first responsive website from scratch.",
      icon: FileCode,
      level: "Beginner",
      weeks: 6,
      color: "bg-tech-500"
    },
    {
      title: "JavaScript Fundamentals",
      description: "Master the language of the web with practical exercises and real-world projects.",
      icon: Globe,
      level: "Intermediate",
      weeks: 8,
      color: "bg-tech-600"
    },
    {
      title: "Web Development Bootcamp",
      description: "A comprehensive course covering front-end and back-end development with modern frameworks.",
      icon: Database,
      level: "Advanced",
      weeks: 12,
      color: "bg-tech-700"
    },
    {
      title: "Data Analysis with Python",
      description: "Learn to analyze and visualize data using Python, pandas, and popular data science libraries.",
      icon: BarChart3,
      level: "Intermediate",
      weeks: 10,
      color: "bg-tech-800"
    }
  ];

  return (
    <section id="courses" ref={sectionRef} className="container-section bg-gray-50">
      <div className="text-center mb-16">
        <h2 className="section-title animate-reveal">Our Courses</h2>
        <p className="section-subtitle mx-auto animate-reveal">
          Comprehensive tech education designed specifically for young women, focusing on practical skills and real-world applications.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course, index) => (
          <div key={index} className="animate-reveal">
            <CourseCard {...course} />
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <div className="animate-reveal">
          <p className="text-muted-foreground mb-6">
            All courses include mentorship, project-based learning, and certificates upon completion
          </p>
          <button className="btn-primary group">
            View All Courses
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Courses;
