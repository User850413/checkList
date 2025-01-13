'use client';

import { useQuery } from '@tanstack/react-query';
import DonutChart from '../common/donutChart';
import { QueryKeys } from '@/app/lib/constants/queryKeys';
import { useEffect, useState } from 'react';
import { getTopInterest } from '@/app/services/api/interests';

export default function UserInterestChart() {
  const [interestList, setInterestList] = useState<string[]>([]);
  const [percentage, setPercentage] = useState<number[]>([]);

  // NOTE : 완료된 tags 불러오는 쿼리
  const { data: interestsData } = useQuery({
    queryKey: QueryKeys.MY_TAGS_COMPLETED,
    queryFn: () => getTopInterest(),
  });
  useEffect(() => {
    if (interestsData) {
      const updatedInterestList = interestsData.data;
      setInterestList(updatedInterestList);

      interestList.map(() => {
        if (interestsData.totalCount !== 0) {
          const calculatedPercentages = updatedInterestList.map(
            (interest: { [key: string]: number }) => {
              const count = Number(Object.values(interest)[0]);
              return (count / interestsData.totalCount) * 100;
            },
          );
          setPercentage(calculatedPercentages);
        }
      });
    }
  }, [interestsData, interestList]);

  const colors = [
    '#0077B6',
    '#0096C7',
    '#00B4D8',
    '#48CAE4',
    '#90E0EF',
    '#cccccc',
  ];

  return (
    <>
      <div className="mx-14 mt-10 flex min-w-[800px] flex-col items-center justify-between rounded-lg bg-slate-200 px-10 pb-5 pt-3">
        <span className="mb-5 mr-auto w-full cursor-default border-b-2 border-b-slate-300 pb-2 font-semibold text-slate-500">
          어떤 목표를 가장 많이 달성했나요?
        </span>
        <div className="flex items-start gap-7">
          <span>
            <DonutChart
              values={percentage}
              size={180}
              innerRadius={60}
              colors={colors}
            />
          </span>
          <ul>
            {interestList.map((item, index) => (
              <li
                key={index}
                className="relative flex cursor-default items-center gap-2 text-sm text-slate-500"
              >
                <span
                  className="h-3 w-3"
                  style={{ backgroundColor: colors[index] }}
                />
                <span>{Object.keys(item)[0]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
