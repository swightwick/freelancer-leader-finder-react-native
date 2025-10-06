import createContextHook from '@nkzw/create-context-hook';
import { useMemo, useState, useCallback } from 'react';
import { leaders } from '@/data/leaders';
import { Leader, Filters } from '@/types/leader';

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
      if (filters.earrings && leader.attributes.earrings !== filters.earrings) {
        return false;
      }
      if (filters.glasses && leader.attributes.glasses !== filters.glasses) {
        return false;
      }
      if (filters.hat && leader.attributes.hat !== filters.hat) {
        return false;
      }
      if (filters.necklace && leader.attributes.necklace !== filters.necklace) {
        return false;
      }
      if (filters.tattoo && leader.attributes.tattoo !== filters.tattoo) {
        return false;
      }
      if (filters.hair !== 'any' && leader.attributes.hair !== filters.hair) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const updateFilter = useCallback((key: keyof Filters, value: any) => {
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