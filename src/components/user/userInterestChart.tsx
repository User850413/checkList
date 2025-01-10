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

  return (
    <>
      {interestList.map((interest, index) => (
        <span key={index}>{interest}</span>
      ))}
      <DonutChart values={percentage} />
    </>
  );
}
