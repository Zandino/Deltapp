import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value?: string;
  icon?: LucideIcon;
  description?: string;
  chart?: React.ReactNode;
}

export default function StatCard({ title, value, icon: Icon, description, chart }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {Icon && <Icon className="h-5 w-5 text-gray-400" />}
      </div>
      
      {value && (
        <div className="mt-2">
          <div className="text-3xl font-bold">{value}</div>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      )}
      
      {chart && <div className="mt-4">{chart}</div>}
    </div>
  );
}