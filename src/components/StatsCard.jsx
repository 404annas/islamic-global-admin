export default function StatsCard({ title, value, icon: Icon, color, bgColor }) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-primary mt-2">{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`text-green-700`} />
        </div>
      </div>
    </div>
  );
}
