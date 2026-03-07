export default function StatsCard({ icon, title, value, colorClass, bgColorClass }) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            {/* Icon Box */}
            <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${bgColorClass} ${colorClass}`}>
                {icon}
            </div>

            {/* Content */}
            <div className="z-10 relative">
                <p className="mb-1 text-sm font-medium text-gray-500">{title}</p>
                <h3 className={`font-display text-3xl font-bold ${colorClass}`}>{value}</h3>
            </div>

            {/* Decorative Element */}
            <div className={`absolute -bottom-6 -right-6 h-24 w-24 rounded-full ${bgColorClass} opacity-50`} />
        </div>
    );
}
