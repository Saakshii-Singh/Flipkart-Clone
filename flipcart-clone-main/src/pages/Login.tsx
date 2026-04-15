import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Welcome back!' });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="bg-card rounded-sm shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-6">
          <Link to="/" className="text-2xl font-bold text-primary italic">Flipkart</Link>
          <p className="text-sm text-muted-foreground mt-2">Login to your account</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="rounded-sm" />
          <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="rounded-sm" />
          <Button type="submit" disabled={loading} className="w-full bg-flipkart-orange hover:bg-flipkart-orange/90 text-primary-foreground font-bold py-5 rounded-sm">
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          New to Flipkart? <Link to="/signup" className="text-primary font-medium hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
