exports.handleExerciseRecognitionData = exerciseData => {
  const texts = exerciseData.map(({ data: { text } }) => text.replace('\n', ''));
  const [date, time, calories, distance] = texts;
  const [month, day] = date.split('/');
  const [hours, minutes, seconds] = time.split(':').map(i => parseInt(i, 10));

  return {
    date: new Date(new Date().getFullYear(), month - 1, day),
    duration: hours * 3600 + minutes * 60 + seconds,
    calories: parseFloat(calories.replace(/[^0-9]/g, '')),
    distance: parseFloat(distance.replace(/[^0-9]/g, '')),
  };
};
