
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, ChevronDown, School as University } from 'lucide-react';
import AthleteDashboard from './AthleteDashboard';
import NILDirectorPortal from './NILDirectorPortal';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const demoSchools = {
  stanford: {
    name: 'Stanford University',
    logo: 'https://horizons-cdn.hostinger.com/a5ca009c-59cb-4adf-8d96-7dc5195f95b7/stanford-cardinal-logo-transparent-free-png.webp',
    alumni: [
      { name: 'John Elway', sport: 'Football' }, { name: 'Tiger Woods', sport: 'Golf' },
      { name: 'Andrew Luck', sport: 'Football' }, { name: 'Christian McCaffrey', sport: 'Football' },
      { name: 'Katie Ledecky', sport: 'Swimming' }, { name: 'Simone Manuel', sport: 'Swimming' },
      { name: 'Kerri Walsh Jennings', sport: 'Volleyball' }, { name: 'Brook Lopez', sport: 'Basketball' },
      { name: 'Richard Sherman', sport: 'Football' }, { name: 'Michelle Wie', sport: 'Golf' },
      { name: 'Julie Foudy', sport: 'Soccer' }, { name: 'Zach Ertz', sport: 'Football' },
    ],
    map: {
      center: [37.4275, -122.1697],
      zoom: 15,
      businesses: [
        { id: 1, name: 'Stanford Bookstore', category: 'Bookstores', deals: 15, position: [37.425, -122.17] },
        { id: 2, name: 'Coupa Cafe', category: 'Coffee Shops', deals: 10, position: [37.428, -122.165] },
        { id: 3, name: 'Arrillaga Outdoor Education and Recreation Center', category: 'Fitness Studios', deals: 8, position: [37.430, -122.172] },
      ]
    }
  },
  purdue: {
    name: 'Purdue University',
    logo: 'https://horizons-cdn.hostinger.com/a5ca009c-59cb-4adf-8d96-7dc5195f95b7/purdue-boilermakers-logo-transparent-free-png.webp',
    alumni: [
      { name: 'Drew Brees', sport: 'Football' }, { name: 'Neil Armstrong', sport: 'Astronautics' },
      { name: 'Orville Redenbacher', sport: 'Popcorn' }, { name: 'Bob Griese', sport: 'Football' },
      { name: 'Glenn Robinson', sport: 'Basketball' }, { name: 'Brian Lamb', sport: 'Broadcasting' },
      { name: 'Akin Ayodele', sport: 'Football' }, { name: 'Ryan Newman', sport: 'Racing' },
    ],
    map: {
      center: [40.424, -86.915],
      zoom: 14,
      businesses: [
        { id: 1, name: 'Boiler-Up Coffee', category: 'Coffee Shops', deals: 5, position: [40.4237, -86.9212] },
        { id: 2, name: 'Purdue Fitness Co.', category: 'Fitness Studios', deals: 8, position: [40.4259, -86.9138] },
        { id: 3, name: 'The Boilermaker Store', category: 'Apparel Stores', deals: 12, position: [40.4240, -86.9110] },
      ]
    }
  }
};

const DemoToggle = ({ activeDemo, setActiveDemo }) => {
  return (
    <div className="relative flex items-center justify-center bg-muted p-1.5 rounded-full w-full max-w-md mx-auto">
      <motion.div
        className="absolute left-1.5 top-1.5 bottom-1.5 bg-background rounded-full shadow-md"
        animate={{ x: activeDemo === 'athlete' ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ width: 'calc(50% - 6px)' }}
      />
      <button
        onClick={() => setActiveDemo('athlete')}
        className="relative z-10 flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors"
      >
        <User className={`h-5 w-5 transition-colors ${activeDemo === 'athlete' ? 'text-forest-green' : 'text-muted-foreground'}`} />
        <span className={activeDemo === 'athlete' ? 'text-foreground' : 'text-muted-foreground'}>Athlete Profile</span>
      </button>
      <button
        onClick={() => setActiveDemo('director')}
        className="relative z-10 flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors"
      >
        <Shield className={`h-5 w-5 transition-colors ${activeDemo === 'director' ? 'text-forest-green' : 'text-muted-foreground'}`} />
        <span className={activeDemo === 'director' ? 'text-foreground' : 'text-muted-foreground'}>Director Portal</span>
      </button>
    </div>
  );
};

const DemoPage = () => {
  const [activeDemo, setActiveDemo] = useState('athlete');
  const [selectedSchool, setSelectedSchool] = useState('stanford');

  const schoolData = demoSchools[selectedSchool];

  return (
    <div className="pt-20 min-h-screen bg-background">
      <Helmet>
        <title>Rootd - Demo Mode</title>
        <meta name="description" content="Explore the features of the Rootd platform for athletes and NIL directors." />
      </Helmet>

      <header className="bg-card border-b border-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-foreground">Platform Demo</h1>
            <p className="mt-2 text-lg text-muted-foreground">You are in <span className="font-semibold text-forest-green">Demo Mode</span>. All data is for illustrative purposes only.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }} className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <DemoToggle activeDemo={activeDemo} setActiveDemo={setActiveDemo} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <University className="mr-2 h-4 w-4" />
                  {schoolData.name}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.entries(demoSchools).map(([key, school]) => (
                  <DropdownMenuItem key={key} onSelect={() => setSelectedSchool(key)}>
                    {school.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>
      </header>

      <main className="max-w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeDemo}-${selectedSchool}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            {activeDemo === 'athlete' ? (
              <AthleteDashboard isDemo={true} schoolData={schoolData} />
            ) : (
              <NILDirectorPortal isDemo={true} schoolData={schoolData} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default DemoPage;
