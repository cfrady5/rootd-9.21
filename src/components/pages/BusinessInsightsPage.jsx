import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Building, ArrowLeft, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const BusinessInsightsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDemo = true, schoolData } = location.state || {};

  const businesses = schoolData?.map?.businesses || [];
  const position = schoolData?.map?.center || [37.4275, -122.1697];
  const zoom = schoolData?.map?.zoom || 15;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Business Insights - Rootd</title>
      </Helmet>
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Button variant="ghost" onClick={() => navigate(isDemo ? '/demo' : '/nil-director')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Business Insights</h1>
              <p className="text-xl text-muted-foreground">Partnership landscape for {schoolData?.name || 'Your School'}</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }} className="mb-8 h-[400px] rounded-2xl overflow-hidden shadow-lg border border-border">
          <MapContainer center={position} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {businesses.map(business => (
              <Marker key={business.id} position={business.position}>
                <Popup>
                  <strong>{business.name}</strong><br />
                  {business.category}<br />
                  {business.deals} deals
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }} className="bg-card p-8 rounded-2xl shadow-lg border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">Partner Directory</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-background">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Business</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Deals</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {businesses.map((business) => (
                  <tr key={business.id} className="hover:bg-accent">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 bg-muted">
                          <AvatarFallback><Building className="h-5 w-5 text-muted-foreground" /></AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">{business.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{business.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{business.deals}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default BusinessInsightsPage;