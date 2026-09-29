import { useEffect, useState } from "react";


export default function useGameLogic(cardValues) {
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(0);
    const [isLocked, setIsLocked] = useState(false);

    function shuffleArray(array) {
        const shuffled = [...array];

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled;
    }

    function initializeGame() {

        const shuffledCards = shuffleArray(cardValues);

        setCards(shuffledCards.map((value, index) => (
            {
                id: index,
                value,
                isFlipped: false,
                isMatched: false,
            }
        )));

        setIsLocked(false);
        setMoves(0);
        setScore(0);
        setMatchedCards([]);
        setFlippedCards([]);
    };

    useEffect(() => {
        initializeGame();
    }, [])

    function handleCardClick(card) {

        if (card.isFlipped || card.isMatched || isLocked || flippedCards.length === 2) {
            return;
        };

        const newCards = cards.map((c) => {
            if (c.id === card.id) {
                return { ...c, isFlipped: true };
            } else {
                return c;
            }
        });

        setCards(newCards);

        const newFlippedCards = [...flippedCards, card.id];
        setFlippedCards(newFlippedCards);

        if (flippedCards.length === 1) {
            setIsLocked(true);
            const firstCard = cards[flippedCards[0]];

            if (firstCard.value === card.value) {
                setTimeout(() => {

                    setMatchedCards((prev) => [...prev, firstCard.id, card.id]);

                    setCards((prev) =>
                        prev.map((c) => {
                            if (c.id === card.id || c.id === firstCard.id) {
                                return { ...c, isMatched: true };
                            } else {
                                return c;
                            }
                        }));

                    setFlippedCards([]);
                    setScore((prev) => prev + 1);
                    setIsLocked(false);
                }, 500)
            } else {

                setTimeout(() => {

                    const flippedBackCards = newCards.map((c) => {
                        if (newFlippedCards.includes(c.id) || c.id === card.id) {
                            return { ...c, isFlipped: false }
                        } else {
                            return c;
                        }
                    });

                    setCards(flippedBackCards);
                    setFlippedCards([]);
                    setIsLocked(false);
                }, 1000)
            }

            setMoves((prev) => prev + 1);

        }

    };

    const isGameComplete = matchedCards.length === cardValues.length;

    return {
        cards,
        score,
        moves,
        isGameComplete,
        initializeGame,
        handleCardClick,
    }

}