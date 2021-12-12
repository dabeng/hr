// I *THINK* this `areConsecutive` implementation is reliable across DST
// boundaries (http://jsfiddle.net/em8xqtc2/3/), but be sure to test...
const ONE_DAY_IN_MILLIS = 86400000;

function toDateUTC(str) {
  const [year, month, day] = str.split("-");
  return Date.UTC(+year, +month - 1, +day);
}

function areConsecutive(a, b) {
return toDateUTC(b) - toDateUTC(a) == ONE_DAY_IN_MILLIS;
}

function findConsecutive(array) {
  const result = [];
  let current = null;
  // Loop through building up each result, starting a new entry each
  // time we find a non-consecutive day
  for (const entry of array) {
      // If this is the first pass or this entry isn't consecutive with
      // the last, start a new entry
      if (!current || !areConsecutive(current.end, entry)) {
          result.push(current = {
            start: entry,
            end: entry
          });
      } else {
          // It's consecutive, just extend the last one
          current.end = entry;
      }
  }
  return result;
}

const DateService = {
  findConsecutive
};

export default DateService;