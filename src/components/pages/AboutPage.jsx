import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Twitter } from 'lucide-react';

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Jane Doe",
      title: "CEO & Co-Founder",
      bio: "Former D1 athlete with a passion for building community-driven tech. Jane leads our vision and strategy.",
      alt: "Professional headshot of Jane Doe, a woman smiling warmly."
    },
    {
      name: "John Smith",
      title: "CTO & Co-Founder",
      bio: "A tech veteran with experience in AI and machine learning. John is the architect of our matching algorithm.",
      alt: "Professional headshot of John Smith, a man with glasses and a thoughtful expression."
    },
    {
      name: "Emily White",
      title: "Head of Partnerships",
      bio: "Emily connects Rootd with businesses and universities, building the relationships that power our network.",
      alt: "Professional headshot of Emily White, a woman in a blazer looking confident."
    }
  ];

  return (
    <div className="pt-20 min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Rootd - About Us</title>
        <meta name="description" content="Learn about Rootd's mission, values, and the team dedicated to empowering student-athletes." />
      </Helmet>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }} 
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our Story
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Rootd was born from a simple idea: NIL deals should be authentic, local, and beneficial for everyone. We saw a gap between talented student-athletes and the local businesses that are the heart of their communities. Our mission is to bridge that gap.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }} 
            className="grid md:grid-cols-3 gap-8 text-center mb-20"
          >
            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
              <h3 className="text-2xl font-bold text-forest-green mb-2">Community</h3>
              <p className="text-muted-foreground">We believe in the power of local connections.</p>
            </div>
            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
              <h3 className="text-2xl font-bold text-forest-green mb-2">Authenticity</h3>
              <p className="text-muted-foreground">We match based on shared values, not just follower counts.</p>
            </div>
            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
              <h3 className="text-2xl font-bold text-forest-green mb-2">Empowerment</h3>
              <p className="text-muted-foreground">We give athletes the tools to build their own brand.</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.4 }} 
            className="bg-card p-12 rounded-3xl shadow-lg border border-border mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Meet the Team</h2>
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-40 h-40 rounded-full flex-shrink-0 bg-muted shadow-md">
                  <img class="w-full h-full object-cover rounded-full" alt="Professional headshot of Jane Doe, a woman smiling warmly." src="https://images.unsplash.com/photo-1608875848903-06eec0bd71e2" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-foreground">{teamMembers[0].name}</h3>
                  <p className="text-forest-green font-semibold mb-2">{teamMembers[0].title}</p>
                  <p className="text-muted-foreground">{teamMembers[0].bio}</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-40 h-40 rounded-full flex-shrink-0 bg-muted shadow-md">
                  <img class="w-full h-full object-cover rounded-full" alt="Professional headshot of John Smith, a man with glasses and a thoughtful expression." src="https://images.unsplash.com/photo-1600180758890-6b94519a8ba6" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-foreground">{teamMembers[1].name}</h3>
                  <p className="text-forest-green font-semibold mb-2">{teamMembers[1].title}</p>
                  <p className="text-muted-foreground">{teamMembers[1].bio}</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-40 h-40 rounded-full flex-shrink-0 bg-muted shadow-md">
                  <img class="w-full h-full object-cover rounded-full" alt="Professional headshot of Emily White, a woman in a blazer looking confident." src="https://images.unsplash.com/photo-1608875848903-06eec0bd71e2" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-foreground">{teamMembers[2].name}</h3>
                  <p className="text-forest-green font-semibold mb-2">{teamMembers[2].title}</p>
                  <p className="text-muted-foreground">{teamMembers[2].bio}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.6 }} 
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Get in Touch</h2>
            <p className="text-lg text-muted-foreground mb-6">We'd love to hear from you. Follow us or drop us a line.</p>
            <div className="flex justify-center items-center gap-6">
              <a href="mailto:contact@rootd.tech" className="text-muted-foreground hover:text-forest-green"><Mail className="w-7 h-7" /></a>
              <a href="#" className="text-muted-foreground hover:text-forest-green"><Linkedin className="w-7 h-7" /></a>
              <a href="#" className="text-muted-foreground hover:text-forest-green"><Twitter className="w-7 h-7" /></a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;