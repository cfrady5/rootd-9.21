
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Trophy, Settings, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import ProfilePage from './ProfilePage';
import { Progress } from '@/components/ui/progress';

const defaultAvatar = 'https://horizons-cdn.hostinger.com/a5ca009c-59cb-4adf-8d96-7dc5195f95b7/4dc37e2a35c56d78cf3a9b89948725ba.png';

const mockDemoMatches = [
  { id: 1, name: 'Brand X Coffee', type: 'Coffee Shop', reason: 'Gift card for social media post.', email: 'contact@brandx.coffee', website: 'https://brandx.coffee', deal_types: ['Social Post', 'Event Appearance'] },
  { id: 2, name: 'Local Gym', type: 'Fitness Center', reason: '6-month membership for 3 posts.', email: 'info@localgym.com', website: 'https://localgym.com', deal_types: ['Merchandise', 'Social Post'] },
];

const AthleteDashboard = ({ profile: initialProfile, setProfile: setAppProfile, isDemo = false, schoolData }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  const mockDemoProfile = useMemo(() => {
    if (isDemo && schoolData) {
      const athlete = schoolData.alumni[1];
      return {
        full_name: `${athlete.name} (Demo)`,
        sport: athlete.sport,
        grad_year: 'Alumni',
        school: schoolData.name,
        onboarding_complete: true,
        avatar_url: defaultAvatar,
        bio: 'A legendary athlete exploring new opportunities.',
        social_links: true,
      };
    }
    return {};
  }, [isDemo, schoolData]);

  const [profile, setProfile] = useState(isDemo ? mockDemoProfile : initialProfile);

  useEffect(() => {
    if (isDemo) {
      setProfile(mockDemoProfile);
    } else {
      setProfile(initialProfile);
    }
  }, [initialProfile, isDemo, mockDemoProfile]);

  const handleProfileUpdate = (updatedProfile) => {
    if (isDemo) {
      toast({ title: "This is a demo!", description: "Profile changes are not saved." });
      return;
    }
    setProfile(updatedProfile);
    setAppProfile(updatedProfile);
  };

  useEffect(() => {
    if (isDemo) {
      setMatches(mockDemoMatches);
      return;
    }
    if (user && activeTab === 'matches') {
      const fetchMatches = async () => {
        setLoadingMatches(true);
        // In a real app, this would call Google Places API or our matching engine
        const { data, error } = await supabase
          .from('business_matches')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          toast({ variant: 'destructive', title: 'Error fetching matches.' });
        } else {
          setMatches(data.map(d => ({...d, deal_types: ['Social Post', 'Event Appearance']})));
        }
        setLoadingMatches(false);
      };
      fetchMatches();
    }
  }, [user, activeTab, toast, isDemo]);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab profile={profile} matches={matches} isDemo={isDemo} />;
      case 'matches':
        return <MatchesTab matches={matches} loading={loadingMatches} isDemo={isDemo} />;
      case 'profile':
        return <ProfilePage profile={profile} setProfile={handleProfileUpdate} isDemo={isDemo} />;
      case 'compliance':
        return <ComplianceTab isDemo={isDemo} />;
      default:
        return <OverviewTab profile={profile} matches={matches} isDemo={isDemo} />;
    }
  };

  return (
    <div className={`${isDemo ? '' : 'pt-20'} min-h-screen bg-background`}>
      <Helmet>
        <title>Rootd - Athlete Dashboard</title>
        <meta name="description" content="Manage your athlete profile, opportunities, and connections." />
      </Helmet>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {!isDemo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-left mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              Athlete Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Welcome back, {profile?.full_name || 'Athlete'}!
            </p>
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <nav className="space-y-2">
              <DashboardNavItem icon={<User />} label="Overview" tabName="overview" activeTab={activeTab} setActiveTab={setActiveTab} />
              <DashboardNavItem icon={<Trophy />} label="My Matches" tabName="matches" activeTab={activeTab} setActiveTab={setActiveTab} />
              <DashboardNavItem icon={<Settings />} label="Edit Profile" tabName="profile" activeTab={activeTab} setActiveTab={setActiveTab} />
              <DashboardNavItem icon={<FileText />} label="Compliance" tabName="compliance" activeTab={activeTab} setActiveTab={setActiveTab} />
            </nav>
          </aside>
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

const DashboardNavItem = ({ icon, label, tabName, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(tabName)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-colors border-2 ${
      activeTab === tabName
        ? 'quiz-option-selected'
        : 'text-foreground hover:bg-accent border-transparent'
    }`}
  >
    {React.cloneElement(icon, { className: activeTab === tabName ? 'text-forest-green' : 'text-muted-foreground' })}
    <span>{label}</span>
  </button>
);

const ProfileCompletion = ({ profile }) => {
  const completionChecks = [
    { label: 'Complete Quiz', completed: profile?.onboarding_complete },
    { label: 'Add a Bio', completed: !!profile?.bio },
    { label: 'Add a Headshot', completed: !!profile?.avatar_url && profile.avatar_url !== defaultAvatar },
    { label: 'Connect Socials', completed: !!profile?.social_links },
  ];
  const completedCount = completionChecks.filter(c => c.completed).length;
  const percentage = (completedCount / completionChecks.length) * 100;

  return (
    <div className="bg-card p-8 rounded-2xl shadow-lg border border-border space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Profile Completion</h2>
      <div className="flex items-center gap-4">
        <Progress value={percentage} className="w-full" />
        <span className="font-bold text-lg text-forest-green">{Math.round(percentage)}%</span>
      </div>
      <ul className="space-y-2 pt-2">
        {completionChecks.map(check => (
          <li key={check.label} className="flex items-center gap-3 text-sm">
            {check.completed ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-muted-foreground" />}
            <span className={check.completed ? 'text-foreground' : 'text-muted-foreground'}>{check.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const OverviewTab = ({ profile, matches, isDemo }) => (
  <div className="space-y-8">
    <ProfileCompletion profile={profile} />
    <div className="bg-card p-8 rounded-2xl shadow-lg border border-border space-y-8">
      <h2 className="text-2xl font-bold text-foreground">At a Glance</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <StatCard title="Sport" value={profile?.sport || 'N/A'} />
        <StatCard title="Year" value={profile?.grad_year || 'N/A'} />
        <StatCard title="School" value={profile?.school || 'N/A'} />
      </div>
    </div>
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="bg-background p-6 rounded-xl border border-border text-center">
    <p className="text-sm text-muted-foreground font-medium">{title}</p>
    <p className="text-2xl font-bold text-foreground">{value}</p>
  </div>
);

const MatchesTab = ({ matches, loading, isDemo }) => {
  const { toast } = useToast();
  const [selectedMatch, setSelectedMatch] = useState(null);

  if (loading) {
    return <div className="text-center p-8">Loading matches...</div>;
  }

  if (matches.length === 0 && !isDemo) {
    return (
      <div className="bg-card p-8 rounded-2xl shadow-lg border border-border text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">No Matches Found</h2>
        <p className="text-muted-foreground">Complete the quiz to generate your first set of business matches!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {matches.map((match) => (
        <div key={match.id} className="bg-card p-6 rounded-2xl shadow-lg border border-border cursor-pointer hover:border-primary transition-colors" onClick={() => setSelectedMatch(match)}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-foreground">{match.name}</h3>
              <p className="text-sm text-forest-green font-medium">{match.type}</p>
              <p className="text-muted-foreground mt-2">{match.reason}</p>
            </div>
            <Button onClick={(e) => { e.stopPropagation(); setSelectedMatch(match); }}>View Deals</Button>
          </div>
        </div>
      ))}
      {selectedMatch && <DealTypeModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />}
    </div>
  );
};

const DealTypeModal = ({ match, onClose }) => {
  const { toast } = useToast();
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-card rounded-2xl p-8 w-full max-w-lg shadow-xl border border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold text-foreground">Suggested Deals with {match.name}</h2>
          <p className="text-muted-foreground mt-1 mb-6">Based on your profile and their needs.</p>
          <div className="space-y-4">
            {match.deal_types.map(deal => (
              <div key={deal} className="bg-background p-4 rounded-lg border border-border">
                <h3 className="font-semibold text-foreground">{deal}</h3>
                <p className="text-sm text-muted-foreground">A great way to engage with the community.</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end gap-4">
            <Button variant="ghost" onClick={onClose}>Close</Button>
            <Button className="forest-green text-white" onClick={() => toast({ title: "Feature coming soon!" })}>Generate Pitch</Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ComplianceTab = ({ isDemo }) => {
  const { toast } = useToast();
  const demoDeals = [
    { id: 1, business: 'Brand X Coffee', date: '2025-08-15', value: 50, status: 'Disclosed' },
    { id: 2, business: 'Local Gym', date: '2025-09-01', value: 300, status: 'Pending' },
  ];

  return (
    <div className="bg-card p-8 rounded-2xl shadow-lg border border-border space-y-8">
      <h2 className="text-2xl font-bold text-foreground">NIL Compliance Center</h2>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Log a New Deal</h3>
        <Button onClick={() => toast({ title: "Feature coming soon!" })}>+ Log New NIL Activity</Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Deal History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-background">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Business</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Value</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {demoDeals.map(deal => (
                <tr key={deal.id}>
                  <td className="px-4 py-3 text-sm font-medium">{deal.business}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{deal.date}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">${deal.value}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${deal.status === 'Disclosed' ? 'bg-green-100/10 text-green-400' : 'bg-yellow-100/10 text-yellow-400'}`}>
                      {deal.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Resources & FAQs</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li><a href="#" className="text-forest-green hover:underline">NCAA NIL Policy Overview</a></li>
          <li><a href="#" className="text-forest-green hover:underline">State-Specific NIL Laws</a></li>
          <li><a href="#" className="text-forest-green hover:underline">How to handle taxes for NIL income</a></li>
        </ul>
      </div>
    </div>
  );
};

export default AthleteDashboard;
