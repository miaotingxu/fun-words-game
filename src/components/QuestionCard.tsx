import React, { useState, useEffect } from 'react';
import type { Question } from '../types';
import { Volume2 } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  onHint: () => void;
  hintsRemaining: number;
  showFeedback?: boolean;
  isCorrect?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  onHint,
  hintsRemaining,
  showFeedback = false,
  isCorrect = false
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [spellingInput, setSpellingInput] = useState<string>('');
  const [hintText, setHintText] = useState<string>('');

  const handleChoiceSelect = (option: string) => {
    setSelectedAnswer(option);
    setTimeout(() => onAnswer(option), 300);
  };

  const handleSpellingSubmit = () => {
    if (spellingInput.trim()) {
      onAnswer(spellingInput.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSpellingSubmit();
    }
  };

  const handleHint = () => {
    if (hintsRemaining > 0) {
      const hint = getHintForQuestion(question);
      setHintText(hint);
      onHint();
    }
  };

  const getHintForQuestion = (q: Question): string => {
    switch (q.type) {
      case 'choice':
        return '提示：仔细看看每个选项的意思';
      case 'spelling': {
        const word = q.word.headword;
        return `提示：首字母是 "${word[0].toUpperCase()}"，共 ${word.length} 个字母`;
      }
      case 'audio':
        return '提示：听清楚发音，注意相似音的单词';
      default:
        return '提示：仔细思考一下';
    }
  };

  const playAudio = () => {
    // 使用 Web Speech API 合成语音
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(question.word.headword);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    setSelectedAnswer('');
    setSpellingInput('');
    setHintText('');
  }, [question]);

  const getFeedbackClass = () => {
    if (!showFeedback) return '';
    return isCorrect ? 'correct-flash' : 'wrong-shake';
  };

  return (
    <div className={`pixel-card w-full max-w-2xl mx-auto ${getFeedbackClass()}`}>
      {/* 题目类型和提示 */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-primary text-sm">
          {question.type === 'choice' && '选择题'}
          {question.type === 'spelling' && '拼写题'}
          {question.type === 'audio' && '听音题'}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-yellow-500 text-sm">提示: {hintsRemaining}</span>
          {hintsRemaining > 0 && (
            <button
              onClick={handleHint}
              className="pixel-button text-xs px-3 py-1"
            >
              提示
            </button>
          )}
        </div>
      </div>

      {/* 提示文本 */}
      {hintText && (
        <div className="mb-4 p-3 bg-yellow-500 bg-opacity-20 border border-yellow-500 text-yellow-500 text-xs">
          {hintText}
        </div>
      )}

      {/* 题目内容 */}
      <div className="mb-8 text-center">
        {question.type === 'choice' && (
          <div>
            <div className="text-lg mb-4">请选择 "{question.word.headword}" 的正确释义：</div>
            <div className="text-2xl text-primary mb-6">{question.word.headword}</div>
          </div>
        )}

        {question.type === 'spelling' && (
          <div>
            <div className="text-lg mb-4">请拼写以下单词的英文：</div>
            <div className="text-2xl text-primary mb-6">{question.word.meaning}</div>
          </div>
        )}

        {question.type === 'audio' && (
          <div>
            <div className="text-lg mb-4">请听发音，选择正确的单词：</div>
            <button
              onClick={playAudio}
              className="pixel-button mb-4 flex items-center gap-2 mx-auto"
            >
              <Volume2 size={16} />
              播放发音
            </button>
          </div>
        )}
      </div>

      {/* 答案区域 */}
      <div className="space-y-3">
        {question.type === 'choice' && (
          <div className="grid grid-cols-1 gap-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleChoiceSelect(option)}
                disabled={showFeedback}
                className={`pixel-button text-left w-full ${
                  selectedAnswer === option ? 'bg-primary text-black' : ''
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {question.type === 'spelling' && (
          <div className="flex gap-3">
            <input
              type="text"
              value={spellingInput}
              onChange={(e) => setSpellingInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入英文单词..."
              className="pixel-input flex-1"
              disabled={showFeedback}
            />
            <button
              onClick={handleSpellingSubmit}
              disabled={!spellingInput.trim() || showFeedback}
              className="pixel-button"
            >
              提交
            </button>
          </div>
        )}

        {question.type === 'audio' && (
          <div className="grid grid-cols-1 gap-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleChoiceSelect(option)}
                disabled={showFeedback}
                className={`pixel-button text-left w-full ${
                  selectedAnswer === option ? 'bg-primary text-black' : ''
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};