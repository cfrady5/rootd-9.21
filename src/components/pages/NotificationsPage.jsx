import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const initialNotifications = [
  { id: 1, type: 'urgent', title: 'Compliance flag for John Doe', description: 'Missing W-9 for deal with "Campus Corner".', status: 'active' },
  { id: 2, type: 'warning', title: 'Deal approval needed for Jane Smith', description: 'New deal with "Local Diner" for $150.', status: 'active' },
  { id: 3, type: 'warning', title: 'Incomplete profile: Mike Ross', description: 'Profile is only 60% complete.', status: 'active' },
  { id: 4, type: 'completed', title: 'Onboarding complete: Emily Jones', description: 'Emily Jones has finished the onboarding quiz.', status: 'resolved' },
  { id: 5, type: 'urgent', title: 'IP Conflict Detected', description: 'Deal for "Athlete Apparel" uses restricted school logo.', status: 'active' },
];

const NotificationItem = ({ notification, onResolve }) => {
  const { toast } = useToast();
  const handleItemClick = () => {
    toast({ title: `Opening: ${notification.title}` });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex items-center justify-between p-4 mb-3 bg-card rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4 cursor-pointer" onClick={handleItemClick}>
        {notification.type === 'urgent' && <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />}
        {notification.type === 'warning' && <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />}
        {notification.type === 'completed' && <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />}
        <div>
          <p className="font-semibold text-foreground">{notification.title}</p>
          <p className="text-sm text-muted-foreground">{notification.description}</p>
        </div>
      </div>
      {notification.status === 'active' && (
        <Button variant="outline" size="sm" onClick={() => onResolve(notification.id)}>
          Mark as Resolved
        </Button>
      )}
    </motion.div>
  );
};

const NotificationsPage = ({ isDemo = true }) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResolve = (id) => {
    setNotifications(
      notifications.map(n =>
        n.id === id ? { ...n, status: 'resolved', type: 'completed' } : n
      )
    );
    toast({ title: "Notification resolved!", className: "bg-green-800 text-white" });
  };

  const urgent = notifications.filter(n => n.status === 'active' && n.type === 'urgent');
  const warning = notifications.filter(n => n.status === 'active' && n.type === 'warning');
  const completed = notifications.filter(n => n.status === 'resolved');

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Notifications - Rootd</title>
      </Helmet>
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Button variant="ghost" onClick={() => navigate(isDemo ? '/demo' : '/nil-director')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-foreground mb-8">Notifications</h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}>
          <Tabs defaultValue="urgent">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="urgent">
                Urgent
                {urgent.length > 0 && <span className="ml-2 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">{urgent.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="warning">
                Warning
                {warning.length > 0 && <span className="ml-2 h-5 w-5 flex items-center justify-center rounded-full bg-yellow-500 text-white text-xs">{warning.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="urgent" className="mt-6">
              {urgent.length > 0 ? urgent.map(n => <NotificationItem key={n.id} notification={n} onResolve={handleResolve} />) : <p className="text-center text-muted-foreground py-8">No urgent notifications.</p>}
            </TabsContent>
            <TabsContent value="warning" className="mt-6">
              {warning.length > 0 ? warning.map(n => <NotificationItem key={n.id} notification={n} onResolve={handleResolve} />) : <p className="text-center text-muted-foreground py-8">No warnings.</p>}
            </TabsContent>
            <TabsContent value="completed" className="mt-6">
              {completed.length > 0 ? completed.map(n => <NotificationItem key={n.id} notification={n} onResolve={handleResolve} />) : <p className="text-center text-muted-foreground py-8">No completed notifications.</p>}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default NotificationsPage;