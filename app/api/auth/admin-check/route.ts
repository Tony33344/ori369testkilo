import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  let user;
  
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const { data: { user: authUser }, error: userError } = await supabase.auth.getUser(token);
    user = authUser;
  } else {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;
  }

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return NextResponse.json({ 
    user_id: user.id, 
    role: profile?.role || 'user',
    is_admin: profile?.role === 'admin' 
  });
}
