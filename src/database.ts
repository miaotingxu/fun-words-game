import type { Word, Progress, Meta } from './types';

class DatabaseService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'FunWordsDB';
  private readonly VERSION = 1;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 创建 words 表
        if (!db.objectStoreNames.contains('words')) {
          const wordsStore = db.createObjectStore('words', { keyPath: 'id' });
          wordsStore.createIndex('headword', 'headword', { unique: true });
        }

        // 创建 progress 表
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'wordId' });
        }

        // 创建 meta 表
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', { keyPath: 'id' });
        }
      };
    });
  }

  async addWords(words: Word[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['words'], 'readwrite');
      const store = transaction.objectStore('words');

      words.forEach(word => {
        store.add(word);
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getRandomWords(count: number): Promise<Word[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['words'], 'readonly');
      const store = transaction.objectStore('words');
      const request = store.getAll();

      request.onsuccess = () => {
        const allWords = request.result;
        const shuffled = [...allWords].sort(() => Math.random() - 0.5);
        resolve(shuffled.slice(0, count));
      };

      request.onerror = () => reject(request.error);
    });
  }

  async getWord(id: number): Promise<Word | null> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['words'], 'readonly');
      const store = transaction.objectStore('words');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async updateProgress(wordId: number, isCorrect: boolean): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['progress'], 'readwrite');
      const store = transaction.objectStore('progress');
      
      const getRequest = store.get(wordId);
      getRequest.onsuccess = () => {
        const existing = getRequest.result as Progress | undefined;
        const progress: Progress = existing || {
          wordId,
          correct: 0,
          wrong: 0
        };

        if (isCorrect) {
          progress.correct++;
        } else {
          progress.wrong++;
        }

        const putRequest = store.put(progress);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async getHighScore(): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['meta'], 'readonly');
      const store = transaction.objectStore('meta');
      const request = store.get(1);

      request.onsuccess = () => {
        const meta = request.result as Meta | undefined;
        resolve(meta?.highScore || 0);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async updateHighScore(score: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['meta'], 'readwrite');
      const store = transaction.objectStore('meta');
      
      const meta: Meta & { id: number } = {
        id: 1,
        highScore: score
      };

      const request = store.put(meta);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async isWordsEmpty(): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['words'], 'readonly');
      const store = transaction.objectStore('words');
      const request = store.count();

      request.onsuccess = () => resolve(request.result === 0);
      request.onerror = () => reject(request.error);
    });
  }
}

export const dbService = new DatabaseService();