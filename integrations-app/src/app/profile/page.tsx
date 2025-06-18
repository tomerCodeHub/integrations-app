// src/app/profile/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import SidebarLayout from '../components/SidebarLayout'

export default function ProfilePage() {
  const [email, setEmail] = useState<string | null>(null)
  const [username, setUsername] = useState<string>('')
  const [createdAt, setCreatedAt] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  //  Fetch profile info after login
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
  
      if (!user) return;
  
      setEmail(user.email || null);
      setCreatedAt(user.created_at);
  
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
  
        if (error) throw error;
  
        setUsername(data?.username || '');
      } catch (error: any) {
        // Delay logging to avoid flashing error on first load
        console.warn('Non-critical profile fetch delay:', error.message || error);
      }
    };
  
    fetchProfile();
  }, []);

  //  Save updated username
  const handleUpdate = async () => {
    setMessage('')
    setError('')

    const { data: sessionData } = await supabase.auth.getSession()
    const user = sessionData?.session?.user

    if (!user) {
      setError('User not found.')
      return
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, username })

    if (error) {
      setError('Update failed: ' + error.message)
    } else {
      setMessage('Username updated successfully!')
    }
  }

  return (
    <SidebarLayout>
      <div className="max-w-lg">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

        {error && <div className="alert alert-error mb-4">{error}</div>}
        {message && <div className="alert alert-success mb-4">{message}</div>}

        <div className="form-control mb-4">
          <label className="label pr-9">Email</label>
          <input
            className="input input-bordered"
            type="text"
            value={email || ''}
            disabled
          />
        </div>

        <div className="form-control mb-4">
          <label className="label pr-1">Username</label>
          <input
            className="input input-bordered"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-control mb-4">
          <label className="label pr-1">Created At</label>
          <input
            className="input input-bordered"
            type="text"
            value={createdAt ? new Date(createdAt).toLocaleString() : ''}
            disabled
          />
        </div>

        <button onClick={handleUpdate} className="btn btn-primary">
          Save Changes
        </button>
      </div>
    </SidebarLayout>
  )
}
