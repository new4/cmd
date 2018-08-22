const fse = require('fs-extra');
const chalk = require('chalk');

const {
  log: {
    log,
  },
  underPath,
} = require('../../utils');

const MAP_LIST = [
  800000,
  800100,
  999010,
  200001,
  200002,
  200003,
  1000001,
  2399001,
  2399006,
];

function generateDateStr(monthLen = 12, mockStr) {

  const {
    curYear,
    curMonth,
    curDay,
    // curDate,
  } = getCurDate(mockStr);

  let startYear;
  let startMonth;
  const startDay = curDay;

  const delta1 = Math.floor(monthLen / 12); // 商
  const delta2 = monthLen % 12; // 余数

  if (delta2 < +curMonth) {
    // 同一年内
    startYear = +curYear - delta1;
    startMonth = +curMonth - delta2;
  } else {
    // 不是同一年内
    let month = +curMonth;
    let n = 0;

    while (month <= delta2) {
      n++;
      month += 12 * n;
    }
    startYear = +curYear - n - delta1;
    startMonth = +month - delta2;
  }

  startMonth = addonZero(startMonth);

  // const str1 = `${chalk.red(addonZero(delta1))} year ${chalk.red(addonZero(delta2))} month before`;
  // const str2 = `year: ${chalk.yellow(curYear)} => ${chalk.cyan(startYear)}`;
  // const str3 = `month: ${chalk.yellow(curMonth)} => ${chalk.cyan(startMonth)}`;
  // log(` ${str1} | ${str2} | ${str3} `);

  let result = [];

  for (let i = 0, len = curYear - startYear; i <= len; i++) {
    const startM = i === 0 ? startMonth : '01';
    const endM = i === len ? curMonth : '12';
    // log(`fillDateStrOneYear(${+startYear + i}, ${startM}, ${endM}, ${startDay}, ${i === 0}, ${i === len})`);
    result = result.concat(fillDateStrOneYear(+startYear + i, startM, endM, startDay, i === 0, i === len));
  }
  return result;
}

function fillDateStrOneYear(year, startMonth, endMonth, day, isFirstYear, isLastYear) {
  let result = [];
  const dayInMonth = getDayInMonth(year);
  const startMonthIndex = +startMonth - 1;
  const endMonthIndex = +endMonth - 1;
  const delta = endMonthIndex - startMonthIndex;

  for (let i = 0; i <= delta; i++) {
    const curMonth = +startMonth + i;
    const curMonthIndex = curMonth - 1;
    const startDay = i === 0 && isFirstYear ? day : '01'; // 开始的日期
    const endDay = i === delta && isLastYear ? day : dayInMonth[curMonthIndex]; // 结束的日期
    // log(`fillDateStrOneMonth(${year}, ${addonZero(curMonth)}, ${startDay}, ${endDay})`);
    result = result.concat(fillDateStrOneMonth(year, addonZero(curMonth), startDay, endDay));
  }
  return result;
}

function fillDateStrOneMonth(year, month, startDay, endDay) {
  const result = [];
  for (let i = +startDay; i <= +endDay; i++) {
    result.push(`${year}-${month}-${addonZero(i)}`);
    // log(`${year}-${month}-${addonZero(i)}`);
  }
  return result;
}

function getDayInMonth(year) {
  const limitInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const isLeap = new Date(year, 1, 29).getDate() === 29; // 是否是闰年
  // 若是闰年，2月的最大日期限制改为 29 天
  if (isLeap) {
    log(`${year} 年是闰年`);
    limitInMonth[1] = 29;
  }
  return limitInMonth;
}

function getCurDate(mockStr) {
  if (mockStr) {
    const arr = mockStr.split('-');
    return {
      curYear: `${arr[0]}`,
      curMonth: `${arr[1]}`,
      curDay: `${arr[2]}`,
      curDate: mockStr,
    };
  }

  const date = new Date();
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  month = addonZero(month);
  day = addonZero(day);
  return {
    curYear: `${year}`,
    curMonth: `${month}`,
    curDay: `${day}`,
    curDate: `${year}-${month}-${day}`,
  };
}

function addonZero(numStr) {
  return +numStr < 10 ? `0${numStr}` : `${numStr}`;
}

module.exports = function create(cmd) {
  fse.outputFile(
    underPath('cur', '_mock/temp.json'),
    `${JSON.stringify({
      code: 0,
      data: {
        0: generateDateStr(13, '2018-03-07'),
        [MAP_LIST[0]]: generateDateStr(13, '2018-03-07'),
        [MAP_LIST[1]]: generateDateStr(23, '2018-03-07'),
        [MAP_LIST[2]]: generateDateStr(23, '2018-03-07'),
      },
      message: '',
    }, null, 2)}`,
  );
};
