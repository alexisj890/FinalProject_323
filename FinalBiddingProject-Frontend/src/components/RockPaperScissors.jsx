import React, { useState } from 'react';

const RockPaperScissors = ({ players, onGameEnd }) => {
  const [round, setRound] = useState(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [playerChoices, setPlayerChoices] = useState({ player1: null, player2: null });
  const [result, setResult] = useState('');

  const options = ['rock', 'paper', 'scissors'];

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

  const handleChoice = (player, choice) => {
    setPlayerChoices((prev) => ({ ...prev, [player]: choice }));

    // Once both players have chosen, determine the winner
    if (player === 'player2') {
      const winner = determineWinner(playerChoices.player1, choice);

      setScores((prevScores) => {
        let newScores = { ...prevScores };

        if (winner === 'player1') {
          newScores.player1 += 1;
          setResult(`${players.player1} wins this round!`);
        } else if (winner === 'player2') {
          newScores.player2 += 1;
          setResult(`${players.player2} wins this round!`);
        } else {
          setResult("It's a tie!");
        }

        // Check if someone reached 2 wins
        if (newScores.player1 === 2 || newScores.player2 === 2) {
          const finalWinner =
            newScores.player1 > newScores.player2 ? 'player1' : 'player2';
          onGameEnd(finalWinner);
        } else {
          // Move to the next round if no one has won yet
          setRound((prevRound) => prevRound + 1);
          setPlayerChoices({ player1: null, player2: null });
        }

        return newScores;
      });
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>Rock-Paper-Scissors: Round {round}</h2>
      <p>{result}</p>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {['player1', 'player2'].map((playerKey) => (
          <div key={playerKey}>
            <h3>{players[playerKey]}</h3>
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleChoice(playerKey, option)}
                disabled={playerChoices[playerKey] !== null}
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
