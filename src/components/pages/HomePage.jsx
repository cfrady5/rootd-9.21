import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight, Edit3, Users, HeartHandshake as Handshake, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("Youth Sports");

  const howItWorks = [{
    icon: <Edit3 className="w-8 h-8 text-forest-green" />,
    title: "Take the Quiz",
    description: "Answer a few questions to build your unique athlete profile."
  }, {
    icon: <Users className="w-8 h-8 text-forest-green" />,
    title: "Get Matched",
    description: "Our AI finds the perfect local businesses that align with your brand."
  }, {
    icon: <Handshake className="w-8 h-8 text-forest-green" />,
    title: "Build NIL Deals",
    description: "Connect and collaborate on authentic, community-driven partnerships."
  }];

  const sampleQuestion = {
    text: "Which cause are you most passionate about?",
    options: ["Youth Sports", "Animal Welfare", "Environmental", "Local Community"]
  };

  return (
    <div className="pt-16 bg-background text-foreground">
      <Helmet>
        <title>Rootd - Home</title>
        <meta name="description" content="Rootd in Community. Driven by Athletes. The smarter way to match athletes with local businesses." />
      </Helmet>

      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-foreground">Rootd in </span>
            <span className="text-forest-green">Community.</span>
            <br />
            <span className="text-foreground">Driven by </span>
            <span className="text-forest-green">Athletes.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            The smarter way to match athletes with local businesses.
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Discover Your Perfect NIL Match
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our intelligent quiz connects your personal brand with authentic local opportunities in just a few minutes.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} className="bg-background p-8 md:p-12 rounded-2xl shadow-lg border border-border flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h3 className="text-2xl font-bold text-foreground mb-4">See How It Works</h3>
              <p className="text-muted-foreground mb-6">Answer 30 questions to discover local brand matches. Our quiz is designed to understand your values, interests, and personality to find partnerships that are a perfect fit.</p>
              <Button onClick={() => navigate('/auth?signup=true')} className="forest-green hover:bg-forest-green-light text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                Start Matching Quiz
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <div className="lg:w-1/2 w-full bg-card p-6 rounded-xl border border-border">
              <p className="font-semibold text-foreground mb-4 text-center">{sampleQuestion.text}</p>
              <div className="space-y-3">
                {sampleQuestion.options.map((option) => {
                  const isSelected = selectedOption === option;
                  return (
                    <div
                      key={option}
                      onClick={() => setSelectedOption(option)}
                      className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${isSelected ? 'quiz-option-selected' : 'bg-background border-transparent hover:border-gray-300'}`}
                    >
                      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-white border-forest-green' : 'border-border'}`}>
                        {isSelected && <Check className="w-5 h-5 text-black" />}
                      </div>
                      <span className="flex-1 text-foreground">{option}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              A Simple Path to Partnership
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A simple, powerful process to connect you with the right opportunities.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: index * 0.2 }} viewport={{ once: true }} className="bg-card p-8 rounded-2xl shadow-sm border border-border text-center">
                <div className="bg-green-100/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomePage;