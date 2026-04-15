import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name } },
    });
    setLoading(false);
    if (error) {
      toast({ title: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Account created! Welcome to Flipkart!' });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="bg-card rounded-sm shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-6">
          <Link to="/" className="text-2xl font-bold text-primary italic">Flipkart</Link>
          <p className="text-sm text-muted-foreground mt-2">Create your account</p>
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          <Input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required className="rounded-sm" />
          <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="rounded-sm" />
          <Input type="password" placeholder="Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)} required className="rounded-sm" />
          <Button type="submit" disabled={loading} className="w-full bg-flipkart-orange hover:bg-flipkart-orange/90 text-primary-foreground font-bold py-5 rounded-sm">
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
