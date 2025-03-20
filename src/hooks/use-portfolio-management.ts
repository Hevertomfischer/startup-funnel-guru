
import { useState, useEffect, useMemo } from 'react';
import { Startup, Status } from '@/types';
import { 
  PortfolioKPI, 
  KPIValue, 
  BoardMeeting, 
  StartupHighlight, 
  QuarterlyReport,
  PortfolioSummary,
  InvestedStartup
} from '@/types/portfolio';
import { useStartupData } from '@/hooks/use-startup-data';
import { useStatusesQuery } from '@/hooks/use-supabase-query';
import { useTeamMembersQuery } from '@/hooks/use-team-members';
import { 
  getInvestedStartups, 
  getInvestedStatusIds, 
  saveInvestedStatusIds 
} from '@/utils/portfolio-utils';
import {
  getKPIs,
  saveKPIs,
  getKPIValues,
  saveKPIValues,
  getBoardMeetings,
  saveBoardMeetings,
  getStartupHighlights,
  saveStartupHighlights,
  getQuarterlyReports,
  saveQuarterlyReports,
  getStartupKPIValues,
  getStartupBoardMeetings,
  getStartupHighlightsById,
  getStartupQuarterlyReports
} from '@/utils/portfolio-storage';
import { useToast } from '@/hooks/use-toast';
import { format, addMonths, addHours, parseISO } from 'date-fns';

export const usePortfolioManagement = () => {
  const { formattedStartups, statusesData } = useStartupData();
  const { data: allStatuses = [] } = useStatusesQuery();
  const { data: teamMembers = [] } = useTeamMembersQuery();
  const { toast } = useToast();
  
  // Persistent state
  const [investedStatusIds, setInvestedStatusIds] = useState<string[]>([]);
  const [kpis, setKPIs] = useState<PortfolioKPI[]>([]);
  const [kpiValues, setKPIValues] = useState<KPIValue[]>([]);
  const [boardMeetings, setBoardMeetings] = useState<BoardMeeting[]>([]);
  const [startupHighlights, setStartupHighlights] = useState<StartupHighlight[]>([]);
  const [quarterlyReports, setQuarterlyReports] = useState<QuarterlyReport[]>([]);

  // Current focus
  const [selectedStartupId, setSelectedStartupId] = useState<string | null>(null);
  const [selectedQuarter, setSelectedQuarter] = useState<string>(
    `Q${Math.ceil((new Date().getMonth() + 1) / 3)} ${new Date().getFullYear()}`
  );
  
  // Load all data on initialization
  useEffect(() => {
    setInvestedStatusIds(getInvestedStatusIds());
    setKPIs(getKPIs());
    setKPIValues(getKPIValues());
    setBoardMeetings(getBoardMeetings());
    setStartupHighlights(getStartupHighlights());
    setQuarterlyReports(getQuarterlyReports());
  }, []);

  // Get invested startups based on status
  const investedStartups = useMemo(() => {
    return getInvestedStartups(formattedStartups, investedStatusIds);
  }, [formattedStartups, investedStatusIds]);

  // Calculate portfolio summary
  const portfolioSummary = useMemo(() => {
    const summary: PortfolioSummary = {
      totalInvested: 0,
      startupCount: investedStartups.length,
      sectorsDistribution: {},
      stageDistribution: {},
      performanceByQuarter: {}
    };

    // Calculate distributions
    investedStartups.forEach(startup => {
      const sector = startup.values.Setor || 'Undefined';
      const stage = allStatuses.find(s => s.id === startup.statusId)?.name || 'Undefined';
      
      summary.sectorsDistribution[sector] = (summary.sectorsDistribution[sector] || 0) + 1;
      summary.stageDistribution[stage] = (summary.stageDistribution[stage] || 0) + 1;
    });

    // Calculate performance for each quarter
    const quarters = quarterlyReports.map(report => report.quarter);
    const uniqueQuarters = [...new Set(quarters)];
    
    uniqueQuarters.forEach(quarter => {
      // Calculate average performance for this quarter
      const reportsForQuarter = quarterlyReports.filter(report => report.quarter === quarter);
      let totalGrowth = 0;
      
      reportsForQuarter.forEach(report => {
        const revenueKPIs = report.kpiValues.filter(value => {
          const kpi = kpis.find(k => k.id === value.kpiId);
          return kpi?.category === 'financial' && kpi?.name.toLowerCase().includes('revenue');
        });
        
        if (revenueKPIs.length > 0) {
          // Simple average of all revenue KPIs for this quarter
          const avgRevenue = revenueKPIs.reduce((sum, kpi) => sum + kpi.value, 0) / revenueKPIs.length;
          totalGrowth += avgRevenue;
        }
      });
      
      summary.performanceByQuarter[quarter] = totalGrowth;
    });

    return summary;
  }, [investedStartups, allStatuses, quarterlyReports, kpis]);

  // Enhanced startups with portfolio data
  const enhancedInvestedStartups = useMemo(() => {
    return investedStartups.map(startup => {
      const startupKPIValues = getStartupKPIValues(startup.id);
      const startupBoardMeetings = getStartupBoardMeetings(startup.id);
      const startupHighlights = getStartupHighlightsById(startup.id);
      const startupReports = getStartupQuarterlyReports(startup.id);
      
      return {
        ...startup,
        kpis: kpis.filter(kpi => startupKPIValues.some(val => val.kpiId === kpi.id)),
        kpiValues: startupKPIValues,
        highlights: startupHighlights,
        boardMeetings: startupBoardMeetings,
        quarterlyReports: startupReports
      } as InvestedStartup;
    });
  }, [investedStartups, kpis]);

  // Update invested status IDs
  const updateInvestedStatusIds = (statusIds: string[]) => {
    setInvestedStatusIds(statusIds);
    saveInvestedStatusIds(statusIds);
    toast({
      title: "Configuração Atualizada",
      description: "Os status de startups investidas foram atualizados.",
    });
  };

  // KPI Management
  const addKPI = (kpi: Omit<PortfolioKPI, 'id'>) => {
    const newKPI: PortfolioKPI = {
      ...kpi,
      id: `kpi-${Date.now()}`
    };
    
    const updatedKPIs = [...kpis, newKPI];
    setKPIs(updatedKPIs);
    saveKPIs(updatedKPIs);
    
    toast({
      title: "KPI Adicionado",
      description: `O KPI ${kpi.name} foi adicionado com sucesso.`,
    });
    
    return newKPI;
  };

  const updateKPI = (updatedKPI: PortfolioKPI) => {
    const updatedKPIs = kpis.map(kpi => 
      kpi.id === updatedKPI.id ? updatedKPI : kpi
    );
    
    setKPIs(updatedKPIs);
    saveKPIs(updatedKPIs);
    
    toast({
      title: "KPI Atualizado",
      description: `O KPI ${updatedKPI.name} foi atualizado com sucesso.`,
    });
  };

  const deleteKPI = (kpiId: string) => {
    const updatedKPIs = kpis.filter(kpi => kpi.id !== kpiId);
    setKPIs(updatedKPIs);
    saveKPIs(updatedKPIs);
    
    // Also delete all values for this KPI
    const updatedValues = kpiValues.filter(value => value.kpiId !== kpiId);
    setKPIValues(updatedValues);
    saveKPIValues(updatedValues);
    
    toast({
      title: "KPI Removido",
      description: "O KPI foi removido com sucesso.",
    });
  };

  // KPI Value Management
  const addKPIValue = (startupId: string, kpiId: string, value: number, quarter: string, notes?: string) => {
    const date = new Date();
    
    const newValue: KPIValue = {
      id: `kpi-value-${Date.now()}`,
      kpiId,
      startupId,
      value,
      date,
      quarter,
      notes
    };
    
    const updatedValues = [...kpiValues, newValue];
    setKPIValues(updatedValues);
    saveKPIValues(updatedValues);
    
    toast({
      title: "Valor Registrado",
      description: "O valor do KPI foi registrado com sucesso.",
    });
    
    return newValue;
  };

  const updateKPIValue = (updatedValue: KPIValue) => {
    const updatedValues = kpiValues.map(value => 
      value.id === updatedValue.id ? updatedValue : value
    );
    
    setKPIValues(updatedValues);
    saveKPIValues(updatedValues);
    
    toast({
      title: "Valor Atualizado",
      description: "O valor do KPI foi atualizado com sucesso.",
    });
  };

  const deleteKPIValue = (valueId: string) => {
    const updatedValues = kpiValues.filter(value => value.id !== valueId);
    setKPIValues(updatedValues);
    saveKPIValues(updatedValues);
    
    toast({
      title: "Valor Removido",
      description: "O valor do KPI foi removido com sucesso.",
    });
  };

  // Board Meeting Management
  const scheduleBoardMeeting = (
    startupId: string, 
    scheduledDate: Date, 
    title: string, 
    agenda?: string, 
    attendees: string[] = []
  ) => {
    const newMeeting: BoardMeeting = {
      id: `meeting-${Date.now()}`,
      startupId,
      scheduledDate,
      status: 'scheduled',
      title,
      agenda,
      attendees,
      actionItems: []
    };
    
    const updatedMeetings = [...boardMeetings, newMeeting];
    setBoardMeetings(updatedMeetings);
    saveBoardMeetings(updatedMeetings);
    
    toast({
      title: "Reunião Agendada",
      description: `Reunião "${title}" agendada para ${format(scheduledDate, 'dd/MM/yyyy HH:mm')}.`,
    });
    
    return newMeeting;
  };

  const updateBoardMeeting = (updatedMeeting: BoardMeeting) => {
    const updatedMeetings = boardMeetings.map(meeting => 
      meeting.id === updatedMeeting.id ? updatedMeeting : meeting
    );
    
    setBoardMeetings(updatedMeetings);
    saveBoardMeetings(updatedMeetings);
    
    toast({
      title: "Reunião Atualizada",
      description: "Os detalhes da reunião foram atualizados com sucesso.",
    });
  };

  const completeBoardMeeting = (
    meetingId: string, 
    minutes: string, 
    decisions: string[] = [], 
    actualDate?: Date
  ) => {
    const updatedMeetings = boardMeetings.map(meeting => {
      if (meeting.id === meetingId) {
        return {
          ...meeting,
          status: 'completed',
          minutes,
          decisions,
          actualDate: actualDate || new Date()
        };
      }
      return meeting;
    });
    
    setBoardMeetings(updatedMeetings);
    saveBoardMeetings(updatedMeetings);
    
    toast({
      title: "Reunião Concluída",
      description: "A reunião foi marcada como concluída e as notas foram salvas.",
    });
  };

  const cancelBoardMeeting = (meetingId: string) => {
    const updatedMeetings = boardMeetings.map(meeting => {
      if (meeting.id === meetingId) {
        return {
          ...meeting,
          status: 'cancelled'
        };
      }
      return meeting;
    });
    
    setBoardMeetings(updatedMeetings);
    saveBoardMeetings(updatedMeetings);
    
    toast({
      title: "Reunião Cancelada",
      description: "A reunião foi cancelada com sucesso.",
    });
  };

  const deleteBoardMeeting = (meetingId: string) => {
    const updatedMeetings = boardMeetings.filter(meeting => meeting.id !== meetingId);
    setBoardMeetings(updatedMeetings);
    saveBoardMeetings(updatedMeetings);
    
    toast({
      title: "Reunião Removida",
      description: "A reunião foi removida com sucesso.",
    });
  };

  // Highlights Management
  const addStartupHighlight = (
    startupId: string, 
    type: 'achievement' | 'concern' | 'need',
    title: string,
    description: string,
    priority?: 'low' | 'medium' | 'high',
    relatedKPIs?: string[]
  ) => {
    const newHighlight: StartupHighlight = {
      id: `highlight-${Date.now()}`,
      startupId,
      type,
      title,
      description,
      date: new Date(),
      status: 'active',
      priority,
      relatedKPIs
    };
    
    const updatedHighlights = [...startupHighlights, newHighlight];
    setStartupHighlights(updatedHighlights);
    saveStartupHighlights(updatedHighlights);
    
    const typeText = type === 'achievement' ? 'Conquista' : type === 'concern' ? 'Ponto de Atenção' : 'Necessidade';
    
    toast({
      title: `${typeText} Registrado`,
      description: `${typeText} "${title}" foi registrado com sucesso.`,
    });
    
    return newHighlight;
  };

  const updateStartupHighlight = (updatedHighlight: StartupHighlight) => {
    const updatedHighlights = startupHighlights.map(highlight => 
      highlight.id === updatedHighlight.id ? updatedHighlight : highlight
    );
    
    setStartupHighlights(updatedHighlights);
    saveStartupHighlights(updatedHighlights);
    
    toast({
      title: "Registro Atualizado",
      description: "O registro foi atualizado com sucesso.",
    });
  };

  const resolveStartupHighlight = (highlightId: string) => {
    const updatedHighlights = startupHighlights.map(highlight => {
      if (highlight.id === highlightId) {
        return {
          ...highlight,
          status: 'resolved'
        };
      }
      return highlight;
    });
    
    setStartupHighlights(updatedHighlights);
    saveStartupHighlights(updatedHighlights);
    
    toast({
      title: "Registro Resolvido",
      description: "O registro foi marcado como resolvido.",
    });
  };

  const archiveStartupHighlight = (highlightId: string) => {
    const updatedHighlights = startupHighlights.map(highlight => {
      if (highlight.id === highlightId) {
        return {
          ...highlight,
          status: 'archived'
        };
      }
      return highlight;
    });
    
    setStartupHighlights(updatedHighlights);
    saveStartupHighlights(updatedHighlights);
    
    toast({
      title: "Registro Arquivado",
      description: "O registro foi arquivado.",
    });
  };

  const deleteStartupHighlight = (highlightId: string) => {
    const updatedHighlights = startupHighlights.filter(highlight => highlight.id !== highlightId);
    setStartupHighlights(updatedHighlights);
    saveStartupHighlights(updatedHighlights);
    
    toast({
      title: "Registro Removido",
      description: "O registro foi removido com sucesso.",
    });
  };

  // Quarterly Report Management
  const createQuarterlyReport = (
    startupId: string,
    quarter: string,
    summary?: string,
    goals?: string[]
  ) => {
    // Calculate quarter dates
    const year = parseInt(quarter.split(' ')[1]);
    const quarterNumber = parseInt(quarter.split('Q')[1].split(' ')[0]);
    const startMonth = (quarterNumber - 1) * 3;
    
    const startDate = new Date(year, startMonth, 1);
    const endDate = addMonths(startDate, 3);
    endDate.setDate(endDate.getDate() - 1);
    
    // Get KPI values for this startup and quarter
    const relevantKPIValues = kpiValues.filter(value => 
      value.startupId === startupId && value.quarter === quarter
    );
    
    // Get highlights for this startup in this quarter's date range
    const relevantHighlights = startupHighlights.filter(highlight => {
      const highlightDate = highlight.date instanceof Date ? highlight.date : new Date(highlight.date);
      return highlight.startupId === startupId && 
             highlightDate >= startDate && 
             highlightDate <= endDate;
    });
    
    const newReport: QuarterlyReport = {
      id: `report-${Date.now()}`,
      startupId,
      quarter,
      startDate,
      endDate,
      kpiValues: relevantKPIValues,
      highlights: relevantHighlights,
      summary,
      goals,
      status: 'draft'
    };
    
    const updatedReports = [...quarterlyReports, newReport];
    setQuarterlyReports(updatedReports);
    saveQuarterlyReports(updatedReports);
    
    toast({
      title: "Relatório Criado",
      description: `Relatório para ${quarter} foi criado com sucesso.`,
    });
    
    return newReport;
  };

  const updateQuarterlyReport = (updatedReport: QuarterlyReport) => {
    const updatedReports = quarterlyReports.map(report => 
      report.id === updatedReport.id ? updatedReport : report
    );
    
    setQuarterlyReports(updatedReports);
    saveQuarterlyReports(updatedReports);
    
    toast({
      title: "Relatório Atualizado",
      description: "O relatório foi atualizado com sucesso.",
    });
  };

  const publishQuarterlyReport = (reportId: string) => {
    const updatedReports = quarterlyReports.map(report => {
      if (report.id === reportId) {
        return {
          ...report,
          status: 'published'
        };
      }
      return report;
    });
    
    setQuarterlyReports(updatedReports);
    saveQuarterlyReports(updatedReports);
    
    toast({
      title: "Relatório Publicado",
      description: "O relatório foi publicado com sucesso.",
    });
  };

  const deleteQuarterlyReport = (reportId: string) => {
    const updatedReports = quarterlyReports.filter(report => report.id !== reportId);
    setQuarterlyReports(updatedReports);
    saveQuarterlyReports(updatedReports);
    
    toast({
      title: "Relatório Removido",
      description: "O relatório foi removido com sucesso.",
    });
  };

  // Helper functions
  const getQuarterOptions = (): string[] => {
    const currentYear = new Date().getFullYear();
    const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);
    
    const options: string[] = [];
    
    // Include quarters from last year until current quarter
    for (let year = currentYear - 1; year <= currentYear; year++) {
      for (let quarter = 1; quarter <= 4; quarter++) {
        // Only include up to current quarter for current year
        if (year < currentYear || quarter <= currentQuarter) {
          options.push(`Q${quarter} ${year}`);
        }
      }
    }
    
    return options;
  };

  // Return all the functions and data
  return {
    // State
    investedStartups: enhancedInvestedStartups,
    investedStatusIds,
    kpis,
    kpiValues,
    boardMeetings,
    startupHighlights,
    quarterlyReports,
    selectedStartupId,
    selectedQuarter,
    portfolioSummary,
    allStatuses,
    teamMembers,
    quartersOptions: getQuarterOptions(),
    
    // Setters
    setSelectedStartupId,
    setSelectedQuarter,
    
    // Status configuration
    updateInvestedStatusIds,
    
    // KPI functions
    addKPI,
    updateKPI,
    deleteKPI,
    addKPIValue,
    updateKPIValue,
    deleteKPIValue,
    
    // Board meeting functions
    scheduleBoardMeeting,
    updateBoardMeeting,
    completeBoardMeeting,
    cancelBoardMeeting,
    deleteBoardMeeting,
    
    // Highlights functions
    addStartupHighlight,
    updateStartupHighlight,
    resolveStartupHighlight,
    archiveStartupHighlight,
    deleteStartupHighlight,
    
    // Quarterly report functions
    createQuarterlyReport,
    updateQuarterlyReport,
    publishQuarterlyReport,
    deleteQuarterlyReport
  };
};
