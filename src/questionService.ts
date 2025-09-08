import type { Word, Question, QuestionType } from './types';
import { dbService } from './database';

export class QuestionService {
  private readonly QUESTION_COUNT = 10;

  async generateQuestions(): Promise<Question[]> {
    const words = await dbService.getRandomWords(this.QUESTION_COUNT);
    const allWords = await dbService.getRandomWords(100); // 获取更多单词用于选项
    
    return words.map((word) => {
      const questionType = this.getRandomQuestionType();
      return this.createQuestion(word, questionType, allWords);
    });
  }

  private getRandomQuestionType(): QuestionType {
    const types: QuestionType[] = ['choice', 'spelling', 'audio'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private createQuestion(word: Word, type: QuestionType, allWords: Word[]): Question {
    switch (type) {
      case 'choice':
        return this.createChoiceQuestion(word, allWords);
      case 'spelling':
        return this.createSpellingQuestion(word);
      case 'audio':
        return this.createAudioQuestion(word, allWords);
      default:
        throw new Error(`Unknown question type: ${type}`);
    }
  }

  private createChoiceQuestion(word: Word, allWords: Word[]): Question {
    const correctAnswer = word.meaning;
    const wrongOptions = allWords
      .filter(w => w.id !== word.id)
      .map(w => w.meaning)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const options = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);

    return {
      id: word.id,
      type: 'choice',
      word,
      options,
      correctAnswer
    };
  }

  private createSpellingQuestion(word: Word): Question {
    return {
      id: word.id,
      type: 'spelling',
      word,
      options: [],
      correctAnswer: word.headword.toLowerCase()
    };
  }

  private createAudioQuestion(word: Word, allWords: Word[]): Question {
    const correctAnswer = word.headword;
    const wrongOptions = allWords
      .filter(w => w.id !== word.id)
      .map(w => w.headword)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const options = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);

    return {
      id: word.id,
      type: 'audio',
      word,
      options,
      correctAnswer
    };
  }

  checkAnswer(question: Question, userAnswer: string): boolean {
    if (question.type === 'spelling') {
      return userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase();
    }
    return userAnswer === question.correctAnswer;
  }

  getHint(question: Question): string {
    switch (question.type) {
      case 'choice':
        return '提示：仔细看看每个选项的意思';
      case 'spelling': {
        const word = question.word.headword;
        return `提示：首字母是 "${word[0].toUpperCase()}"，共 ${word.length} 个字母`;
      }
      case 'audio':
        return '提示：听清楚发音，注意相似音的单词';
      default:
        return '提示：仔细思考一下';
    }
  }
}

export const questionService = new QuestionService();