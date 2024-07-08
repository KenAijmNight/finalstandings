import React, { useState } from 'react';

const initialMatches = [
  { id: 1, team1: 'SEN', team2: 'TD', winner: null },
  { id: 2, team1: 'ARA', team2: 'MB', winner: null },
  { id: 3, team1: 'JMGG', team2: 'MEOW', winner: null },
  { id: 4, team1: 'DCT', team2: 'PTX', winner: null },
  { id: 5, team1: 'PTX', team2: 'MEOW', winner: null },
  { id: 6, team1: 'JMGG', team2: 'MB', winner: null },
  { id: 7, team1: 'TD', team2: 'ARA', winner: null },
  { id: 8, team1: 'DCT', team2: 'SEN', winner: null },
];

const initialStandings = [
  { team: 'Jörmungang', wins: 9, losses: 3 },
  { team: 'Dutch Community Team', wins: 8, losses: 4 },
  { team: 'Pertinax Esports', wins: 8, losses: 4 },
  { team: 'Senshi eSports', wins: 8, losses: 4 },
  { team: '24/7 Tower Dive', wins: 5, losses: 7 },
  { team: 'Aurora', wins: 4, losses: 8 },
  { team: 'Meow Gaming Club', wins: 4, losses: 8 },
  { team: 'Mind Blue eSports', wins: 2, losses: 10 },
];

const MatchTracker = () => {
  const [matches, setMatches] = useState(initialMatches);
  const [standings, setStandings] = useState(initialStandings);

  const handleWinnerSelect = (id, winner) => {
    setMatches(matches.map(match => 
      match.id === id ? { ...match, winner } : match
    ));
  };

  const handleSubmit = (id) => {
    const match = matches.find(m => m.id === id);
    if (match && match.winner && !match.submitted) {
      updateStandings(match.winner, match.winner === match.team1 ? match.team2 : match.team1);
      setMatches(matches.map(m => 
        m.id === id ? { ...m, submitted: true } : m
      ));
    }
  };

  const updateStandings = (winner, loser) => {
    setStandings(standings.map(team => {
      if (team.team === winner) {
        return { ...team, wins: team.wins + 1 };
      } else if (team.team === loser) {
        return { ...team, losses: team.losses + 1 };
      }
      return team;
    }).sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses)));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Match Tracker</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Matches</h3>
          {matches.map((match) => (
            <div key={match.id} className="mb-4 p-2 border rounded">
              <p>{match.team1} vs {match.team2}</p>
              <div className="mt-2">
                <label className="mr-2">
                  <input
                    type="radio"
                    name={`match-${match.id}`}
                    value={match.team1}
                    onChange={() => handleWinnerSelect(match.id, match.team1)}
                    disabled={match.submitted}
                  /> {match.team1}
                </label>
                <label>
                  <input
                    type="radio"
                    name={`match-${match.id}`}
                    value={match.team2}
                    onChange={() => handleWinnerSelect(match.id, match.team2)}
                    disabled={match.submitted}
                  /> {match.team2}
                </label>
              </div>
              <button 
                onClick={() => handleSubmit(match.id)} 
                disabled={!match.winner || match.submitted}
                className="mt-2 px-2 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
              >
                Submit
              </button>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Standings</h3>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Team</th>
                <th className="text-left">W</th>
                <th className="text-left">L</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team, index) => (
                <tr key={team.team} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                  <td>{team.team}</td>
                  <td>{team.wins}</td>
                  <td>{team.losses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MatchTracker;
