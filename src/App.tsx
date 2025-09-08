import { useEffect, useState } from 'react';
import { useGameState } from './useGameState';
import { HomeScreen } from './components/HomeScreen';
import { GameHeader } from './components/GameHeader';
import { QuestionCard } from './components/QuestionCard';
import { GameResults } from './components/GameResults';
import { dbService } from './database';
import { sampleWords } from './words';

type GameScreen = 'home' | 'game' | 'results';

function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('home');
  const [dbInitialized, setDbInitialized] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const { gameState, highScore, startNewGame, answerQuestion, useHint, getCurrentQuestion, getGameStats } = useGameState();

  useEffect(() => {
    const initDb = async () => {
      try {
        await dbService.init();
        const isEmpty = await dbService.isWordsEmpty();
        if (isEmpty) {
          await dbService.addWords(sampleWords);
        }
        setDbInitialized(true);
      } catch (error) {
        console.error('Database initialization failed:', error);
      }
    };
    initDb();
  }, []);

  const handleStartGame = async () => {
    await startNewGame();
    setCurrentScreen('game');
    setShowFeedback(false);
    setIsCorrect(false);
  };

  const handleAnswer = async (answer: string) => {
    const result = await answerQuestion(answer);
    if (result) {
      setIsCorrect(result.isCorrect);
      setShowFeedback(true);
      
      // 播放音效
      if (result.isCorrect) {
        playCorrectSound();
      } else {
        playWrongSound();
      }

      setTimeout(() => {
        setShowFeedback(false);
        if (result.gameState.isGameOver) {
          setCurrentScreen('results');
        }
      }, 1000);
    }
  };

  const handlePlayAgain = () => {
    handleStartGame();
  };

  const playCorrectSound = () => {
    // 创建简单的音效
    const WebAudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioContext = new WebAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'square';
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const playWrongSound = () => {
    const WebAudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioContext = new WebAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 200;
    oscillator.type = 'sawtooth';
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  if (!dbInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-2xl text-primary mb-4">🎮</div>
          <div className="text-white">初始化中...</div>
        </div>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();
  const gameStats = getGameStats();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl">
        {currentScreen === 'home' && (
          <HomeScreen onStartGame={handleStartGame} highScore={highScore} />
        )}

        {currentScreen === 'game' && currentQuestion && (
          <div className="space-y-6">
            <GameHeader
              score={gameState.score}
              lives={gameState.lives}
              combo={gameState.combo}
              highScore={highScore}
            />
            <QuestionCard
              question={currentQuestion}
              onAnswer={handleAnswer}
              onHint={useHint}
              hintsRemaining={gameState.hints}
              showFeedback={showFeedback}
              isCorrect={isCorrect}
            />
            <div className="text-center text-sm text-gray-500">
              第 {gameState.currentQuestionIndex + 1} / {gameState.questions.length} 题
            </div>
          </div>
        )}

        {currentScreen === 'results' && (
          <GameResults
            score={gameState.score}
            accuracy={gameStats.accuracy}
            maxCombo={gameStats.maxCombo}
            totalQuestions={gameStats.totalQuestions}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </div>
    </div>
  );
}

export default App
