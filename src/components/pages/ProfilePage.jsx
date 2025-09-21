
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/components/ui/use-toast';
import { Upload, Loader2, Mail, Phone, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const ProfileCompletionBar = ({ profile }) => {
  const fields = useMemo(() => [
    'full_name', 'sport', 'grad_year', 'hometown', 'bio', 'phone_number'
  ], []);

  const completedFields = useMemo(() => {
    if (!profile) return 0;
    return fields.filter(field => profile[field] && String(profile[field]).trim() !== '').length;
  }, [profile, fields]);

  const completionPercentage = useMemo(() => (completedFields / fields.length) * 100, [completedFields, fields.length]);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-foreground">Profile Completion</h3>
        <span className="text-lg font-bold text-forest-green">{Math.round(completionPercentage)}%</span>
      </div>
      <Progress value={completionPercentage} />
    </div>
  );
};

const ProfilePage = ({ profile, setProfile, isDirectorView = false, onBack, isDemo = false }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '', sport: '', grad_year: '', is_public: false, avatar_url: '',
    hometown: '', bio: '', phone_number: '',
  });

  const currentUser = isDirectorView ? profile : user;

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        sport: profile.sport || '',
        grad_year: profile.grad_year || '',
        is_public: profile.is_public || false,
        avatar_url: profile.avatar_url || '',
        hometown: profile.hometown || '',
        bio: profile.bio || '',
        phone_number: profile.phone_number || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (currentUser?.email_confirmed_at) {
      setConfirmed(true);
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    if (isDemo) return;
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSwitchChange = (checked) => {
    if (isDemo) return;
    setFormData({ ...formData, is_public: checked });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (isDirectorView || isDemo) {
      toast({ title: "This is a demo!", description: "Profile changes are not saved." });
      return;
    }
    setLoading(true);
    const { data: updatedProfile, error } = await supabase.from('profiles').update({ ...formData }).eq('id', user.id).select().single();
    if (error) {
      toast({ variant: "destructive", title: "Error updating profile", description: error.message });
    } else {
      setProfile(updatedProfile);
      toast({ title: "Profile Updated Successfully!" });
    }
    setLoading(false);
  };

  const uploadAvatar = async (event) => {
    if (isDirectorView || isDemo) return;
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) throw new Error('You must select an image to upload.');
      const file = event.target.files[0];
      const filePath = `${user.id}-${Math.random()}.${file.name.split('.').pop()}`;
      let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const { data: updatedProfile, error: updateError } = await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', user.id).select().single();
      if (updateError) throw updateError;
      setProfile(updatedProfile);
      toast({ title: "Avatar updated!" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error uploading avatar", description: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleResendVerification = async () => {
    setVerifying(true);
    const { error } = await supabase.auth.resend({ type: 'signup', email: user.email });
    if (error) {
      toast({ variant: "destructive", title: "Error sending verification", description: error.message });
    } else {
      toast({ title: "Verification email sent!", description: "Please check your inbox." });
    }
    setVerifying(false);
  };

  const handleCheckConfirmation = async () => {
    const { data: { user: refreshedUser } } = await supabase.auth.refreshSession();
    if (refreshedUser?.email_confirmed_at) {
      setConfirmed(true);
      toast({ title: "Email confirmed!", description: "You now have full access." });
    } else {
      toast({ variant: "destructive", title: "Not Confirmed Yet", description: "Please check your email inbox and spam." });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`${isDemo ? '' : 'pt-20'} max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8`}>
      {isDirectorView && (
        <Button variant="ghost" onClick={onBack} className="mb-4"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Roster</Button>
      )}

      {!isDirectorView && !isDemo && !confirmed && (
        <div className="mb-6 p-5 bg-yellow-100 border border-yellow-500 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center text-yellow-900">
            <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
            <p className="font-medium">Your email is not verified yet. Please confirm to unlock full access.</p>
          </div>
          <div className="flex gap-2 mt-3 sm:mt-0">
            <Button onClick={handleCheckConfirmation} disabled={verifying} className="forest-green text-white hover:bg-forest-green-light">
              {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'I’ve Confirmed'}
            </Button>
            <Button onClick={handleResendVerification} variant="outline" disabled={verifying}>
              Resend Email
            </Button>
          </div>
        </div>
      )}

      {confirmed && !isDirectorView && (
        <div className="mb-6 p-5 bg-green-100 border border-green-600 rounded-lg flex items-center justify-between">
          <div className="flex items-center text-green-900">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-700" />
            <p className="font-medium">Your email is verified. You now have full access.</p>
          </div>
        </div>
      )}

      <div className="bg-card p-8 rounded-2xl shadow-lg border border-border">
        {!isDirectorView && <ProfileCompletionBar profile={profile} />}
        <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col items-center space-y-6 p-6 bg-background rounded-xl border border-border">
            <Avatar className="w-40 h-40 border-4 border-forest-green shadow-md">
              <AvatarImage src={formData.avatar_url} alt={formData.full_name} />
              <AvatarFallback className="text-6xl bg-muted text-muted-foreground">{formData.full_name?.charAt(0)}</AvatarFallback>
            </Avatar>
            {!isDirectorView && !isDemo && (
              <>
                <Button asChild variant="outline" className="w-full max-w-[200px] cursor-pointer forest-green text-white hover:bg-forest-green-light">
                  <label htmlFor="avatar-upload" className="flex items-center justify-center"><Upload className="mr-2 h-4 w-4" /> {uploading ? 'Uploading...' : 'Upload Photo'}</label>
                </Button>
                <Input id="avatar-upload" type="file" accept="image/*" onChange={uploadAvatar} disabled={uploading} className="hidden" />
              </>
            )}
            <div className="w-full text-center space-y-2 mt-4">
              <h3 className="text-2xl font-bold text-foreground">{formData.full_name || 'Athlete Name'}</h3>
              <p className="text-muted-foreground flex items-center justify-center gap-2"><Mail className="h-4 w-4 text-forest-green" /> {profile?.email || 'athlete@demo.edu'}</p>
              <p className="text-muted-foreground flex items-center justify-center gap-2"><Phone className="h-4 w-4 text-forest-green" /> {formData.phone_number || '+1 (555) 555-5555'}</p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 bg-background rounded-xl border border-border space-y-6">
              <div className="space-y-2"><Label htmlFor="full_name" className="text-muted-foreground">Full Name</Label><Input id="full_name" value={formData.full_name} onChange={handleInputChange} disabled={isDirectorView || isDemo} /></div>
              <div className="space-y-2"><Label htmlFor="hometown" className="text-muted-foreground">Hometown</Label><Input id="hometown" value={formData.hometown} onChange={handleInputChange} disabled={isDirectorView || isDemo} /></div>
              <div className="space-y-2"><Label htmlFor="sport" className="text-muted-foreground">Sport</Label><Input id="sport" value={formData.sport} onChange={handleInputChange} disabled={isDirectorView || isDemo} /></div>
              <div className="space-y-2"><Label htmlFor="grad_year" className="text-muted-foreground">Year in School</Label><Input id="grad_year" value={formData.grad_year} onChange={handleInputChange} disabled={isDirectorView || isDemo} /></div>
              <div className="space-y-2"><Label htmlFor="phone_number" className="text-muted-foreground">Phone Number</Label><Input id="phone_number" value={formData.phone_number} onChange={handleInputChange} placeholder="+1 (555) 123-4567" disabled={isDirectorView || isDemo} /></div>
              <div className="space-y-2"><Label htmlFor="bio" className="text-muted-foreground">Bio</Label><textarea id="bio" value={formData.bio} onChange={handleInputChange} rows="3" className="w-full p-2 bg-input border-border rounded-md" disabled={isDirectorView || isDemo}></textarea></div>
              <div className="flex items-center justify-between pt-4"><Label htmlFor="is_public" className="text-muted-foreground">Public Profile</Label><Switch id="is_public" checked={formData.is_public} onCheckedChange={handleSwitchChange} disabled={isDirectorView || isDemo} /></div>
              {!isDirectorView && !isDemo && (
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={loading} className="forest-green hover:bg-forest-green-light text-white">
                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Changes'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
