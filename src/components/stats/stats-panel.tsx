import { useState } from 'react'
import { TrendingUp, PieChart, Calendar } from 'lucide-react'
import { LineChart, Line, PieChart as RePieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Button } from '../ui/button'
import { TAG_COLORS } from '../../utils/constants'

const dailyData = [
  { date: '02-17', focusCount: 3, totalMinutes: 75 },
  { date: '02-18', focusCount: 4, totalMinutes: 100 },
  { date: '02-19', focusCount: 2, totalMinutes: 50 },
  { date: '02-20', focusCount: 5, totalMinutes: 125 },
  { date: '02-21', focusCount: 3, totalMinutes: 75 },
  { date: '02-22', focusCount: 4, totalMinutes: 100 },
  { date: '02-23', focusCount: 2, totalMinutes: 50 },
]

const tagData = [
  { name: '工作', value: 120, tag: 'work' },
  { name: '学习', value: 90, tag: 'study' },
  { name: '运动', value: 60, tag: 'sport' },
  { name: '休闲', value: 45, tag: 'leisure' },
]

export function StatsPanel() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d')

  return (
    <div className="space-y-8">
      {/* Time range selector */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-gray-700">时间范围</span>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <Button
            size="sm"
            variant={timeRange === '7d' ? 'default' : 'ghost'}
            className={`px-4 ${timeRange === '7d' ? 'bg-white shadow' : ''}`}
            onClick={() => setTimeRange('7d')}
          >
            近7天
          </Button>
          <Button
            size="sm"
            variant={timeRange === '30d' ? 'default' : 'ghost'}
            className={`px-4 ${timeRange === '30d' ? 'bg-white shadow' : ''}`}
            onClick={() => setTimeRange('30d')}
          >
            近30天
          </Button>
        </div>
      </div>

      {/* Trend chart */}
      <div className="bg-gradient-to-br from-white to-amber-50 rounded-xl p-4 border border-amber-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-amber-600" />
            <h3 className="font-bold text-gray-800">专注趋势</h3>
          </div>
          <div className="text-sm text-gray-500">
            总时长: {dailyData.reduce((sum, day) => sum + day.totalMinutes, 0)} 分钟
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="focusCount" 
                name="专注次数" 
                stroke="#FFD166" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="totalMinutes" 
                name="总时长(分钟)" 
                stroke="#06D6A0" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie chart */}
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-gray-800">标签分布</h3>
          </div>
          <div className="text-sm text-gray-500">
            总时长: {tagData.reduce((sum, tag) => sum + tag.value, 0)} 分钟
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie
                data={tagData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}分钟`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {tagData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={TAG_COLORS[entry.tag]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} 分钟`, '时长']}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}