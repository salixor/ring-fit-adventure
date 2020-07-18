const { createWorker, createScheduler } = require('tesseract.js');

const file = './Ring-Fit-Adventure-week-3-exercise-log.jpg';
const rectangles = {
  date: { left: 440, top: 45, width: 100, height: 40 },
  dayOfWeek: { left: 545, top: 45, width: 135, height: 40 },
  time: { left: 450, top: 120, width: 190, height: 35 },
  calorie: { left: 670, top: 120, width: 190, height: 35 },
  distance: { left: 890, top: 120, width: 190, height: 35 },
};

const logger = m =>
  m.status === 'recognizing text'
    ? console.log(`${m.workerId}: ${(m.progress * 100).toFixed(0)}%`)
    : null;

const scheduler = createScheduler();
const workers = [createWorker({ logger })];

const chainAsyncExecutions = (array, f) =>
  array.reduce((prev, current) => prev.then(() => f(current)), Promise.resolve());

(async () => {
  await chainAsyncExecutions(workers, worker => worker.load());
  await chainAsyncExecutions(workers, worker => worker.loadLanguage('eng'));
  await chainAsyncExecutions(workers, worker => worker.initialize('eng'));
  workers.map(scheduler.addWorker);

  const results = Promise.all(
    Object.values(rectangles).map(rectangle => scheduler.addJob('recognize', file, { rectangle })),
  );
  console.log((await results).map(r => r.data.text));
  await scheduler.terminate();
})();
