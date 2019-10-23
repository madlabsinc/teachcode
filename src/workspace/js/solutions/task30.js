let counter = 0;

const startCounter = () => {
  counter++;
  process.stdout.write(`${counter} `);
};

const interval = setInterval(startCounter, 1000);

setTimeout(() => clearInterval(interval), 6000);
