import React from 'react';
import { RotateCcw, Trophy, Target } from 'lucide-react';

interface GameResultsProps {
  score: number;
  accuracy: number;
  maxCombo: number;
  totalQuestions: number;
  onPlayAgain: () => void;
}

export const GameResults: React.FC<GameResultsProps> = ({
  score,
  accuracy,
  maxCombo,
  totalQuestions,
  onPlayAgain
}) => {
  const getMedal = () => {
    if (accuracy >= 90) return { icon: '🏆', grade: 'S', color: 'text-yellow-500' };
    if (accuracy >= 80) return { icon: '🥇', grade: 'A', color: 'text-primary' };
    if (accuracy >= 70) return { icon: '🥈', grade: 'B', color: 'text-gray-400' };
    if (accuracy >= 60) return { icon: '🥉', grade: 'C', color: 'text-orange-600' };
    return { icon: '📝', grade: 'D', color: 'text-red-500' };
  };

  const medal = getMedal();

  return (
    <div className="pixel-card w-full max-w-md mx-auto text-center">
      {/* 奖牌显示 */}
      <div className="mb-6">
        <div className={`text-6xl mb-2 ${medal.color}`}>
          {medal.icon}
        </div>
        <div className={`text-2xl font-bold ${medal.color}`}>
          等级 {medal.grade}
        </div>
      </div>

      {/* 分数显示 */}
      <div className="mb-6">
        <div className="text-3xl font-bold text-primary mb-2">{score} 分</div>
        <div className="text-sm text-gray-400">最终得分</div>
      </div>

      {/* 统计信息 */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-primary" />
            <span className="text-sm">正确率</span>
          </div>
          <span className="text-lg font-bold text-primary">{accuracy}%</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-yellow-500" />
            <span className="text-sm">最高连击</span>
          </div>
          <span className="text-lg font-bold text-yellow-500">{maxCombo}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-green-500" />
            <span className="text-sm">总题数</span>
          </div>
          <span className="text-lg font-bold text-green-500">{totalQuestions}</span>
        </div>
      </div>

      {/* 评价文本 */}
      <div className="mb-8 p-4 bg-primary bg-opacity-10 border border-primary rounded">
        <div className="text-sm text-primary">
          {accuracy >= 90 && '太棒了！你是真正的单词大师！'}
          {accuracy >= 80 && accuracy < 90 && '很好！继续努力，你会更棒的！'}
          {accuracy >= 70 && accuracy < 80 && '不错！还有提升空间哦！'}
          {accuracy >= 60 && accuracy < 70 && '加油！多练习就能提高！'}
          {accuracy < 60 && '别灰心！多练习一定会有进步的！'}
        </div>
      </div>

      {/* 操作按钮 */}
      <button
        onClick={onPlayAgain}
        className="pixel-button w-full flex items-center justify-center gap-2"
      >
        <RotateCcw size={16} />
        再来一局
      </button>
    </div>
  );
};

// 为了避免循环依赖，在这里重新定义 Zap 图标
const Zap = ({ size, className }: { size: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);