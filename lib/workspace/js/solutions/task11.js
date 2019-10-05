let i = 1;
while (i <= 15) {
  if (i % 3 === 0) {
    i++;
    continue;
  } else if (i === 13) {
    break;
  } else {
    console.log(i);
  }
  i++;
}
