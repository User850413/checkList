interface DonutChartProps {
  angles: number[];
  size: number;
  innerRadius: number;
}

export default function DonutChart({
  angles = [90, 120, 30],
  size = 100,
  innerRadius = 40,
}: DonutChartProps) {
  const radius = size / 2;

  // size가 innerRadius보다 작아질 시 innerRadius 크기 변경
  if (size < innerRadius * 2) {
    innerRadius = size / 2 - 10;
  }

  let currentAngle = -90; // 시작 각도 (위쪽에서 시작)

  // 섹션 데이터 미리 계산
  const sections = angles.map((angle, index) => {
    // 시작점 계산
    const startX = Math.cos((currentAngle * Math.PI) / 180) * radius + size / 2;
    const startY = Math.sin((currentAngle * Math.PI) / 180) * radius + size / 2;

    // 끝점 계산
    currentAngle += angle; // 각도를 업데이트
    const endX = Math.cos((currentAngle * Math.PI) / 180) * radius + size / 2;
    const endY = Math.sin((currentAngle * Math.PI) / 180) * radius + size / 2;

    // 내부 시작점 계산
    const innerStartX =
      Math.cos((currentAngle * Math.PI) / 180) * innerRadius + size / 2;
    const innerStartY =
      Math.sin((currentAngle * Math.PI) / 180) * innerRadius + size / 2;

    // 내부 끝점 계산
    const innerEndX =
      Math.cos(((currentAngle - angle) * Math.PI) / 180) * innerRadius +
      size / 2;
    const innerEndY =
      Math.sin(((currentAngle - angle) * Math.PI) / 180) * innerRadius +
      size / 2;

    // 큰 호 플래그 계산
    const largeArc = angle > 180 ? 1 : 0;

    return {
      startX,
      startY,
      endX,
      endY,
      innerStartX,
      innerStartY,
      innerEndX,
      innerEndY,
      largeArc,
      color: index % 2 === 0 ? 'tomato' : 'skyblue', // 섹션 색상
    };
  });

  const sectionColors = [
    '#0077B6',
    ' #0096C7',
    ' #00B4D8',
    '#48CAE4',
    '#90E0EF',
    '#cccccc',
  ];

  return (
    <>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        {sections.map((section, index) => (
          <path
            key={index}
            fill={sectionColors[index]}
            d={`M ${section.startX} ${section.startY}
               A ${radius} ${radius} 0 ${section.largeArc} 1 ${section.endX} ${section.endY}
               L ${section.innerStartX} ${section.innerStartY}
               A ${innerRadius} ${innerRadius} 0 ${section.largeArc} 0 ${section.innerEndX} ${section.innerEndY}
               Z`}
          />
        ))}
      </svg>
    </>
  );
}
