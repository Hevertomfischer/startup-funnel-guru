
import { useState } from 'react';
import { usePortfolioStartups } from './use-portfolio-startups';
import { useQuery } from '@tanstack/react-query';
import { 
  getStartupKPIs, 
  getStartupBoardMeetings, 
  getStartupStrategicNeeds, 
  getStartupHighlights 
} from '@/services/portfolio';

export const usePortfolio = () => {
  const [selectedStartupId, setSelectedStartupId] = useState<string | null>(null);
  
  // Fetch all portfolio startups
  const { 
    data: startups = [], 
    isLoading: isLoadingStartups,
    error: startupsError,
    refetch: refetchStartups
  } = usePortfolioStartups();
  
  // Find the selected startup from the list
  const selectedStartup = selectedStartupId 
    ? startups.find(startup => startup.id === selectedStartupId) 
    : null;
  
  // Fetch KPIs for the selected startup
  const { 
    data: kpis = [], 
    isLoading: isLoadingKPIs,
    refetch: refetchKPIs
  } = useQuery({
    queryKey: ['startup', selectedStartupId, 'kpis'],
    queryFn: () => getStartupKPIs(selectedStartupId!),
    enabled: !!selectedStartupId,
  });
  
  // Fetch board meetings for the selected startup
  const { 
    data: boardMeetings = [], 
    isLoading: isLoadingMeetings,
    refetch: refetchMeetings
  } = useQuery({
    queryKey: ['startup', selectedStartupId, 'board-meetings'],
    queryFn: () => getStartupBoardMeetings(selectedStartupId!),
    enabled: !!selectedStartupId,
  });
  
  // Fetch strategic needs for the selected startup
  const { 
    data: strategicNeeds = [], 
    isLoading: isLoadingNeeds,
    refetch: refetchNeeds
  } = useQuery({
    queryKey: ['startup', selectedStartupId, 'strategic-needs'],
    queryFn: () => getStartupStrategicNeeds(selectedStartupId!),
    enabled: !!selectedStartupId,
  });
  
  // Fetch highlights for the selected startup
  const { 
    data: highlights = [], 
    isLoading: isLoadingHighlights,
    refetch: refetchHighlights
  } = useQuery({
    queryKey: ['startup', selectedStartupId, 'highlights'],
    queryFn: () => getStartupHighlights(selectedStartupId!),
    enabled: !!selectedStartupId,
  });
  
  // Helper function to refetch all data for the selected startup
  const refetchSelectedStartupData = () => {
    if (selectedStartupId) {
      refetchKPIs();
      refetchMeetings();
      refetchNeeds();
      refetchHighlights();
    }
  };
  
  return {
    startups,
    isLoadingStartups,
    startupsError,
    refetchStartups,
    
    selectedStartupId,
    setSelectedStartupId,
    selectedStartup,
    
    kpis,
    isLoadingKPIs,
    refetchKPIs,
    
    boardMeetings,
    isLoadingMeetings,
    refetchMeetings,
    
    strategicNeeds,
    isLoadingNeeds,
    refetchNeeds,
    
    highlights,
    isLoadingHighlights,
    refetchHighlights,
    
    refetchSelectedStartupData,
    
    isLoading: isLoadingStartups || isLoadingKPIs || isLoadingMeetings || isLoadingNeeds || isLoadingHighlights
  };
};
