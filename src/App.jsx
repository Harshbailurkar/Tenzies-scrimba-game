import React from "react";
import "./index.css";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

let count = 0;
export default function App() {
  const storedBestScore = localStorage.getItem("bestscore");
  const initialBestScore = storedBestScore ? parseInt(storedBestScore, 10) : 0;

  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [bestScore, setBestScore] = React.useState(initialBestScore);

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);

    if (allHeld && allSameValue) {
      setTenzies(true);
      if (count < bestScore || bestScore === 0) {
        setBestScore(count);
        // Move the localStorage update here
        localStorage.setItem("bestscore", count.toString());
      } else {
        // Reset count to 0 when not in a tenzies state
        count = 0;
      }
    }
  }, [dice, count, bestScore]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      count = count + 1;
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    } else {
      setTenzies(false);
      setDice(allNewDice());
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }
  const diceElements = dice.map((die) => (
    <Die
      value={die.value}
      key={die.id}
      isHeld={die.isHeld}
      heldfunc={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      <h2>Best Score : {localStorage.getItem("bestscore")}</h2>{" "}
      <h2> current Score: {count}</h2>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="rolldice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
