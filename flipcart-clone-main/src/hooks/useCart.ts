import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getSessionId } from '@/lib/session';
import { toast } from '@/hooks/use-toast';

async function getOrCreateCart() {
  const sessionId = getSessionId();
  const { data: existing } = await supabase
    .from('carts')
    .select('*')
    .eq('session_id', sessionId)
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await supabase
    .from('carts')
    .insert({ session_id: sessionId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export function useCart() {
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const cart = await getOrCreateCart();
      const { data: items, error } = await supabase
        .from('cart_items')
        .select('*, products(*)')
        .eq('cart_id', cart.id);
      if (error) throw error;
      return { cart, items: items || [] };
    },
  });

  const addToCart = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      const cart = await getOrCreateCart();
      
      const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_id', cart.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({ cart_id: cart.id, product_id: productId, quantity });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({ title: 'Added to cart!' });
    },
  });

  const updateQuantity = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (quantity <= 0) {
        const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('cart_items').update({ quantity }).eq('id', itemId);
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const removeItem = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const clearCart = useMutation({
    mutationFn: async () => {
      const cart = await getOrCreateCart();
      const { error } = await supabase.from('cart_items').delete().eq('cart_id', cart.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const cartItemCount = cartQuery.data?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return { cartQuery, addToCart, updateQuantity, removeItem, clearCart, cartItemCount };
}
