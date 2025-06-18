'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Integration } from '@/types'

interface Props {
  userEmail: string | null                // Logged-in user’s email to fetch user-specific data
  integrations: Integration[]            // (Optional) initial list – not used directly
  onFilter: (filtered: Integration[]) => void // Callback to pass filtered results to parent
}

export default function SearchFilters({ userEmail, onFilter }: Props) {
  // 🔍 Filter state variables
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  /**
   * 🔎 Runs a Supabase query with filters applied
   * Called automatically whenever filter state changes
   */
  const handleFilter = async () => {
    if (!userEmail) return

    let query = supabase
      .from('integrations')
      .select('*')
      .eq('author', userEmail)

    // Case-insensitive name search
    if (searchTerm.trim()) {
      query = query.ilike('name', `%${searchTerm.trim()}%`)
    }

    // Partial match on integration_type (e.g., "Email" matches "Email Services")
    if (selectedType) {
      query = query.ilike('integration_type', `%${selectedType}%`)
    }

    // Filter by date range
    if (startDate) query = query.gte('created_at', startDate)
    if (endDate) query = query.lte('created_at', endDate)

    // Get results, sorted by most recent
    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Filter error:', error)
      return
    }

    // Return the filtered list to the parent
    onFilter(data || [])
  }

  /**
   * 🧹 Reset all filters to default values
   */
  const resetFilters = () => {
    setSearchTerm('')
    setSelectedType('')
    setStartDate('')
    setEndDate('')
  }

  /**
   * ⏱ Debounced effect to trigger filtering when any input changes
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      handleFilter()
    }, 300) // 300ms debounce

    return () => clearTimeout(timeout)
  }, [searchTerm, selectedType, startDate, endDate])

  return (
    <div className="mb-6 space-y-4">
      {/* 🔧 Filter Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Supplier name search */}
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Dropdown for integration type */}
        <select
          className="select select-bordered w-full"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Email">Email</option>
          <option value="Messaging">Messaging</option>
          <option value="Billing">Billing</option>
          <option value="Chat">Chat</option>
          <option value="CRM">CRM</option>
          <option value="Payment">Payment</option>
        </select>

        {/* Start date */}
        <input
          type="date"
          className="input input-bordered w-full"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        {/* End date */}
        <input
          type="date"
          className="input input-bordered w-full"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/*  Reset Button */}
      <div>
        <button className="btn btn-outline bg-red-200 text-black hover:bg-red-300" onClick={resetFilters}>
          Reset Filters
        </button>
      </div>
    </div>
  )
}
