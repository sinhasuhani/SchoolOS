import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { BookOpen } from 'lucide-react';

export const ClassDistributionChart: React.FC = () => {
  const { students } = useSchool();
  const [chartType, setChartType] = useState<'wings' | 'streams'>('wings');

  // Dynamically compute wings data from actual students
  const wingStrengthData = useMemo(() => {
    const wings = [
      { wing: 'Primary (I-V)', prefix: 'Primary' },
      { wing: 'Middle (VI-VIII)', prefix: 'Middle' },
      { wing: 'Secondary (IX-X)', prefix: 'Secondary' },
      { wing: 'Sr. Sec (XI-XII)', prefix: 'Senior Secondary' },
    ];

    return wings.map((w) => {
      const enrolled = students.filter((s) => s.wing.startsWith(w.prefix));
      const boys = enrolled.filter((s) => s.gender === 'Male').length;
      const girls = enrolled.filter((s) => s.gender === 'Female').length;
      return {
        wing: w.wing,
        boys,
        girls,
        total: enrolled.length,
      };
    });
  }, [students]);

  // Dynamically compute senior secondary stream distribution
  const streamDistributionData = useMemo(() => {
    const streams = [
      { name: 'Science (PCM)', fill: '#2563eb' },
      { name: 'Science (PCB)', fill: '#0d9488' },
      { name: 'Commerce', fill: '#d97706' },
      { name: 'Humanities', fill: '#7c3aed' },
    ];

    return streams.map((str) => {
      const count = students.filter((s) => s.stream === str.name).length;
      return {
        name: str.name,
        students: count,
        fill: str.fill,
      };
    });
  }, [students]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Student Enrolment Distribution</h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 font-mono">
              {students.length} Enrolled
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Dynamic distribution across academic wings, gender breakdown & senior secondary streams
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setChartType('wings')}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              chartType === 'wings'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            By Wing & Gender
          </button>
          <button
            onClick={() => setChartType('streams')}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              chartType === 'streams'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sr. Sec Streams (XI-XII)
          </button>
        </div>
      </div>

      <div className="h-68 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'wings' ? (
            <BarChart data={wingStrengthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="wing" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
              <Bar dataKey="boys" name="Boys" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={26} />
              <Bar dataKey="girls" name="Girls" fill="#ec4899" radius={[6, 6, 0, 0]} barSize={26} />
            </BarChart>
          ) : (
            <BarChart data={streamDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`${val} Students`, 'Enrolled']}
              />
              <Bar dataKey="students" name="Students" radius={[6, 6, 0, 0]} barSize={38}>
                {streamDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          Senior Secondary Electives: PCM, PCB, Commerce & Humanities Streams
        </span>
        <span className="font-semibold text-slate-700">{students.length} Total Enrolled</span>
      </div>
    </div>
  );
};
