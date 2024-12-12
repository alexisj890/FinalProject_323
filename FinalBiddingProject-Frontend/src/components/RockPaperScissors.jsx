import React, { useState } from 'react';

const RockPaperScissors = ({ players, onGameEnd }) => {
  const [round, setRound] = useState(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [playerChoices, setPlayerChoices] = useState({ player1: null, player2: null });
  const [result, setResult] = useState('');

  const options = ['rock', 'paper', 'scissors'];

  // Logic for determining the winner of a round
  const determineWinner = (choice1, choice2) => {
    if (choice1 === choice2) return 'tie';
    if (
      (choice1 === 'rock' && choice2 === 'scissors') ||
      (choice1 === 'paper' && choice2 === 'rock') ||
      (choice1 === 'scissors' && choice2 === 'paper')
    ) {
      return 'player1';
    }
    return 'player2';
  };

  // Handle player moves
  const handleChoice = (player, choice) => {
    setPlayerChoices((prev) => ({ ...prev, [player]: choice }));

    if (player === 'player2') {
      const winner = determineWinner(playerChoices.player1, choice);

      if (winner === 'player1') {
        setScores((prev) => ({ ...prev, player1: prev.player1 + 1 }));
        setResult(`${players.player1} wins this round!`);
      } else if (winner === 'player2') {
        setScores((prev) => ({ ...prev, player2: prev.player2 + 1 }));
        setResult(`${players.player2} wins this round!`);
      } else {
        setResult('It\'s a tie!');
      }

      setRound((prev) => prev + 1);
      setPlayerChoices({ player1: null, player2: null });

      // End the game if one player reaches 2 wins
      if (scores.player1 === 1 || scores.player2 === 1) {
        const finalWinner = scores.player1 > scores.player2 ? 'player1' : 'player2';
        onGameEnd(finalWinner);
      }
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>Rock-Paper-Scissors: Round {round}</h2>
      <p>{result}</p>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {['player1', 'player2'].map((player) => (
          <div key={player}>
            <h3>{players[player]}</h3>
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleChoice(player, option)}
                disabled={playerChoices[player] !== null}
                style={{ margin: '5px', padding: '10px' }}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RockPaperScissors;
