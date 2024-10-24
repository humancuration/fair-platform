import React, { useEffect } from 'react'
import { supabase } from '../supabaseClient'

const AIProjectsRealtime: React.FC = () => {
  useEffect(() => {
    const subscription = supabase
      .channel('ai_projects')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'ai_projects' },
        (payload) => {
          // Handle real-time updates
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])
}

export default AIProjectsRealtime
