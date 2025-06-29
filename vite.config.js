import { resolve } from 'path';

export default {
  // config options

  base: '/frontend-quiz-app/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        questions: resolve(__dirname, 'questions.html'),
        score: resolve(__dirname, 'score.html'),
      },
    },
  },
};
