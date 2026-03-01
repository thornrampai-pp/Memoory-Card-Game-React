import { GameHeader } from "./components/GameHeader";
import { Card } from "./components/Card";
import  { useState, useEffect } from "react";

const cardValues = [
  "🐶",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
  "🐶",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
];

function App() {
  const [cards, setCards] = useState([]); // State สำหรับเก็บไพ่ที่เตรียมแล้ว
  const [flippedCards, setFlippedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);


  useEffect(() => {
    const initializeGame = () => {
     

      const finalCards = cardValues.map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
      }));
      setCards(finalCards);
    };

    initializeGame();
  }, []);

  const handleCardClick = (clickedCard) => {
    // 1. ตัวกั้น (Guard Clauses)
    // ห้ามกดถ้า: กำลังเปิดค้างไว้ 2 ใบ, ไพ่ใบเดิมถูกเปิดอยู่แล้ว, หรือไพ่คู่นั้นถูก Match ไปแล้ว
    if (
      flippedCards.length >= 2 ||
      clickedCard.isFlipped ||
      clickedCard.isMatched
    ) {
      return;
    }

    // 2. สั่งเปิดไพ่ใบที่คลิกทันที
    const newCardsAfterFlip = cards.map((c) =>
      c.id === clickedCard.id ? { ...c, isFlipped: true } : c,
    );
    setCards(newCardsAfterFlip);

    // 3. เตรียมข้อมูลสำหรับเช็ค Match
    const newFlippedIds = [...flippedCards, clickedCard.id];
    setFlippedCards(newFlippedIds);

    // 4. ถ้าเปิดครบ 2 ใบแล้ว ให้เช็ค Match
    if (newFlippedIds.length === 2) {
      const firstCard = cards.find((c) => c.id === newFlippedIds[0]);
      const secondCard = clickedCard; // ใบที่เพิ่งคลิก

      if (firstCard.value === secondCard.value) {
        // --- กรณี MATCH ---
        setTimeout(() => {
          setScore((prev) => prev + 1);
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstCard.id || c.id === secondCard.id
                ? { ...c, isMatched: true, isFlipped: true }
                : c,
            ),
          );
          setFlippedCards([]);
        }, 500);
      } else {
        // --- กรณี NOT MATCH ---
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstCard.id || c.id === secondCard.id
                ? { ...c, isFlipped: false }
                : c,
            ),
          );
          setFlippedCards([]);
        }, 1000); // เพิ่มเวลาเป็น 1s เพื่อให้ผู้เล่นจำหน้าไพ่ได้ทัน
      }
      setMoves((prev) => prev + 1);
     
    }
  };

  return (
    <div className="app">
      <GameHeader score={score} moves={moves} />
      <div className="cards-grid">
        {cards.map((card) => {
          return <Card card={card} onClick={handleCardClick} />;
        })}
      </div>
      
    </div>
  );
}

export default App;
