import React from 'react';
import useFetchRankings from './useFetchRankings';

const RankingsComponent = () => {
  const { totalRankings, todaysRankings, isLoading, error } = useFetchRankings();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching rankings: {error.message}</div>;

  return (
  <div>
    <h1>Total Rankings</h1>
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Nickname</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {totalRankings.map((ranking, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{ranking.nickname}</td>
            <td>{ranking.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
    
    <h1>Today's Rankings</h1>
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Nickname</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {todaysRankings.map((ranking, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{ranking.nickname}</td>
            <td>{ranking.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

};

export default RankingsComponent;
