import React from 'react';
import { Heart, Trophy, Zap } from 'lucide-react';

interface GameHeaderProps {
  score: number;
  lives: number;
  combo: number;
  highScore: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  score,
  lives,
  combo,
  highScore
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="grid grid-cols-4 gap-4 text-center">
        {/* 分数 */}
        <div className="pixel-card">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy size={16} className="text-yellow-500" />
            <span className="text-xs">分数</span>
          </div>
          <div className="text-xl font-bold text-primary">{score}</div>
        </div>

        {/* 生命值 */}
        <div className="pixel-card">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart size={16} className="text-red-500" />
            <span className="text-xs">生命</span>
          </div>
          <div className="flex justify-center gap-1">
            {Array.from({ length: 3 }, (_, i) => (
              <Heart
                key={i}
                size={20}
                className={i < lives ? 'text-red-500 life-heart' : 'text-gray-600'}
              />
            ))}
          </div>
        </div>

        {/* 连击 */}
        <div className="pixel-card">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap size={16} className="text-primary" />
            <span className="text-xs">连击</span>
          </div>
          <div className={`text-xl font-bold ${combo > 0 ? 'combo-text' : 'text-white'}`}>
            {combo}
          </div>
        </div>

        {/* 最高分 */}
        <div className="pixel-card">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy size={16} className="text-primary" />
            <span className="text-xs">最高分</span>
          </div>
          <div className="text-xl font-bold text-yellow-500">{highScore}</div>
        </div>
      </div>
    </div>
  );
};