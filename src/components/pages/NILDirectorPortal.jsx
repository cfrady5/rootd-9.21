
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Users, DollarSign, BarChart, Briefcase, Search, FileDown, Bell, AlertTriangle, CheckCircle, ChevronDown, X, ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

const sports = ['Football', 'Golf', 'Swimming', 'Volleyball', 'Basketball', 'Soccer', 'Tennis', 'Baseball', 'Track & Field', 'Astronautics', 'Popcorn', 'Broadcasting', 'Racing'];
const classYears = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];
const profileCompletionRanges = {
  'Complete (100%)': (p) => p === 100,
  'In Progress (50-99%)': (p) => p >= 50 && p < 100,
  'Incomplete (<50%)': (p) => p < 50,
};
const defaultAvatar = 'https://horizons-cdn.hostinger.com/a5ca009c-59cb-4adf-8d96-7dc5195f95b7/4dc37e2a35c56d78cf3a9b89948725ba.png';

const generateMockAthletes = (count, alumni) => {
  const athletes = [];
  const usedNames = new Set();
  for (let i = 1; i <= count; i++) {
    let athleteData;
    do {
      athleteData = alumni[Math.floor(Math.random() * alumni.length)];
    } while (usedNames.has(athleteData.name));
    usedNames.add(athleteData.name);

    athletes.push({
      id: `mock${i}`,
      full_name: athleteData.name,
      sport: athleteData.sport,
      class_year: classYears[Math.floor(Math.random() * classYears.length)],
      grad_year: String(2024 + Math.floor(Math.random() * 4)),
      onboarding_complete: Math.random() > 0.2,
      avatar_url: defaultAvatar,
      profile_completion: 50 + Math.floor(Math.random() * 51),
      deals_completed: Math.floor(Math.random() * 20),
      total_revenue: Math.floor(Math.random() * 20000),
      last_login: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 10).toISOString(),
      email: `${athleteData.name.split(' ').join('.').toLowerCase()}@demo.edu`,
      phone_number: `+1 (555) ${String(Math.floor(100 + Math.random() * 900))}-${String(Math.floor(1000 + Math.random() * 9000))}`,
      hometown: 'Palo Alto, CA',
      bio: 'A legendary student-athlete with a decorated history.',
      social_reach: `${(Math.random() * 100).toFixed(1)}k`,
      compliance_status: Math.random() > 0.15 ? 'All Clear' : 'Missing Docs',
    });
  }
  return athletes;
};

const NILDirectorPortal = ({ profile, isDemo = false, schoolData }) => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [athletes, setAthletes] = useState([]);
  const [loadingAthletes, setLoadingAthletes] = useState(false);
  const [showDemo, setShowDemo] = useState(isDemo);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const { toast } = useToast();

  const [filters, setFilters] = useState({
    sport: [],
    class_year: [],
    profile_completion: [],
  });
  const [sortConfig, setSortConfig] = useState({ key: 'full_name', direction: 'ascending' });

  const mockAthletes = useMemo(() => {
    if (isDemo && schoolData) {
      return generateMockAthletes(schoolData.alumni.length, schoolData.alumni);
    }
    return [];
  }, [isDemo, schoolData]);

  const onViewAthlete = (athleteProfile) => {
    if (isDemo) {
      setSelectedAthlete(athleteProfile);
      return;
    }
    navigate(`/athlete-profile/${athleteProfile.id}`, { state: { athlete: athleteProfile } });
  };

  const fetchAthletes = useCallback(async (directorProfile) => {
    if (!directorProfile || directorProfile.role !== 'director') return;
    setLoadingAthletes(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('school', directorProfile.school)
      .eq('role', 'athlete');
    
    if (error) {
      toast({ variant: 'destructive', title: 'Error fetching athletes', description: error.message });
      setAthletes([]);
    } else {
      setAthletes(data);
    }
    setLoadingAthletes(false);
  }, [toast]);

  useEffect(() => {
    if (showDemo) {
      setAthletes(mockAthletes);
    } else if (user && profile?.role === 'director') {
      fetchAthletes(profile);
    }
  }, [user, profile, fetchAthletes, showDemo, mockAthletes]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast({ variant: "destructive", title: "Login Failed", description: error.message });
    }
    setLoading(false);
  };

  const handleRequestAccess = () => {
    toast({ title: "🚧 Feature not implemented yet. You can request it in your next prompt! 🚀" });
  };
  
  const handleExport = (format) => {
    toast({ title: `🚧 ${format.toUpperCase()} export not implemented yet. You can request it in your next prompt! 🚀` });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues };
    });
  };

  const clearFilters = () => {
    setFilters({ sport: [], class_year: [], profile_completion: [] });
    setSearchTerm('');
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedAthletes = useMemo(() => {
    let sortableItems = [...athletes];

    sortableItems = sortableItems.filter(athlete => {
      const searchMatch = searchTerm === '' ||
        athlete.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        athlete.sport?.toLowerCase().includes(searchTerm.toLowerCase());

      const sportMatch = filters.sport.length === 0 || filters.sport.includes(athlete.sport);
      const yearMatch = filters.class_year.length === 0 || filters.class_year.includes(athlete.class_year);
      const completionMatch = filters.profile_completion.length === 0 || filters.profile_completion.some(range => profileCompletionRanges[range](athlete.profile_completion));

      return searchMatch && sportMatch && yearMatch && completionMatch;
    });

    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableItems;
  }, [athletes, searchTerm, filters, sortConfig]);

  const currentProfile = showDemo ? { school: schoolData?.name } : profile;

  if (isDemo && selectedAthlete) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <ProfilePage 
          profile={selectedAthlete} 
          isDirectorView={true} 
          isDemo={true} 
          onBack={() => setSelectedAthlete(null)} 
        />
      </div>
    );
  }

  if (!showDemo && (!user || profile?.role !== 'director')) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-background">
        <Helmet><title>Rootd - NIL Director Portal</title></Helmet>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md p-8 space-y-8 bg-card rounded-2xl shadow-lg border border-border">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">NIL Director Portal</h1>
            <p className="text-muted-foreground mt-4 max-w-sm mx-auto">View your school’s roster, manage athlete profiles, and monitor NIL deals all in one place.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="director@rootd.edu" required /></div>
            <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required /></div>
            <Button type="submit" disabled={loading} className="w-full forest-green text-white">{loading ? <Loader2 className="animate-spin" /> : 'Login'}</Button>
          </form>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
          <Button variant="outline" className="w-full" onClick={() => navigate('/demo')}>View Demo</Button>
          <div className="text-center pt-4"><button onClick={handleRequestAccess} className="text-sm text-forest-green hover:underline">Don't have an account? Request access</button></div>
        </motion.div>
      </div>
    );
  }

  const activeFilters = Object.entries(filters).flatMap(([key, values]) => values.map(value => ({ type: key, value })));

  return (
    <div className={`${isDemo ? '' : 'pt-20'} min-h-screen bg-background`}>
      <Helmet><title>Director Dashboard - {currentProfile?.school}</title></Helmet>
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Director Dashboard</h1>
            <p className="text-xl text-muted-foreground">{currentProfile?.school}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            {isDemo && <img alt={`${schoolData?.name} Logo`} className="h-12 w-auto" src={schoolData?.logo} />}
            {!isDemo && (
              <>
                <Button variant="outline" onClick={() => handleExport('csv')}><FileDown className="mr-2 h-4 w-4" /> Export CSV</Button>
                <Button variant="outline" onClick={() => handleExport('pdf')}><FileDown className="mr-2 h-4 w-4" /> Export PDF</Button>
              </>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <StatCard icon={<Users />} title="Total Athletes" value={isDemo ? 100 : athletes.length} />
          <StatCard icon={<Briefcase />} title="Active Deals" value={isDemo ? 45 : athletes.reduce((sum, a) => sum + a.deals_completed, 0)} />
          <StatCard icon={<DollarSign />} title="Deal Value (Semester)" value={`$${isDemo ? '85,000' : athletes.reduce((sum, a) => sum + a.total_revenue, 0).toLocaleString()}`} />
          <StatCard icon={<AlertTriangle className="text-yellow-500" />} title="Compliance Alerts" value={isDemo ? 3 : athletes.filter(a => a.compliance_status !== 'All Clear').length} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }} className="lg:col-span-2 bg-card p-8 rounded-2xl shadow-lg border border-border">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Athlete Roster</h2>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 mb-4 p-4 bg-background rounded-lg">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search by name..." className="pl-10 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <FilterDropdown title="Sport" options={sports} selected={filters.sport} onChange={(v) => handleFilterChange('sport', v)} />
              <FilterDropdown title="Class Year" options={classYears} selected={filters.class_year} onChange={(v) => handleFilterChange('class_year', v)} />
              <FilterDropdown title="Profile %" options={Object.keys(profileCompletionRanges)} selected={filters.profile_completion} onChange={(v) => handleFilterChange('profile_completion', v)} />
              {activeFilters.length > 0 && <Button variant="ghost" onClick={clearFilters} className="text-sm text-forest-green">Clear All</Button>}
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {activeFilters.map(({ type, value }) => (
                  <span key={`${type}-${value}`} className="flex items-center gap-1 bg-muted text-muted-foreground text-xs font-medium px-2 py-1 rounded-full">
                    {value}
                    <button onClick={() => handleFilterChange(type, value)}><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            )}

            {loadingAthletes && !isDemo ? (
              <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-forest-green" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-background">
                    <tr>
                      <SortableHeader label="Name" sortKey="full_name" sortConfig={sortConfig} requestSort={requestSort} />
                      <SortableHeader label="Sport" sortKey="sport" sortConfig={sortConfig} requestSort={requestSort} />
                      <SortableHeader label="Class Year" sortKey="class_year" sortConfig={sortConfig} requestSort={requestSort} />
                      <SortableHeader label="Profile %" sortKey="profile_completion" sortConfig={sortConfig} requestSort={requestSort} />
                      <SortableHeader label="Deals" sortKey="deals_completed" sortConfig={sortConfig} requestSort={requestSort} />
                      <SortableHeader label="Revenue" sortKey="total_revenue" sortConfig={sortConfig} requestSort={requestSort} />
                      <SortableHeader label="Compliance" sortKey="compliance_status" sortConfig={sortConfig} requestSort={requestSort} />
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {filteredAndSortedAthletes.map((athlete) => (
                      <tr key={athlete.id} className="hover:bg-accent">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button onClick={() => onViewAthlete(athlete)} className="flex items-center text-left w-full">
                            <Avatar className="h-10 w-10"><AvatarImage src={athlete.avatar_url} /><AvatarFallback>{athlete.full_name?.charAt(0)}</AvatarFallback></Avatar>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-foreground hover:text-forest-green">{athlete.full_name}</div>
                              <div className="text-sm text-muted-foreground">{athlete.email}</div>
                            </div>
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{athlete.sport}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{athlete.class_year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{athlete.profile_completion || 0}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{athlete.deals_completed || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">${(athlete.total_revenue || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn("px-2 inline-flex text-xs leading-5 font-semibold rounded-full", athlete.compliance_status === 'All Clear' ? 'bg-green-100/10 text-green-400' : 'bg-yellow-100/10 text-yellow-400')}>
                            {athlete.compliance_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onViewAthlete(athlete)}>View Profile</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleExport('Deals PDF')}>Deals Report (PDF)</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleExport('Deals CSV')}>Deals Report (CSV)</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleExport('Compliance PDF')}>Compliance Report (PDF)</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleExport('Compliance CSV')}>Compliance Report (CSV)</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }} className="space-y-8">
            <NotificationPanel isDemo={isDemo} />
            <BusinessInsightsPanel isDemo={isDemo} schoolData={schoolData} />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

const FilterDropdown = ({ title, options, selected, onChange }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="flex items-center gap-2">
        {title}
        {selected.length > 0 && <span className="bg-forest-green text-white h-5 w-5 text-xs rounded-full flex items-center justify-center">{selected.length}</span>}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56 bg-card border-border">
      {options.map(option => (
        <DropdownMenuCheckboxItem
          key={option}
          checked={selected.includes(option)}
          onCheckedChange={() => onChange(option)}
          className="focus:bg-accent"
        >
          {option}
        </DropdownMenuCheckboxItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

const SortableHeader = ({ label, sortKey, sortConfig, requestSort }) => {
  const isActive = sortConfig.key === sortKey;
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
      <button onClick={() => requestSort(sortKey)} className="flex items-center gap-2">
        {label}
        <ArrowUpDown className={cn("h-4 w-4", isActive ? "text-foreground" : "text-muted-foreground")} />
      </button>
    </th>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="bg-card p-6 rounded-2xl shadow-lg border border-border">
    <div className="flex items-center justify-between"><h3 className="text-sm font-medium text-muted-foreground">{title}</h3><div className="text-forest-green">{icon}</div></div>
    <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
  </div>
);

const NotificationPanel = ({ isDemo }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const handleResolve = (e) => {
    e.stopPropagation();
    toast({ title: "Notification marked as resolved!" });
  };
  const handleNotificationClick = () => {
    navigate('/notifications', { state: { isDemo } });
  };

  return (
    <div className="bg-card p-6 rounded-2xl shadow-lg border border-border">
      <h3 className="text-xl font-bold text-foreground mb-4 flex items-center"><Bell className="mr-2 h-5 w-5" /> Notifications</h3>
      <ul className="space-y-4">
        <li onClick={handleNotificationClick} className="flex items-start gap-3 cursor-pointer hover:bg-accent p-2 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground flex-grow">Deal approval needed for <strong>Jane Smith</strong> with <strong>Local Diner.</strong></p>
          <Button size="sm" variant="ghost" onClick={handleResolve} className="text-xs">Resolve</Button>
        </li>
        <li onClick={handleNotificationClick} className="flex items-start gap-3 cursor-pointer hover:bg-accent p-2 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground flex-grow"><strong>Emily Jones</strong> completed onboarding quiz.</p>
          <Button size="sm" variant="ghost" onClick={handleResolve} className="text-xs">Resolve</Button>
        </li>
        <li onClick={handleNotificationClick} className="flex items-start gap-3 cursor-pointer hover:bg-accent p-2 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground flex-grow">Compliance flag for <strong>John Doe</strong> – missing W-9.</p>
          <Button size="sm" variant="ghost" onClick={handleResolve} className="text-xs">Resolve</Button>
        </li>
      </ul>
      <Button variant="link" className="text-forest-green p-0 h-auto mt-4" onClick={() => navigate('/notifications', { state: { isDemo } })}>View all</Button>
    </div>
  );
};

const BusinessInsightsPanel = ({ isDemo, schoolData }) => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate('/business-insights', { state: { isDemo, schoolData } })} className="w-full text-left bg-card p-6 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow hover:border-primary">
      <h3 className="text-xl font-bold text-foreground mb-4 flex items-center"><BarChart className="mr-2 h-5 w-5" /> Business Insights</h3>
      <div className="space-y-4">
        {schoolData?.map.businesses.slice(0, 3).map(biz => (
          <div key={biz.id}>
            <p className="text-sm font-medium text-muted-foreground">{biz.category}</p>
            <p className="text-lg font-bold text-foreground">{biz.deals} Matches</p>
          </div>
        ))}
      </div>
      <span className="text-forest-green text-sm font-semibold mt-4 inline-block">See full report &rarr;</span>
    </button>
  );
};

export default NILDirectorPortal;
