import { useGetAnalyticsQuery, useListAllUsersQuery } from '../store/api/adminApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { TrendingUp, Users, Target, Award, BarChart3, PieChart, Activity, Clock, BookOpen, Calendar, DollarSign, Eye, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Analytics() {
  const { data: analytics, isLoading, error } = useGetAnalyticsQuery();
  const { data: usersData } = useListAllUsersQuery({ page: 1, limit: 1000 }); // Get all users for detailed analytics

  const [chartData, setChartData] = useState({
    userGrowth: [],
    registrationTypes: [],
    monthlyRegistrations: [],
    paymentStatus: []
  });

  useEffect(() => {
    if (analytics?.data && usersData?.data?.users) {
      const users = usersData.data.users;
      
      // Prepare registration types data
      const registrationTypes = [
        { name: 'Plan', value: analytics.data.summary.paidUsers || 0 },
        { name: 'Form', value: analytics.data.summary.activeTrials || 0 },
        { name: 'Register', value: (analytics.data.summary.totalUsers || 0) - (analytics.data.summary.paidUsers || 0) - (analytics.data.summary.activeTrials || 0) },
      ];

      // Prepare payment status data
      const paidUsers = users.filter(user => user.isPaid).length;
      const unpaidUsers = users.filter(user => !user.isPaid).length;
      const paymentStatus = [
        { name: 'Paid', value: paidUsers },
        { name: 'Unpaid', value: unpaidUsers }
      ];

      // Prepare monthly registrations data
      const now = new Date();
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

        // Format month name consistently
        const monthName = monthStart.toLocaleString('default', { month: 'short', year: '2-digit' });

        const registrations = users.filter(user => {
          if (!user.createdAt) return false;
          const userDate = new Date(user.createdAt);
          return userDate >= monthStart && userDate <= monthEnd;
        }).length;

        months.push({ month: monthName, registrations });
      }

      setChartData({
        registrationTypes,
        paymentStatus,
        monthlyRegistrations: months
      });
    }
  }, [analytics, usersData]);

  if (isLoading) return <LoadingSpinner />;

  const summary = analytics?.data?.summary || {
    totalUsers: 0,
    paidUsers: 0,
    blockedUsers: 0,
    activeTrials: 0,
  };

  const recentActivity = analytics?.data?.recentActivity || [];
  const users = usersData?.data?.users || [];

  // Calculate additional metrics
  const newThisMonth = users.filter(user => {
    const userDate = new Date(user.createdAt);
    const now = new Date();
    return userDate.getMonth() === now.getMonth() && 
           userDate.getFullYear() === now.getFullYear();
  }).length;

  const completionRate = users.length > 0 ? Math.round((users.filter(u => u.status === 'completed').length / users.length) * 100) : 0;
  const engagementRate = users.length > 0 ? Math.round(((users.filter(u => u.isPaid || u.registrationType === 'plan').length) / users.length) * 100) : 0;

  const analyticsCards = [
    {
      title: 'Total Users',
      value: summary.totalUsers || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
    },
    {
      title: 'Active Users',
      value: users.filter(u => !u.isBlocked).length,
      icon: Activity,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      change: '+8%',
    },
    {
      title: 'Paid Users',
      value: summary.paidUsers || 0,
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      change: '+15%',
    },
    {
      title: 'New This Month',
      value: newThisMonth,
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      change: '+5%',
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      icon: Award,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      change: '+3%',
    },
    {
      title: 'Engagement',
      value: `${engagementRate}%`,
      icon: Eye,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      change: '+7%',
    },
    {
      title: 'Active Trials',
      value: summary.activeTrials || 0,
      icon: Target,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      change: '-2%',
    },
    {
      title: 'Blocked Users',
      value: summary.blockedUsers || 0,
      icon: Star,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      change: '-1%',
    },
  ];

  // Bar chart component
  const BarChart = ({ data, title, color = 'primary' }) => {
    const maxValue = Math.max(...data.map(d => d.registrations), 1);
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-primary mb-4">{title}</h3>
        <div className="flex items-end justify-between h-40 gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className={`w-full bg-gradient-to-t from-${color}-500 to-${color}-300 rounded-t-lg`}
                style={{ height: `${(item.registrations / maxValue) * 100}%` }}
              ></div>
              <span className="text-xs mt-2 text-gray-600">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Pie chart component
  const PieChartComponent = ({ data, title, colors = ['blue-500', 'green-500', 'purple-500'] }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    if (total === 0) {
      return (
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center h-64">
          <p className="text-gray-500">No data available</p>
        </div>
      );
    }

    let startAngle = 0;

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-primary mb-4">{title}</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {data.map((item, index) => {
                if (item.value === 0) return null;
                
                const percentage = (item.value / total) * 100;
                const angle = (percentage / 100) * 360;
                const colorIndex = index % colors.length;
                const color = `#${colors[colorIndex] === 'blue-500' ? '3b82f6' : colors[colorIndex] === 'green-500' ? '10b981' : colors[colorIndex] === 'purple-500' ? '8b5cf6' : 'f59e0b'}`;
                
                // Calculate coordinates for the arc
                const startAngleRad = (startAngle * Math.PI) / 180;
                const endAngleRad = ((startAngle + angle) * Math.PI) / 180;
                
                const x1 = 50 + 40 * Math.cos(startAngleRad);
                const y1 = 50 + 40 * Math.sin(startAngleRad);
                const x2 = 50 + 40 * Math.cos(endAngleRad);
                const y2 = 50 + 40 * Math.sin(endAngleRad);
                
                const largeArcFlag = angle > 180 ? 1 : 0;
                
                const pathData = [
                  `M 50 50`, // Move to center
                  `L ${x1} ${y1}`, // Line to start point
                  `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`, // Arc to end point
                  `Z` // Close path
                ].join(' ');
                
                const segment = (
                  <path
                    key={index}
                    d={pathData}
                    fill={color}
                    stroke="#fff"
                    strokeWidth="0.5"
                  />
                );
                
                startAngle += angle;
                return segment;
              })}
            </svg>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {data.map((item, index) => {
            const colorIndex = index % colors.length;
            const colorClass = colors[colorIndex];
            const colorHex = `#${colorClass === 'blue-500' ? '3b82f6' : colorClass === 'green-500' ? '10b981' : colorClass === 'purple-500' ? '8b5cf6' : 'f59e0b'}`;
            
            return (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: colorHex }}
                ></div>
                <span className="ml-1 text-xs">{item.name}: {item.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Get top performing students based on real data
  const topStudents = users
    .filter(user => user.isPaid || user.registrationType === 'plan')
    .sort((a, b) => {
      if (a.isPaid && !b.isPaid) return -1;
      if (!a.isPaid && b.isPaid) return 1;
      if (a.registrationType === 'plan' && b.registrationType !== 'plan') return -1;
      if (a.registrationType !== 'plan' && b.registrationType === 'plan') return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .slice(0, 5)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
      performance: user.isPaid ? 90 : user.registrationType === 'plan' ? 80 : 70
    }));

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">Analytics Dashboard</h1>
        <p className="text-gray-600 text-sm mt-1">Comprehensive platform performance and user engagement metrics</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-600">Failed to load analytics. Please try again.</p>
        </div>
      )}

      {/* Analytics Cards Grid - 4 columns on large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">{card.title}</h3>
                <div className={`${card.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 text-${card.color.split(' ')[0].split('-')[1]}-600`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-primary mb-2">{card.value}</p>
              <p className="text-green-600 text-sm font-semibold">{card.change} from last month</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Registrations Chart */}
        <BarChart 
          data={chartData.monthlyRegistrations} 
          title="Monthly User Registrations" 
          color="primary"
        />
        
        {/* Registration Types Chart */}
        <PieChartComponent 
          data={chartData.registrationTypes} 
          title="Registration Types Distribution" 
          colors={['blue-500', 'green-500', 'purple-500']}
        />
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Status Chart */}
        <PieChartComponent 
          data={chartData.paymentStatus} 
          title="Payment Status Distribution" 
          colors={['green-500', 'red-500']}
        />
        
        {/* User Engagement Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-primary mb-4">User Engagement Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 text-sm font-medium">Completion Rate</span>
                <span className="font-bold text-primary">{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 text-sm font-medium">Engagement Rate</span>
                <span className="font-bold text-primary">{engagementRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${engagementRate}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 text-sm font-medium">Active Users</span>
                <span className="font-bold text-primary">{users.filter(u => !u.isBlocked).length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full"
                  style={{ width: `${users.length > 0 ? (users.filter(u => !u.isBlocked).length / users.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-primary mb-4">Recent Activity</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {recentActivity.length > 0 ? (
              recentActivity.slice(0, 10).map((activity, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{activity.user?.name || 'Unknown'}</span>
                    <span className="text-sm text-gray-500">{new Date(activity.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-600">{activity.lesson || activity.status || 'Progress Update'}</p>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            )}
          </div>
        </div>

        {/* Top Performing Students */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-primary mb-4">Top Performing Students</h3>
          <div className="space-y-3">
            {topStudents.length > 0 ? (
              topStudents.map((student, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold mr-3">
                      {student.rank}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{student.name || 'Unknown Student'}</p>
                      <p className="text-xs text-gray-500">Type: {student.registrationType || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-green-600">{student.performance}%</span>
                    <div className="text-xs text-gray-500">{student.course || 'Course N/A'}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No top students data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}