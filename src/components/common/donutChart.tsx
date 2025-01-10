interface DonutChartProps {
  angle: number;
  radius: number;
  svgSize: number;
  innerRadius: number;
}

export default function DonutChart({
  angle = 90,
  radius = 40,
  svgSize = 300,
  innerRadius = 20,
}: DonutChartProps) {
  // 각도에 따라 끝점 좌표 계산 (시계 방향)
  const x = Math.cos(((angle - 90) * Math.PI) / 180); // -90으로 시작점 기준 이동
  const y = Math.sin(((angle - 90) * Math.PI) / 180);

  // 끝점 좌표 계산
  const coordX = x * radius + svgSize / 2;
  const coordY = y * radius + svgSize / 2; // y는 반전하지 않음 (시계 방향)

  return (
    <>
      donut chart
      <svg
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        width={svgSize}
        height={svgSize}
      >
        <path
          fill="tomato"
          d={`M ${svgSize / 2} ${svgSize / 2 - radius}
             A ${radius} ${radius} 0 ${angle > 180 ? 1 : 0} 1 ${coordX} ${coordY}
             L ${svgSize / 2 + innerRadius * Math.cos(((angle - 90) * Math.PI) / 180)} ${
               svgSize / 2 +
               innerRadius * Math.sin(((angle - 90) * Math.PI) / 180)
             }
             A ${innerRadius} ${innerRadius} 0 ${angle > 180 ? 1 : 0} 0 ${
               svgSize / 2
             } ${svgSize / 2 - innerRadius} Z`}
        />
        <path
          fill="skyblue"
          d={`M ${svgSize / 2} ${svgSize / 2 - radius}
             A ${radius} ${radius} 0 ${angle > 180 ? 1 : 0} 1 ${coordX} ${coordY}
             L ${svgSize / 2 + innerRadius * Math.cos(((angle - 90) * Math.PI) / 180)} ${
               svgSize / 2 +
               innerRadius * Math.sin(((angle - 90) * Math.PI) / 180)
             }
             A ${innerRadius} ${innerRadius} 0 ${angle > 180 ? 1 : 0} 0 ${
               svgSize / 2
             } ${svgSize / 2 - innerRadius} Z`}
          transform={`rotate(90, ${svgSize / 2}, ${svgSize / 2})`} // 중심을 기준으로 회전
        />
      </svg>
    </>
  );
}
