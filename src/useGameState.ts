import { useState, useEffect, useCallback } from 'react';
import type { GameState, Question } from './types';
import { dbService } from './database';
import { questionService } from './questionService';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    combo: 0,
    maxCombo: 0,
    hints: 2,
    currentQuestionIndex: 0,
    isGameOver: false,
    questions: [],
    answers: []
  });

  const [highScore, setHighScore] = useState(0);

  const loadHighScore = useCallback(async () => {
    const score = await dbService.getHighScore();
    setHighScore(score);
  }, []);

  useEffect(() => {
    loadHighScore();
  }, [loadHighScore]);

  const startNewGame = useCallback(async () => {
    const questions = await questionService.generateQuestions();
    setGameState({
      score: 0,
      lives: 3,
      combo: 0,
      maxCombo: 0,
      hints: 2,
      currentQuestionIndex: 0,
      isGameOver: false,
      questions,
      answers: []
    });
  }, []);

  const answerQuestion = useCallback(async (answer: string) => {
    if (gameState.isGameOver || gameState.currentQuestionIndex >= gameState.questions.length) {
      return;
    }

    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    const isCorrect = questionService.checkAnswer(currentQuestion, answer);

    // 更新用户进度
    await dbService.updateProgress(currentQuestion.word.id, isCorrect);

    const newAnswers = [...gameState.answers, answer];
    let newScore = gameState.score;
    let newLives = gameState.lives;
    let newCombo = gameState.combo;
    let newMaxCombo = gameState.maxCombo;
    const newHints = gameState.hints;

    if (isCorrect) {
      newScore += 1;
      newCombo += 1;
      newMaxCombo = Math.max(newMaxCombo, newCombo);
      
      // 连击奖励
      if (newCombo === 5) {
        newLives = Math.min(newLives + 1, 3);
      }
    } else {
      newScore = Math.max(newScore - 1, 0);
      newLives -= 1;
      newCombo = 0;
    }

    const nextQuestionIndex = gameState.currentQuestionIndex + 1;
    const isGameOver = newLives <= 0 || nextQuestionIndex >= gameState.questions.length;

    const newGameState: GameState = {
      ...gameState,
      score: newScore,
      lives: newLives,
      combo: newCombo,
      maxCombo: newMaxCombo,
      hints: newHints,
      currentQuestionIndex: nextQuestionIndex,
      isGameOver,
      answers: newAnswers
    };

    setGameState(newGameState);

    if (isGameOver && newScore > highScore) {
      await dbService.updateHighScore(newScore);
      setHighScore(newScore);
    }

    return { isCorrect, gameState: newGameState };
  }, [gameState, highScore]);

  const useHint = useCallback(() => {
    if (gameState.hints <= 0 || gameState.isGameOver) {
      return null;
    }

    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    if (!currentQuestion) return null;

    const hint = questionService.getHint(currentQuestion);
    
    setGameState(prev => ({
      ...prev,
      hints: prev.hints - 1
    }));

    return hint;
  }, [gameState]);

  const getCurrentQuestion = useCallback((): Question | null => {
    if (gameState.currentQuestionIndex >= gameState.questions.length) {
      return null;
    }
    return gameState.questions[gameState.currentQuestionIndex];
  }, [gameState]);

  const getGameStats = useCallback(() => {
    const totalQuestions = gameState.answers.length;
    const correctAnswers = gameState.answers.filter((answer, index) => {
      if (index >= gameState.questions.length) return false;
      return questionService.checkAnswer(gameState.questions[index], answer);
    }).length;

    return {
      totalQuestions,
      correctAnswers,
      accuracy: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
      maxCombo: gameState.maxCombo
    };
  }, [gameState]);

  return {
    gameState,
    highScore,
    startNewGame,
    answerQuestion,
    useHint,
    getCurrentQuestion,
    getGameStats
  };
};