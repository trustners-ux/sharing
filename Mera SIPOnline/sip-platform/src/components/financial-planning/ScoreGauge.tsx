'use client';

import { useEffect, useState } from 'react';

interface ScoreGaugeProps {
  score: number; // 0-900
  grade: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const GRADE_COLORS: Record<string, { stroke: string; text: string; bg: string }> = {
  'Excellent': { stroke: '#065F46', text: '#065F46', bg: '#ECFDF5' },
  'Good': { stroke: '#0F766E', text: '#0F766E', bg: '#F0FDFA' },
  'Fair': { stroke: '#D97706', text: '#92400E', bg: '#FFFBEB' },
  'Needs Improvement': { stroke: '#EA580C', text: '#9A3412', bg: '#FFF7ED' },
  'Critical': { stroke: '#DC2626', text: '#991B1B', bg: '#FEF2F2' },
};

const SIZE_CONFIG = {
  sm: { width: 160, height: 100, strokeWidth: 10, radius: 60, fontSize: 28, labelSize: 10 },
  md: { width: 240, height: 150, strokeWidth: 14, radius: 90, fontSize: 42, labelSize: 13 },
  lg: { width: 320, height: 200, strokeWidth: 18, radius: 120, fontSize: 56, labelSize: 16 },
};

export default function ScoreGauge({ score, grade, size = 'md', animate = true }: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const config = SIZE_CONFIG[size];
  const colors = GRADE_COLORS[grade] || GRADE_COLORS['Fair'];

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      return;
    }

    let start = 0;
    const duration = 2000;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * score);
      setDisplayScore(start);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [score, animate]);

  // Arc calculation — semicircle (180 degrees)
  const centerX = config.width / 2;
  const centerY = config.height - 10;
  const r = config.radius;

  // SVG arc: start from left (180°) to right (0°)
  const startAngle = Math.PI; // 180 degrees (left)
  const endAngle = 0; // 0 degrees (right)
  const scorePercent = Math.min(displayScore / 900, 1);
  const currentAngle = startAngle - scorePercent * Math.PI;

  const arcStartX = centerX + r * Math.cos(startAngle);
  const arcStartY = centerY - r * Math.sin(startAngle);
  const arcEndX = centerX + r * Math.cos(endAngle);
  const arcEndY = centerY - r * Math.sin(endAngle);
  const scoreEndX = centerX + r * Math.cos(currentAngle);
  const scoreEndY = centerY - r * Math.sin(currentAngle);

  const largeArcFlag = scorePercent > 0.5 ? 1 : 0;

  // Background arc (full semicircle)
  const bgArcPath = `M ${arcStartX} ${arcStartY} A ${r} ${r} 0 1 1 ${arcEndX} ${arcEndY}`;
  // Score arc
  const scoreArcPath = scorePercent > 0
    ? `M ${arcStartX} ${arcStartY} A ${r} ${r} 0 ${largeArcFlag} 1 ${scoreEndX} ${scoreEndY}`
    : '';

  return (
    <div className="flex flex-col items-center">
      <svg width={config.width} height={config.height} viewBox={`0 0 ${config.width} ${config.height}`}>
        {/* Background arc */}
        <path
          d={bgArcPath}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
        />

        {/* Score arc with gradient */}
        {scoreArcPath && (
          <>
            <defs>
              <linearGradient id={`gauge-grad-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#DC2626" />
                <stop offset="25%" stopColor="#EA580C" />
                <stop offset="50%" stopColor="#D97706" />
                <stop offset="75%" stopColor="#0F766E" />
                <stop offset="100%" stopColor="#065F46" />
              </linearGradient>
            </defs>
            <path
              d={scoreArcPath}
              fill="none"
              stroke={`url(#gauge-grad-${size})`}
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
            />
          </>
        )}

        {/* Score text */}
        <text
          x={centerX}
          y={centerY - config.radius * 0.3}
          textAnchor="middle"
          fontSize={config.fontSize}
          fontWeight="800"
          fill={colors.text}
        >
          {displayScore}
        </text>

        {/* "out of 900" label */}
        <text
          x={centerX}
          y={centerY - config.radius * 0.3 + config.fontSize * 0.45}
          textAnchor="middle"
          fontSize={config.labelSize}
          fill="#94A3B8"
        >
          out of 900
        </text>

        {/* Scale labels */}
        <text x={arcStartX + 5} y={centerY + 4} fontSize={config.labelSize - 2} fill="#94A3B8" textAnchor="start">0</text>
        <text x={arcEndX - 5} y={centerY + 4} fontSize={config.labelSize - 2} fill="#94A3B8" textAnchor="end">900</text>
      </svg>

      {/* Grade badge */}
      <div
        className="mt-1 px-4 py-1.5 rounded-full text-sm font-bold"
        style={{ backgroundColor: colors.bg, color: colors.text }}
      >
        {grade}
      </div>
    </div>
  );
}
