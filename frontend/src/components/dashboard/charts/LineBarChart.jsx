import { useState, useMemo } from 'react';

// Responsive grouped chart with toggle between bar / line / area
export default function LineBarChart({
    data,
    series,
    xKey = 'label',
    height = 320,
    formatY = (v) => Number(v || 0).toLocaleString('en-PK'),
    initialType = 'bar'
}) {
    const [type, setType] = useState(initialType);
    const [hover, setHover] = useState(null);

    const padding = { top: 20, right: 20, bottom: 38, left: 56 };
    const width = 800; // viewBox; SVG scales
    const innerW = width - padding.left - padding.right;
    const innerH = height - padding.top - padding.bottom;

    const maxY = useMemo(() => {
        let max = 0;
        data.forEach(d => series.forEach(s => { max = Math.max(max, Number(d[s.key]) || 0); }));
        return Math.max(max, 10);
    }, [data, series]);

    const niceMax = useMemo(() => {
        const pow = Math.pow(10, Math.floor(Math.log10(maxY)));
        const n = Math.ceil(maxY / pow) * pow;
        return n;
    }, [maxY]);

    const yTicks = 5;
    const ticks = Array.from({ length: yTicks + 1 }, (_, i) => (niceMax / yTicks) * i);

    const xStep = data.length > 1 ? innerW / data.length : innerW;
    const groupCenterX = (i) => padding.left + xStep * i + xStep / 2;
    const yPos = (v) => padding.top + innerH - (Number(v) / niceMax) * innerH;

    // Bar width sized to series count
    const barGroupW = Math.min(xStep * 0.6, 64);
    const barW = barGroupW / series.length;

    const linePath = (key) => data.map((d, i) => {
        const x = groupCenterX(i);
        const y = yPos(d[key]);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    const areaPath = (key) => {
        if (data.length === 0) return '';
        const pts = data.map((d, i) => `${groupCenterX(i)},${yPos(d[key])}`).join(' L ');
        return `M ${groupCenterX(0)},${padding.top + innerH} L ${pts} L ${groupCenterX(data.length - 1)},${padding.top + innerH} Z`;
    };

    return (
        <div>
            <div className="flex items-center justify-end gap-1 mb-2">
                {['bar', 'line', 'area'].map(t => (
                    <button
                        key={t}
                        onClick={() => setType(t)}
                        className={`px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider font-semibold transition ${
                            type === t ? 'bg-[#4B5EAA] text-white' : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        {t}
                    </button>
                ))}
            </div>
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
                {/* gridlines */}
                {ticks.map((t, i) => (
                    <g key={i}>
                        <line
                            x1={padding.left}
                            x2={padding.left + innerW}
                            y1={yPos(t)}
                            y2={yPos(t)}
                            stroke="#E5E7EB"
                            strokeDasharray="3 4"
                        />
                        <text x={padding.left - 8} y={yPos(t) + 4} fontSize="10" textAnchor="end" fill="#9CA3AF">
                            {formatY(t)}
                        </text>
                    </g>
                ))}

                {/* x labels */}
                {data.map((d, i) => (
                    <text
                        key={i}
                        x={groupCenterX(i)}
                        y={padding.top + innerH + 18}
                        fontSize="10"
                        textAnchor="middle"
                        fill="#6B7280"
                    >
                        {d[xKey]}
                    </text>
                ))}

                {/* Bars */}
                {type === 'bar' && data.map((d, i) => (
                    <g key={i}>
                        {series.map((s, sIdx) => {
                            const v = Number(d[s.key]) || 0;
                            const x = groupCenterX(i) - barGroupW / 2 + sIdx * barW;
                            const y = yPos(v);
                            const h = padding.top + innerH - y;
                            return (
                                <rect
                                    key={s.key}
                                    x={x + 1}
                                    y={y}
                                    width={Math.max(0, barW - 2)}
                                    height={Math.max(0, h)}
                                    rx="3"
                                    fill={s.color}
                                    onMouseEnter={() => setHover({ i, sIdx })}
                                    onMouseLeave={() => setHover(null)}
                                />
                            );
                        })}
                    </g>
                ))}

                {/* Areas */}
                {type === 'area' && series.map(s => (
                    <path key={s.key} d={areaPath(s.key)} fill={s.color} opacity="0.18" />
                ))}

                {/* Lines */}
                {(type === 'line' || type === 'area') && series.map(s => (
                    <g key={s.key}>
                        <path d={linePath(s.key)} fill="none" stroke={s.color} strokeWidth="2.5" />
                        {data.map((d, i) => (
                            <circle
                                key={i}
                                cx={groupCenterX(i)}
                                cy={yPos(d[s.key])}
                                r="3.5"
                                fill="white"
                                stroke={s.color}
                                strokeWidth="2"
                            />
                        ))}
                    </g>
                ))}

                {/* Hover tooltip */}
                {hover && data[hover.i] && (() => {
                    const d = data[hover.i];
                    const cx = groupCenterX(hover.i);
                    const tx = cx > width - 140 ? cx - 160 : cx + 8;
                    return (
                        <g>
                            <rect x={tx} y={padding.top + 4} width="150" height={20 + series.length * 16} rx="6" fill="#111827" opacity="0.92" />
                            <text x={tx + 8} y={padding.top + 20} fontSize="10" fill="#F3F4F6" fontWeight="600">{d[xKey]}</text>
                            {series.map((s, idx) => (
                                <g key={s.key}>
                                    <circle cx={tx + 12} cy={padding.top + 36 + idx * 16} r="3" fill={s.color} />
                                    <text x={tx + 20} y={padding.top + 39 + idx * 16} fontSize="10" fill="#F3F4F6">
                                        {s.label}: {formatY(d[s.key])}
                                    </text>
                                </g>
                            ))}
                        </g>
                    );
                })()}
            </svg>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-3 justify-center">
                {series.map(s => (
                    <div key={s.key} className="flex items-center gap-1.5 text-xs text-gray-600">
                        <span className="h-3 w-3 rounded-sm" style={{ background: s.color }} />
                        {s.label}
                    </div>
                ))}
            </div>
        </div>
    );
}
