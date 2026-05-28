export default function DonutChart({ data, size = 200, thickness = 28, formatValue }) {
    const total = data.reduce((s, d) => s + Number(d.value || 0), 0) || 1;
    const radius = size / 2 - thickness / 2;
    const cx = size / 2;
    const cy = size / 2;

    let cumulative = 0;
    const arcs = data.map((d, idx) => {
        const value = Number(d.value) || 0;
        const start = (cumulative / total) * Math.PI * 2 - Math.PI / 2;
        cumulative += value;
        const end = (cumulative / total) * Math.PI * 2 - Math.PI / 2;
        const large = end - start > Math.PI ? 1 : 0;

        const x1 = cx + radius * Math.cos(start);
        const y1 = cy + radius * Math.sin(start);
        const x2 = cx + radius * Math.cos(end);
        const y2 = cy + radius * Math.sin(end);

        const path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
        return { path, color: d.color, label: d.label, value };
    });

    return (
        <div className="flex items-center gap-6">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#F3F4F6" strokeWidth={thickness} />
                {arcs.map((a, i) => (
                    <path
                        key={i}
                        d={a.path}
                        stroke={a.color}
                        strokeWidth={thickness}
                        fill="none"
                        strokeLinecap="butt"
                    />
                ))}
                <text x={cx} y={cy - 6} textAnchor="middle" fontSize="10" fill="#9CA3AF" fontWeight="600">TOTAL</text>
                <text x={cx} y={cy + 12} textAnchor="middle" fontSize="14" fill="#1F2937" fontWeight="700">
                    {formatValue ? formatValue(total) : total.toLocaleString()}
                </text>
            </svg>
            <div className="flex-1 space-y-2">
                {data.map((d, i) => {
                    const pct = total > 0 ? ((Number(d.value) || 0) / total) * 100 : 0;
                    return (
                        <div key={i} className="flex items-center gap-2 text-sm">
                            <span className="h-3 w-3 rounded-sm" style={{ background: d.color }} />
                            <span className="text-gray-700 flex-1 truncate">{d.label}</span>
                            <span className="font-semibold text-gray-800">{formatValue ? formatValue(d.value) : d.value}</span>
                            <span className="text-xs text-gray-400 w-12 text-right">{pct.toFixed(1)}%</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
