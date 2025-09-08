import React from 'react';
import { Play } from 'lucide-react';

interface HomeScreenProps {
  onStartGame: () => void;
  highScore: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartGame, highScore }) => {
  return (
    <div className="text-center space-y-8">
      {/* Logo */}
      <div className="space-y-4">
        <div className="text-6xl text-primary">🎮</div>
        <h1 className="text-4xl font-bold text-primary mb-2">FunWords</h1>
        <div className="text-lg text-gray-400">高考趣味背单词</div>
      </div>

      {/* 游戏说明 */}
      <div className="pixel-card max-w-md mx-auto text-left">
        <h2 className="text-lg font-bold text-primary mb-4">游戏规则</h2>
        <div className="space-y-2 text-sm">
          <div>• 每轮 10 道题目</div>
          <div>• 答对 +1 分，答错扣 1 分</div>
          <div>• 3 条生命，生命归零游戏结束</div>
          <div>• 连续答对 5 题获得额外生命</div>
          <div>• 每局 2 次提示机会</div>
        </div>
      </div>

      {/* 题型说明 */}
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        <div className="pixel-card text-center">
          <div className="text-2xl mb-2">📝</div>
          <div className="text-xs">选择题</div>
        </div>
        <div className="pixel-card text-center">
          <div className="text-2xl mb-2">✏️</div>
          <div className="text-xs">拼写题</div>
        </div>
        <div className="pixel-card text-center">
          <div className="text-2xl mb-2">🔊</div>
          <div className="text-xs">听音题</div>
        </div>
      </div>

      {/* 最高分 */}
      <div className="pixel-card max-w-md mx-auto">
        <div className="flex items-center justify-center gap-2">
          <span className="text-yellow-500">🏆</span>
          <span className="text-sm">最高分:</span>
          <span className="text-lg font-bold text-yellow-500">{highScore}</span>
        </div>
      </div>

      {/* 开始按钮 */}
      <button
        onClick={onStartGame}
        className="pixel-button text-lg px-8 py-4 flex items-center gap-2 mx-auto"
      >
        <Play size={20} />
        开始游戏
      </button>

      {/* 页脚 */}
      <div className="text-xs text-gray-600">
        魂斗罗像素风 | 轻量级离线学习工具
      </div>
    </div>
  );
};