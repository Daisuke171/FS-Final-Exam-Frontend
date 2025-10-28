"use client";

type CircularProgressProps = {
  percentage: number;
  size?: number;
};

const getPrimaryColor = (percentage: number) => {
  if (percentage > 60) return "var(--color-success)";
  if (percentage > 45) return "var(--color-medium-ranking)";
  if (percentage > 25) return "var(--color-error)";
  return "var(--color-error)";
};

const getSecondaryColor = (percentage: number) => {
  if (percentage > 60) return "var(--color-dark-success)";
  if (percentage > 45) return "var(--color-shadow-ranking)";
  if (percentage > 25) return "var(--color-shadow-error)";
  return "var(--color-dark-error)";
};

function CircularProgress({ percentage, size = 90 }: CircularProgressProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      className="transform -rotate-90"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="10"
        fill="transparent"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#gradient)"
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        fill="transparent"
      />
      <defs>
        <linearGradient
          id="gradient"
          x1="1"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor={getPrimaryColor(percentage)}
          />
          <stop
            offset="100%"
            stopColor={getSecondaryColor(percentage)}
          />
        </linearGradient>
      </defs>
      <text
        x={size / 2}
        y={-size / 2 + 7}
        textAnchor="middle"
        className="text-font fill-white text-lg font-semibold rotate-90"
      >
        {percentage}%
      </text>
    </svg>
  );
}

export default CircularProgress;
