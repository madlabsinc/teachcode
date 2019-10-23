const numbers = [1, 3, 4, 6, 8, 9];

const filterValues = () => {
  return numbers.filter(number => {
    return number % 2 === 0;
  });
};

console.log(filterValues());
