import { useEffect, useState } from 'react';
import  supabase  from './services/supabaseClient';

const useFetchRankings = () => {
  const [totalRankings, setTotalRankings] = useState([]);
  const [todaysRankings, setTodaysRankings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);  // 今日の始まり（00:00:00）
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);  // 今日の終わり（23:59:59）

        // トータルランキングの取得
        const { data: totalData, error: totalError } = await supabase
          .from('Ranking')
          .select('nickname, score')
          .order('score', { ascending: false })
          .limit(20);

        if (totalError) throw totalError;

        // 今日のランキングの取得
        const { data: todaysData, error: todaysError } = await supabase
          .from('Ranking')
          .select('nickname, score')
          .gte('created_at', todayStart.toISOString())  // 今日の始まり以降
          .lte('created_at', todayEnd.toISOString())  // 今日の終わりまで
          .order('score', { ascending: false })
          .limit(20);

        if (todaysError) throw todaysError;

        setTotalRankings(totalData);
        setTodaysRankings(todaysData);
      } catch (error) {
        console.error('Error fetching rankings:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRankings();
  }, []);

  return { totalRankings, todaysRankings, isLoading, error };
};

export default useFetchRankings;
