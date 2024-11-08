import React, { useEffect, useState } from 'react';
import { useInterventions } from '../hooks/useInterventions';
import { useAuth } from '../hooks/useAuth';
import Map from '../components/Map';
import { MoreHorizontal, MapPin, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, eachDayOfInterval, subDays, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { interventions = [], fetchInterventions } = useInterventions();
  const { user } = useAuth();
  const [revenuePeriod, setRevenuePeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchInterventions();
      } catch (error) {
        console.error('Error fetching interventions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchInterventions]);

  // Filter interventions based on role and date
  const today = new Date();
  const todayInterventions = interventions.filter(intervention => {
    const isToday = format(parseISO(intervention.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
    if (user?.role === 'ADMIN') {
      return isToday;
    }
    if (user?.role === 'TECHNICIAN' || user?.role === 'SUBCONTRACTOR') {
      return isToday && intervention.technicians?.some(tech => tech.id === user.id);
    }
    return isToday;
  });

  const completedInterventions = todayInterventions.filter(i => i.status === 'completed');

  // Calculate revenue for interventions
  const calculateRevenue = (interventions: any[]) => {
    return interventions.reduce((total, intervention) => {
      if (user?.role === 'ADMIN') {
        return total + (intervention.sellPrice || 0);
      } else {
        const techRevenue = intervention.technicians
          ?.filter((tech: any) => tech.id === user?.id)
          .reduce((sum: number, tech: any) => sum + (tech.sellPrice || 0), 0) || 0;
        return total + techRevenue;
      }
    }, 0);
  };

  // Prepare data for the revenue chart based on selected period
  const getRevenueData = () => {
    let periodStart: Date;
    let periodEnd: Date = today;
    let dateFormat: string;

    switch (revenuePeriod) {
      case 'daily':
        periodStart = subDays(today, 7);
        dateFormat = 'EEE';
        break;
      case 'weekly':
        periodStart = subDays(today, 28);
        dateFormat = "'S'w";
        break;
      case 'monthly':
        periodStart = subDays(today, 180);
        dateFormat = 'MMM';
        break;
      default:
        periodStart = subDays(today, 7);
        dateFormat = 'EEE';
    }

    const dates = eachDayOfInterval({ start: periodStart, end: periodEnd });
    const data = dates.map(date => {
      const dayInterventions = interventions.filter(intervention => {
        const interventionDate = parseISO(intervention.date);
        return format(interventionDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      });

      return {
        date: format(date, dateFormat, { locale: fr }),
        revenue: calculateRevenue(dayInterventions)
      };
    });

    // Group by period if weekly or monthly
    if (revenuePeriod !== 'daily') {
      const groupedData = data.reduce((acc, item) => {
        const existingEntry = acc.find(entry => entry.date === item.date);
        if (existingEntry) {
          existingEntry.revenue += item.revenue;
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as { date: string; revenue: number }[]);

      return groupedData;
    }

    return data;
  };

  const revenueData = getRevenueData();
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-12 gap-6">
        {/* Interventions Count Card */}
        <div className="col-span-4 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold text-blue-600">INTERVENTIONS</h2>
              <p className="text-sm text-gray-500">Aujourd'hui</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="h-6 w-6" />
            </button>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-bold text-blue-600">{todayInterventions.length}</span>
              </div>
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="8"
                  strokeDasharray={`${(completedInterventions.length / (todayInterventions.length || 1)) * 377} 377`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Revenue Chart Card */}
        <div className="col-span-8 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold text-blue-600">CHIFFRE D'AFFAIRES</h2>
              <p className="text-sm text-gray-500">
                Total : {totalRevenue.toLocaleString('fr-FR')} €
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setRevenuePeriod('daily')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  revenuePeriod === 'daily' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Jour
              </button>
              <button
                onClick={() => setRevenuePeriod('weekly')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  revenuePeriod === 'weekly' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Semaine
              </button>
              <button
                onClick={() => setRevenuePeriod('monthly')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  revenuePeriod === 'monthly' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Mois
              </button>
            </div>
          </div>
          <div className="h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickFormatter={(value) => `${value}€`}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toLocaleString('fr-FR')}€`, 'Chiffre d\'affaires']}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Map and Interventions */}
      <div className="grid grid-cols-12 gap-6">
        {/* Today's Interventions List */}
        <div className="col-span-4 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-blue-600">INTERVENTIONS DU JOUR</h2>
              <p className="text-sm text-gray-500">
                {completedInterventions.length} / {todayInterventions.length} effectuées
              </p>
            </div>
            <Link 
              to="/interventions" 
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <span className="text-sm mr-1">Voir tout</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {todayInterventions.map((intervention) => (
              <div key={intervention.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{intervention.title}</p>
                    <p className="text-sm text-gray-500">{intervention.location.address}</p>
                    <p className="text-sm text-gray-500">
                      {format(parseISO(`${intervention.date}T${intervention.time}`), 'HH:mm', { locale: fr })}
                    </p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  intervention.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="col-span-8 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold text-blue-600">LOCALISATION</h2>
              <p className="text-sm text-gray-500">Interventions du jour</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="h-6 w-6" />
            </button>
          </div>
          <Map interventions={todayInterventions} />
        </div>
      </div>
    </div>
  );
}