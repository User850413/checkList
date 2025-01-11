'use client';

import { useQuery } from '@tanstack/react-query';
import DonutChart from '../common/donutChart';
import { QueryKeys } from '@/app/lib/constants/queryKeys';
import { getMyTags } from '@/app/services/api/tags';
import { useEffect, useState } from 'react';
import { Tag } from '@/types/tag';

export default function UserInterestChart() {
  const [interestList, setInterestList] = useState<string[]>([]);
  const [topFive, setTopFive] = useState<string[]>([]);
  const [percentage, setPercentage] = useState<number[]>([]);

  // NOTE : 완료된 tags 불러오는 쿼리
  const { data: tagsData } = useQuery({
    queryKey: QueryKeys.MY_TAGS_COMPLETED,
    queryFn: () => getMyTags({ isCompleted: 'true' }),
  });
  useEffect(() => {
    let interests: string[] = [];

    tagsData &&
      tagsData.data.map((tag: Tag) => {
        interests.push(tag.interest);
      });
    setInterestList(interests);
  }, [tagsData]);

  // NOTE : interest 개수 추출 후 percentage 반영
  useEffect(() => {
    let count: { [key: string]: number } = {};
    if (interestList.length > 0) {
      for (let key of interestList) {
        count[key] = (count[key] || 0) + 1;
      }
    }

    let sortedCount = Object.entries(count)
      .sort(([, a], [, b]) => b - a)
      .map(([key]) => key)
      .slice(0, 5);

    setTopFive(sortedCount);

    let totalValue = 0;
    sortedCount.map((item) => {
      totalValue += count[item];
    });

    setPercentage(sortedCount.map((item) => (count[item] / totalValue) * 100));
  }, [interestList]);

  const colors = [
    '#0077B6',
    ' #0096C7',
    ' #00B4D8',
    '#48CAE4',
    '#90E0EF',
    '#cccccc',
  ];

  return (
    <>
      <div className="mx-14 mt-10 flex min-w-[800px] flex-col items-center justify-between rounded-lg bg-slate-200 px-10 pb-5 pt-3">
        <span className="mb-5 mr-auto cursor-default font-semibold text-slate-500">
          어떤 목표를 가장 많이 달성했나요?
        </span>
        <div className="flex items-start gap-7">
          <span>
            <DonutChart
              values={percentage}
              size={160}
              innerRadius={60}
              colors={colors}
            />
          </span>
          <ul>
            {topFive.map((item, index) => (
              <li
                key={index}
                className="relative flex cursor-default items-center gap-2 text-sm text-slate-500"
              >
                <span
                  className="h-3 w-3"
                  style={{ backgroundColor: colors[index] }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
