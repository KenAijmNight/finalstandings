import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';

const initialMatches = [
  { id: 1, team1: 'Senshi eSports', team2: '24/7 Tower Dive', winner: null },
  { id: 2, team1: 'Aurora', team2: 'Mind Blue eSports', winner: null },
  { id: 3, team1: 'Jörmungang', team2: 'Meow Gaming Club', winner: null },
  { id: 4, team1: 'Dutch Community Team', team2: 'Pertinax Esports', winner: null },
  { id: 5, team1: 'Pertinax Esports', team2: 'Meow Gaming Club', winner: null },
  { id: 6, team1: 'Jörmungang', team2: 'Mind Blue eSports', winner: null },
  { id: 7, team1: '24/7 Tower Dive', team2: 'Aurora', winner: null },
  { id: 8, team1: 'Dutch Community Team', team2: 'Senshi eSports', winner: null },
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
  const [allMatchesSubmitted, setAllMatchesSubmitted] = useState(false);

  useEffect(() => {
    const allSubmitted = matches.every(match => match.submitted);
    setAllMatchesSubmitted(allSubmitted);
  }, [matches]);

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
    setStandings(prevStandings => 
      prevStandings.map(team => {
        if (team.team === winner) {
          return { ...team, wins: team.wins + 1 };
        } else if (team.team === loser) {
          return { ...team, losses: team.losses + 1 };
        }
        return team;
      }).sort((a, b) => {
        const winDiff = b.wins - a.wins;
        return winDiff !== 0 ? winDiff : a.losses - b.losses;
      })
    );
  };

  const downloadStandings = () => {
    const element = document.getElementById('standings-table');
    html2canvas(element).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'standings.png';
      link.click();
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Build your final standings</h2>
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
          <table id="standings-table" className="w-full">
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
          {allMatchesSubmitted && (
            <button
              onClick={downloadStandings}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
            >
              Download Standings
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchTracker;
