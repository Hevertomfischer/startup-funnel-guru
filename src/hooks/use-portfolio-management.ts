
import { useState, useEffect } from 'react';
import { useStartupData } from '@/hooks/use-startup-data';
import {
  PortfolioKPI,
  KPIValue,
  BoardMeeting,
  StartupHighlight,
  QuarterlyReport,
  PortfolioSummary,
  InvestedStartup
} from '@/types/portfolio';
import { getInvestedStatusIds, saveInvestedStatusIds, isInvestedStartup, getInvestedStartups } from '@/utils/portfolio-utils';
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
import { v4 as uuidv4 } from 'uuid';
import { Startup } from '@/types';
import { useStartupActions } from '@/hooks/use-startup-actions';

export const usePortfolioManagement = () => {
  const { formattedStartups, statusesData } = useStartupData();
  const [investedStatusIds, setInvestedStatusIds] = useState<string[]>(getInvestedStatusIds());
  const [investedStartups, setInvestedStartups] = useState<InvestedStartup[]>([]);
  const [kpis, setKpis] = useState<PortfolioKPI[]>(getKPIs());
  const [kpiValues, setKpiValues] = useState<KPIValue[]>(getKPIValues());
  const [boardMeetings, setBoardMeetings] = useState<BoardMeeting[]>(getBoardMeetings());
  const [startupHighlights, setStartupHighlights] = useState<StartupHighlight[]>(getStartupHighlights());
  const [quarterlyReports, setQuarterlyReports] = useState<QuarterlyReport[]>(getQuarterlyReports());
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary>({
    totalInvested: 0,
    startupCount: 0,
    sectorsDistribution: {},
    stageDistribution: {},
    performanceByQuarter: {}
  });

  // Preload data if empty
  useEffect(() => {
    if (kpis.length === 0) {
      const defaultKpis: PortfolioKPI[] = [
        {
          id: uuidv4(),
          name: 'MRR',
          description: 'Monthly Recurring Revenue',
          category: 'financial',
          unit: 'BRL',
          targetValue: 100000,
          isHigherBetter: true
        },
        {
          id: uuidv4(),
          name: 'Burn Rate',
          description: 'Monthly cash burn rate',
          category: 'financial',
          unit: 'BRL',
          targetValue: 50000,
          isHigherBetter: false
        },
        {
          id: uuidv4(),
          name: 'CAC',
          description: 'Customer Acquisition Cost',
          category: 'financial',
          unit: 'BRL',
          isHigherBetter: false
        },
        {
          id: uuidv4(),
          name: 'LTV',
          description: 'Lifetime Value',
          category: 'financial',
          unit: 'BRL',
          isHigherBetter: true
        },
        {
          id: uuidv4(),
          name: 'Active Users',
          description: 'Monthly Active Users',
          category: 'operational',
          unit: 'users',
          isHigherBetter: true
        },
        {
          id: uuidv4(),
          name: 'Churn Rate',
          description: 'Monthly customer churn rate',
          category: 'customer',
          unit: '%',
          targetValue: 5,
          isHigherBetter: false
        }
      ];
      setKpis(defaultKpis);
      saveKPIs(defaultKpis);
    }

    // Initialize if no board meetings
    if (boardMeetings.length === 0 && investedStartups.length > 0) {
      const sampleMeetings: BoardMeeting[] = investedStartups.slice(0, 2).flatMap(startup => {
        const now = new Date();
        const nextMonth = new Date(now);
        nextMonth.setMonth(now.getMonth() + 1);
        
        return [
          {
            id: uuidv4(),
            startupId: startup.id,
            scheduledDate: nextMonth,
            status: 'scheduled' as const,
            title: `Reunião de Conselho - ${startup.values.Startup || 'Startup'}`,
            agenda: 'Revisão de KPIs trimestrais e planejamento estratégico',
            attendees: ['User 1', 'User 2', 'CEO'],
            actionItems: []
          },
          {
            id: uuidv4(),
            startupId: startup.id,
            scheduledDate: new Date(now.setMonth(now.getMonth() - 1)),
            actualDate: new Date(now.setMonth(now.getMonth() - 1)),
            status: 'completed' as const,
            title: `Reunião de Acompanhamento - ${startup.values.Startup || 'Startup'}`,
            minutes: 'Discutimos os resultados do primeiro trimestre e definimos novas metas.',
            decisions: ['Aprovação de novo orçamento de marketing', 'Contratação de CTO'],
            attendees: ['User 1', 'User 2', 'CEO'],
            actionItems: [
              {
                id: uuidv4(),
                meetingId: '',
                description: 'Finalizar plano de marketing Q3',
                assignedTo: 'User 1',
                dueDate: new Date(now.setDate(now.getDate() + 14)),
                status: 'pending',
                completion: 0
              }
            ]
          }
        ];
      });
      
      // Add meetingId to action items
      sampleMeetings.forEach(meeting => {
        meeting.actionItems.forEach(item => {
          item.meetingId = meeting.id;
        });
      });
      
      if (sampleMeetings.length > 0) {
        setBoardMeetings(sampleMeetings);
        saveBoardMeetings(sampleMeetings);
      }
    }

    // Initialize if no highlights
    if (startupHighlights.length === 0 && investedStartups.length > 0) {
      const sampleHighlights: StartupHighlight[] = investedStartups.slice(0, 3).flatMap(startup => {
        const now = new Date();
        const lastMonth = new Date(now);
        lastMonth.setMonth(now.getMonth() - 1);
        
        return [
          {
            id: uuidv4(),
            startupId: startup.id,
            type: 'achievement',
            title: 'Milestone de usuários atingido',
            description: 'Atingimos 10.000 usuários ativos mensais, superando a meta trimestral em 25%.',
            date: lastMonth,
            status: 'active' as const,
            priority: 'medium'
          },
          {
            id: uuidv4(),
            startupId: startup.id,
            type: 'concern',
            title: 'Burn rate acima do esperado',
            description: 'O burn rate aumentou 15% no último mês, principalmente devido a gastos não planejados em infraestrutura.',
            date: now,
            status: 'active' as const,
            priority: 'high'
          },
          {
            id: uuidv4(),
            startupId: startup.id,
            type: 'need',
            title: 'Necessidade de mentor de produto',
            description: 'A equipe precisa de mentoria especializada em produto para refinar o roadmap do próximo semestre.',
            date: now,
            status: 'active' as const,
            priority: 'medium'
          }
        ];
      });
      
      if (sampleHighlights.length > 0) {
        setStartupHighlights(sampleHighlights);
        saveStartupHighlights(sampleHighlights);
      }
    }

    // Initialize if no quarterly reports
    if (quarterlyReports.length === 0 && investedStartups.length > 0) {
      const currentYear = new Date().getFullYear();
      const sampleReports: QuarterlyReport[] = investedStartups.slice(0, 2).flatMap(startup => {
        return [
          {
            id: uuidv4(),
            startupId: startup.id,
            quarter: `Q1 ${currentYear}`,
            startDate: new Date(currentYear, 0, 1),
            endDate: new Date(currentYear, 2, 31),
            kpiValues: [],
            highlights: [],
            summary: 'Primeiro trimestre com crescimento estável de receita e aquisição de clientes.',
            goals: ['Aumentar MRR em 15%', 'Reduzir CAC em 10%', 'Lançar 2 features principais'],
            status: 'published' as const
          },
          {
            id: uuidv4(),
            startupId: startup.id,
            quarter: `Q2 ${currentYear}`,
            startDate: new Date(currentYear, 3, 1),
            endDate: new Date(currentYear, 5, 30),
            kpiValues: [],
            highlights: [],
            summary: 'Segundo trimestre com foco em expansão de mercado e otimização de custos.',
            goals: ['Expandir para 2 novos mercados', 'Manter churn abaixo de 3%', 'Iniciar processo de captação série A'],
            status: 'draft' as const
          }
        ];
      });
      
      if (sampleReports.length > 0) {
        setQuarterlyReports(sampleReports);
        saveQuarterlyReports(sampleReports);
      }
    }
  }, [investedStartups.length, boardMeetings.length, startupHighlights.length, quarterlyReports.length, kpis.length]);

  // Update invested startups when formattedStartups or investedStatusIds change
  useEffect(() => {
    if (formattedStartups.length > 0 && statusesData.length > 0) {
      const filtered = getInvestedStartups(formattedStartups, investedStatusIds);
      
      // Enrich the startups with portfolio data
      const enriched: InvestedStartup[] = filtered.map(startup => {
        const startupKpiValues = getStartupKPIValues(startup.id);
        const startupBoardMeetings = getStartupBoardMeetings(startup.id);
        const startupHighlights = getStartupHighlightsById(startup.id);
        const startupReports = getStartupQuarterlyReports(startup.id);
        
        return {
          ...startup,
          kpiValues: startupKpiValues,
          boardMeetings: startupBoardMeetings,
          highlights: startupHighlights,
          quarterlyReports: startupReports
        };
      });
      
      setInvestedStartups(enriched);
      
      // Update portfolio summary
      updatePortfolioSummary(enriched);
    }
  }, [formattedStartups, statusesData, investedStatusIds, kpiValues, boardMeetings, startupHighlights, quarterlyReports]);

  // Update the portfolio summary based on the invested startups
  const updatePortfolioSummary = (startups: InvestedStartup[]) => {
    const summary: PortfolioSummary = {
      totalInvested: 0,
      startupCount: startups.length,
      sectorsDistribution: {},
      stageDistribution: {},
      performanceByQuarter: {}
    };
    
    // Calculate sector distribution
    startups.forEach(startup => {
      const sector = startup.values.Setor || 'Unknown';
      summary.sectorsDistribution[sector] = (summary.sectorsDistribution[sector] || 0) + 1;
      
      // Find the status name
      const status = statusesData.find(s => s.id === startup.statusId);
      const stage = status?.name || 'Unknown';
      summary.stageDistribution[stage] = (summary.stageDistribution[stage] || 0) + 1;
      
      // Calculate financial data (this would use real KPIs in a production app)
      summary.totalInvested += Number(startup.values['Valor Investido'] || 0);
    });
    
    // Simulate some quarterly performance data
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    
    summary.performanceByQuarter = {
      [`Q1 ${lastYear}`]: 5000000,
      [`Q2 ${lastYear}`]: 5500000,
      [`Q3 ${lastYear}`]: 6200000,
      [`Q4 ${lastYear}`]: 7100000,
      [`Q1 ${currentYear}`]: 7800000,
      [`Q2 ${currentYear}`]: 8500000,
    };
    
    setPortfolioSummary(summary);
  };

  // Add KPI to a startup
  const addKpiValue = (startupId: string, kpiId: string, value: number, date: Date) => {
    const quarter = `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`;
    
    const newKpiValue: KPIValue = {
      id: uuidv4(),
      kpiId,
      startupId,
      value,
      date,
      quarter,
    };
    
    const updatedKpiValues = [...kpiValues, newKpiValue];
    setKpiValues(updatedKpiValues);
    saveKPIValues(updatedKpiValues);
  };

  // Add a board meeting
  const addBoardMeeting = (meeting: Omit<BoardMeeting, 'id'>) => {
    const newMeeting: BoardMeeting = {
      ...meeting,
      id: uuidv4(),
    };
    
    const updatedMeetings = [...boardMeetings, newMeeting];
    setBoardMeetings(updatedMeetings);
    saveBoardMeetings(updatedMeetings);
  };

  // Update a board meeting
  const updateBoardMeeting = (meetingId: string, updates: Partial<BoardMeeting>) => {
    const updatedMeetings = boardMeetings.map(meeting => 
      meeting.id === meetingId ? { ...meeting, ...updates } : meeting
    );
    
    setBoardMeetings(updatedMeetings);
    saveBoardMeetings(updatedMeetings);
  };

  // Add a highlight
  const addStartupHighlight = (highlight: Omit<StartupHighlight, 'id'>) => {
    const newHighlight: StartupHighlight = {
      ...highlight,
      id: uuidv4(),
    };
    
    const updatedHighlights = [...startupHighlights, newHighlight];
    setStartupHighlights(updatedHighlights);
    saveStartupHighlights(updatedHighlights);
  };

  // Update a highlight
  const updateStartupHighlight = (highlightId: string, updates: Partial<StartupHighlight>) => {
    const updatedHighlights = startupHighlights.map(highlight => 
      highlight.id === highlightId ? { ...highlight, ...updates } : highlight
    );
    
    setStartupHighlights(updatedHighlights);
    saveStartupHighlights(updatedHighlights);
  };

  // Add a quarterly report
  const addQuarterlyReport = (report: Omit<QuarterlyReport, 'id'>) => {
    const newReport: QuarterlyReport = {
      ...report,
      id: uuidv4(),
    };
    
    const updatedReports = [...quarterlyReports, newReport];
    setQuarterlyReports(updatedReports);
    saveQuarterlyReports(updatedReports);
  };

  // Update a quarterly report
  const updateQuarterlyReport = (reportId: string, updates: Partial<QuarterlyReport>) => {
    const updatedReports = quarterlyReports.map(report => 
      report.id === reportId ? { ...report, ...updates } : report
    );
    
    setQuarterlyReports(updatedReports);
    saveQuarterlyReports(updatedReports);
  };

  // Update invested status IDs
  const updateInvestedStatusIds = (statusIds: string[]) => {
    setInvestedStatusIds(statusIds);
    saveInvestedStatusIds(statusIds);
  };

  return {
    investedStartups,
    kpis,
    kpiValues,
    boardMeetings,
    startupHighlights,
    quarterlyReports,
    portfolioSummary,
    investedStatusIds,
    allStatuses: statusesData,
    isInvestedStartup: (startup: Startup) => isInvestedStartup(startup, investedStatusIds),
    addKpiValue,
    addBoardMeeting,
    updateBoardMeeting,
    addStartupHighlight,
    updateStartupHighlight,
    addQuarterlyReport,
    updateQuarterlyReport,
    updateInvestedStatusIds
  };
};
