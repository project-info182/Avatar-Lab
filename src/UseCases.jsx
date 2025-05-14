import React, { Component } from 'react';
import { MessageSquare, Gamepad2, GraduationCap, Video } from 'lucide-react';

const useCasesData = [
  {
    icon: <MessageSquare size={40} className="text-purple-400" />,
    title: "Virtual Assistants",
    description: "HR bots, customer support, smart help desks that provide a human-like interaction experience with emotional cues.",
    image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg"
  },
  {
    icon: <Gamepad2 size={40} className="text-sky-400" />,
    title: "Gaming",
    description: "Immersive, emotional NPCs and AI-driven characters that respond to players with realistic expressions.",
    image: "https://images.pexels.com/photos/7915283/pexels-photo-7915283.jpeg"
  },
  {
    icon: <GraduationCap size={40} className="text-purple-400" />,
    title: "Education",
    description: "AI tutors, sign-language avatars, and multilingual teachers that engage students with personalized feedback.",
    image: "https://images.pexels.com/photos/5905700/pexels-photo-5905700.jpeg"
  },
  {
    icon: <Video size={40} className="text-sky-400" />,
    title: "Content Creation",
    description: "Explainers, influencers, and localized video generation that scales content production effortlessly.",
    image: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg"
  }
];

class UseCases extends Component {
  // You can define the data as a static property or outside the class
  // static useCases = useCasesData;

  render() {
    return (
      <section id="usecases" className="py-20 relative">
        {/* Background decoration */}
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-sky-600/10 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-sky-400">
                Use Cases
              </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Avatar Lab is ideal for a wide range of applications
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {useCasesData.map((useCase, index) => (
              <div 
                key={index} 
                className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden group hover:shadow-lg hover:shadow-purple-500/10 transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <div className="mb-4">
                        {useCase.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                      <p className="text-gray-400">{useCase.description}</p>
                    </div>
                    <button className="mt-6 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors inline-block self-start">
                      Learn more
                    </button>
                  </div>
                  <div className="h-64 md:h-auto relative overflow-hidden">
                    <img 
                      src={useCase.image} 
                      alt={useCase.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent md:bg-gradient-to-t"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-sky-500 rounded-full text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all">
              Explore All Use Cases
            </button>
          </div>
        </div>
      </section>
    );
  }
}

export default UseCases;