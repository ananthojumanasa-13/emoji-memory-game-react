import React, { useState, useEffect } from "react";
import EmojiCard from "./EmojiCard.jsx";
import "./App.css";

const emojisList = [
  { id: 1, emoji: "😀" },
  { id: 2, emoji: "😁" },
  { id: 3, emoji: "😂" },
  { id: 4, emoji: "🤣" },
  { id: 5, emoji: "😃" },
  { id: 6, emoji: "😄" },
  { id: 7, emoji: "😅" },
  { id: 8, emoji: "😆" },
  { id: 9, emoji: "😉" },
  { id: 10, emoji: "😊" },
  { id: 11, emoji: "😋" },
  { id: 12, emoji: "😎" },
  { id: 13, emoji: "😍" },
  { id: 14, emoji: "😘" },
  { id: 15, emoji: "🥰" },
  { id: 16, emoji: "😗" },
  { id: 17, emoji: "😙" },
  { id: 18, emoji: "😚" },
  { id: 19, emoji: "🙂" },
  { id: 20, emoji: "🤗" },
  { id: 21, emoji: "🤩" },
  { id: 22, emoji: "🤔" },
  { id: 23, emoji: "🤨" },
  { id: 24, emoji: "😐" },
  { id: 25, emoji: "😑" },
  { id: 26, emoji: "😶" },
  { id: 27, emoji: "🙄" },
  { id: 28, emoji: "😏" },
  { id: 29, emoji: "😣" },
  { id: 30, emoji: "😥" },
];

function App() {
  const [clickedEmojis, setClickedEmojis] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("playing");
  const [timeLeft, setTimeLeft] = useState(60);
  const [lives, setLives] = useState(3);
  const [difficulty, setDifficulty] = useState("Medium");
  const [gamesToday, setGamesToday] = useState(0);
  const [todayBest, setTodayBest] = useState(0);

  const getEmojis = () => {
    if (difficulty === "Easy") return emojisList.slice(0, 12);
    if (difficulty === "Medium") return emojisList.slice(0, 20);
    return emojisList;
  };

  const [emojis, setEmojis] = useState(getEmojis());

  useEffect(() => {
    setEmojis(getEmojis());
    setClickedEmojis([]);
    setScore(0);
    setLives(3);
    setTimeLeft(60);
    setGameStatus("playing");
  }, [difficulty]);

  useEffect(() => {
    const savedBest = localStorage.getItem("bestScore");
    const played = localStorage.getItem("gamesPlayed");

    if (savedBest) setBestScore(Number(savedBest));
    if (played) setGamesPlayed(Number(played));
  }, []);

  useEffect(() => {
    localStorage.setItem("bestScore", bestScore);
  }, [bestScore]);

  useEffect(() => {
    if (gameStatus !== "playing") return;

    if (timeLeft === 0) {
      setGameStatus("lost");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, gameStatus]);

  useEffect(() => {
  const today = new Date().toLocaleDateString();

  const savedDate = localStorage.getItem("todayDate");

  if (savedDate !== today) {
    localStorage.setItem("todayDate", today);
    localStorage.setItem("gamesToday", 0);
    localStorage.setItem("todayBest", 0);

    setGamesToday(0);
    setTodayBest(0);
  } else {
    setGamesToday(Number(localStorage.getItem("gamesToday")) || 0);
    setTodayBest(Number(localStorage.getItem("todayBest")) || 0);
  }
  }, []);

    const shuffleEmojis = (list) => {
    return [...list].sort(() => Math.random() - 0.5);
  };

  const handleClick = (id) => {
    if (clickedEmojis.includes(id)) {

      if (lives > 1) {
        setLives((prev) => prev - 1);
        setEmojis(shuffleEmojis(emojis));
        return;
      }

      setGameStatus("lost");

      const played = gamesToday + 1;
      setGamesToday(played);
      localStorage.setItem("gamesToday", played);

      if (score > todayBest) {
        setTodayBest(score);
        localStorage.setItem("todayBest", score);
      }

      return;
    }

    const newScore = score + 1;

    setScore(newScore);
    setClickedEmojis([...clickedEmojis, id]);
    setEmojis(shuffleEmojis(emojis));

    if (newScore > bestScore) {
      setBestScore(newScore);
    }

    if (newScore === emojis.length) {
      setGameStatus("won");
      const played = gamesToday + 1;
      setGamesToday(played);
      localStorage.setItem("gamesToday", played);

      if (newScore > todayBest) {
        setTodayBest(newScore);
        localStorage.setItem("todayBest", newScore);
      }
    }
  };

  const restartGame = () => {
    setClickedEmojis([]);
    setScore(0);
    setLives(3);
    setTimeLeft(60);
    setGameStatus("playing");
    setEmojis(shuffleEmojis(getEmojis()));
  };

  return (
    <div className="container">

      <h1>🎮 Emoji Memory Game</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>Difficulty : </label>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>

      <div className="score-board">

        <p>🏆 Score : {score}</p>

        <p>⭐ Best : {bestScore}</p>

        <p>
          {"❤️".repeat(lives)}
          {"🤍".repeat(3 - lives)}
        </p>

        <p>⏳ {timeLeft}s</p>

        <p>📅 Today : {gamesToday}</p>

        <p>🔥 Today Best : {todayBest}</p>

      </div>

      <div className="progress">
        <div
          className="progress-fill"
          style={{
            width: `${(score / emojis.length) * 100}%`,
          }}
        ></div>
      </div>
      <p style={{ marginTop: "10px", fontSize: "18px" }}>
        📈 Progress: {score} / {emojis.length}
      </p>

      {gameStatus !== "playing" && (
        <div className="result">

          <h2>
            {gameStatus === "won"
              ? "🎉 Congratulations! You Won!"
              : "😢 Game Over"}
          </h2>

          <button onClick={restartGame}>
            🔄 Play Again
          </button>

        </div>
      )}

      {gameStatus === "playing" && (

        <div className="emoji-grid">

          {emojis.map((item) => (

            <EmojiCard
              key={item.id}
              emoji={item.emoji}
              id={item.id}
              handleClick={handleClick}
            />

          ))}

        </div>

      )}

    </div>
  );
}

export default App;