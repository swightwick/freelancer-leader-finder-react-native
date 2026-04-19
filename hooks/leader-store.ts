import createContextHook from '@nkzw/create-context-hook';
import { useMemo, useState, useCallback } from 'react';
import { leaders } from '@/data/leaders';
import { Leader, Filters } from '@/types/leader';

const BOOLEAN_FILTER_KEYS = ['earrings', 'glasses', 'hat', 'necklace', 'tattoo'] as const;

export const [LeaderContext, useLeaders] = createContextHook(() => {
  const [filters, setFilters] = useState<Filters>({
    earrings: false,
    glasses: false,
    hat: false,
    necklace: false,
    tattoo: false,
    hair: 'any',
  });

  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  const filteredLeaders = useMemo(() => {
    return leaders.filter((leader: Leader) => {
      for (const key of BOOLEAN_FILTER_KEYS) {
        if (filters[key] && leader.attributes[key] !== filters[key]) return false;
      }
      if (filters.hair !== 'any' && leader.attributes.hair !== filters.hair) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const updateFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      earrings: false,
      glasses: false,
      hat: false,
      necklace: false,
      tattoo: false,
      hair: 'any',
    });
  }, []);

  const toggleFiltersCollapsed = useCallback(() => {
    setFiltersCollapsed(prev => !prev);
  }, []);

  const contextValue = useMemo(() => ({
    leaders: filteredLeaders,
    filters,
    updateFilter,
    clearFilters,
    filtersCollapsed,
    toggleFiltersCollapsed,
    totalCount: leaders.length,
    filteredCount: filteredLeaders.length,
  }), [filteredLeaders, filters, updateFilter, clearFilters, filtersCollapsed, toggleFiltersCollapsed]);

  return contextValue;
});
