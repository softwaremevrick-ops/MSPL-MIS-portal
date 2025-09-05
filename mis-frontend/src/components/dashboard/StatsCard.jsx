import React from 'react';
import Card  from "../../components/ui/Card";
import { CardContent } from "../../components/ui/Card";

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  iconColor = "text-blue-600",
  bgColor = "bg-blue-50",
  borderColor = "border-blue-200",
  isDate = false
}) {
  return (
    <Card className={`${borderColor} border-2 ${bgColor} hover:shadow-lg transition-all duration-300`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
            <p className={`text-2xl font-bold text-gray-900 ${isDate ? 'text-lg' : ''}`}>
              {value}
            </p>
          </div>
          <div className={`p-3 rounded-full ${bgColor}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}