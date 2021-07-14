'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Elements

const allInputs = document.querySelectorAll('input');
const mainEl = document.querySelector('.main');
const footerEl = document.querySelector('.footer');
const footerTimer = document.querySelector('.footer--logout-timer');

const dateEl = document.querySelector('.section1__header-text-date');

const recordsContainer = document.querySelector('.section2__records-container');
const movRows = document.querySelectorAll('.section2__records-row');

const mainBalance = document.querySelector('.section1__header-mainBalance');

const depositeTotal = document.querySelector('.footer--information-in');

const withdrawlTotal = document.querySelector('.footer--information-out');

const interestTotal = document.querySelector('.footer--information-interest');

// BTN and Inputs
const btnLogin = document.querySelector('.btn--login');
const inputUsername = document.querySelector('.input--username');
const inputPassword = document.querySelector('.input--password');

const btnTransfer = document.querySelector('.btn--transfer');
const inputTransferTo = document.querySelector('#input__transfer-to');
const inputAmountTransfer = document.querySelector('#input__transfer-amount');

const btnLoan = document.querySelector('.btn--loan');
const inputLoanAmount = document.querySelector('#input__transfer-amount2');

const btnClose = document.querySelector('.btn--close');
const closeUser = document.querySelector('#input__confirmUser');
const closePin = document.querySelector('#input__confirmPin');

const btnSort = document.querySelector('.footer--information-p-s');
const headerUserName = document.querySelector('.header--username');

// Data
const account1 = {
  owner: 'Esteban Hidalgo',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300, 4000, -30],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
    '2021-07-10T12:01:20.894Z',
    '2021-07-11T06:00:00.000Z',
  ],
  currency: 'USD',
  locale: 'en-US', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'de-DE',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

//Global Variables
let account, timer;
let sorted = false;

const todayDate = function (account) {
  const today = new Date();

  const options = {
    //options are: numeric, long, 2-digit, narrow, short
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    // weekday: 'long',
  };

  const userFormat = new Intl.DateTimeFormat(account.locale, options).format(
    today
  ); //Monday, July 12, 2021, 7:43 PM
  dateEl.innerHTML = `As of ${userFormat}`;
};

//Timer
const timerBackwards = function () {
  let time = 300; //amount of seconds that we want run the timer 120 -> 2min

  const tick = function () {
    // we need to create a tick function to call it inmediately otherwise the timer will start 1 sec later after the login
    let minutes = `${Math.trunc(time / 60)}`.padStart(0, 2);
    let seconds = `${time % 60}`.padStart(2, 0);
    if (time === 0) {
      footerTimer.innerHTML = `${minutes}:${seconds}`;
      mainEl.classList.add('hide');
      footerEl.classList.add('hide');
      account = '';
      clearInterval(timer);
    } else {
      console.log(time);
      footerTimer.innerHTML = `${minutes}:${seconds}`;
      time--;
    }
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const intlMoney = function (locale, currency, number) {
  const options = {
    style: 'currency',
    currency: currency,
  };

  const num = new Intl.NumberFormat(locale, options).format(number);
  return num;
};

//Calculate days between 2 dates
const dayDiference = (date1, locale) => {
  // const year = date1.getFullYear();
  // const month = `${date1.getMonth() + 1}`.padStart(2, 0);
  // const day = `${date1.getDate()}`.padStart(2, 0);
  const d = Math.floor(Math.abs(new Date() - date1) / (1000 * 60 * 60 * 24));
  if (d === 0) {
    console.log(d);
    return `Today`;
  } else if (d == 1) {
    console.log(d);
    return `Yesterday`;
  } else if (d > 1 && d <= 3) {
    console.log(d);
    return `${d} days ago`;
  } else {
    console.log(d);
    return new Intl.DateTimeFormat(locale).format(date1);
  }
};

// Add New Movement to the Records
const addNewMovement = function (account, sort = false) {
  recordsContainer.innerHTML = '';

  const sortMovements = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  sortMovements.forEach((element, i) => {
    const nDate = new Date(account.movementsDates[i]);
    const type = element > 0 ? 'Deposit' : 'Withdrawl';

    const html = `<li class="section2__records-row">
  <div>
    <p class="section2__records-transactionNumber">${
      i + 1
    } <span class="movement__type movement__type-${type}">${type}</span></p>
    <p class="section2__records-transactionDate">${dayDiference(
      nDate,
      account.locale
    )}</p>
  </div>

  <p class="section2__records-transactionAmount">${intlMoney(
    account.local,
    account.currency,
    element
  )}</p>
</li>`;
    recordsContainer.insertAdjacentHTML('afterbegin', html);
  });
  colorMovements();
};

// Color even movements
const colorMovements = function () {
  [...document.querySelectorAll('.section2__records-row')].forEach(
    (element, i) => {
      if (i % 2 === 0) {
        element.style.backgroundColor = '#dfe6e9';
      }
    }
  );
};

// Create Usernames
const createUserName = accs => {
  accs.forEach(element => {
    element.userName = element.owner
      .toLowerCase()
      .split(' ')
      .map(element => element.slice(0, 1))
      .join('');
  });
};

// Display Total Balanace
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acumm, value) => acumm + value);
  mainBalance.innerHTML = `${intlMoney(
    account.locale,
    account.currency,
    account.balance
  )}`;
};

//Display total Summary
const displaySummary = function (account) {
  const totalDeposites = account.movements
    .filter(element => element > 0)
    .reduce((acumm, value) => acumm + value);

  const totalWithDrawls = account.movements
    .filter(element => element < 0)
    .reduce((acumm, value) => acumm + value, 0);

  const totalInterest = account.movements
    .filter(element => element > 0)
    .map(element => (element * account.interestRate) / 100)
    .filter(element => element >= 1)
    .reduce((accu, value, i, arr) => accu + value, 0);

  depositeTotal.innerHTML = `${intlMoney(
    account.locale,
    account.currency,
    totalDeposites
  )}`;
  withdrawlTotal.innerHTML = `${intlMoney(
    account.locale,
    account.currency,
    totalWithDrawls
  )}`;
  interestTotal.innerHTML = `${intlMoney(
    account.locale,
    account.currency,
    totalInterest
  )}`;
};

// Login Function

createUserName(accounts);

const refreshInformartion = function (account) {
  addNewMovement(account, sorted);
  calcDisplayBalance(account);
  displaySummary(account);
};

const hideInformation = function () {
  mainEl.classList.add('hide');
  footerEl.classList.add('hide');
  headerUserName.innerHTML = `Log in to get started`;
};
//BTN LOGIN
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  const username = inputUsername.value;
  const password = Number(inputPassword.value);

  account =
    accounts.find(element => element.userName === username) &&
    accounts.find(element => element.pin === password);
  if (account) {
    inputUsername.value = inputPassword.value = '';
    inputPassword.blur();
    mainEl.classList.remove('hide');
    footerEl.classList.remove('hide');
    headerUserName.innerHTML = `Welcome back, ${account.owner.split(' ')[0]}!`;
    allInputs.forEach(element => (element.value = ''));
    todayDate(account);

    if (timer) clearTimeout(timer);
    timer = timerBackwards();

    todayDate(account);
    refreshInformartion(account);
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Wrong account username',
      text: 'Please check the username or password entered',
    });
    hideInformation();
  }
});

// Transfer transaction
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  if (timer) clearInterval(timer);
  timer = timerBackwards();
  const receiver = inputTransferTo.value;
  const amount = Number(inputAmountTransfer.value);

  const personTo = accounts.find(element => element.userName == receiver);

  if (amount > 0 && personTo && personTo?.userName !== account.userName) {
    if (account.balance >= amount) {
      personTo.movements.push(amount);
      personTo.movementsDates.push(new Date().toISOString());
      account.movements.push(-amount);
      account.movementsDates.push(new Date().toISOString());
      account.balance -= amount;
      Swal.fire({
        icon: 'success',
        title: 'Yeiii...',
        text: 'Transfer successful!',
        footer: '<a href="">Why do I have this issue?</a>',
      });
      refreshInformartion(account);
      if (timer) clearInterval(timer);
      timer = timerBackwards();
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Not enough credits',
        footer: '<a href="">Why do I have this issue?</a>',
      });
    }
  } else {
    console.log(`Incorrect Username or amount inserted`);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Username or amount incorrect',
      footer: '<a href="">Why do I have this issue?</a>',
    });
  }
  inputUsername.value = inputPassword.value = '';
});

//BTN CLOSE
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const username = closeUser.value;
  const pin = Number(closePin.value);

  if (username === account.userName && pin === account.pin) {
    console.log(username);
    const userIndex = accounts.findIndex(u => u.userName === username);
    if (
      confirm(
        'You are about to permantely delete your account. Are you sure you want to continue?'
      )
    ) {
      accounts.splice(userIndex, 1);
      hideInformation();
    } else {
    }
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Wrong account username',
      text: 'Please check the username or password entered',
    });
  }
});

//BTN LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  if (timer) clearInterval(timer);
  timer = timerBackwards();

  const amount = Math.floor(inputLoanAmount.value);

  const canRequest = account.movements.some(element => element >= amount * 0.1);

  if (canRequest && amount > 0) {
    setTimeout(() => {
      account.movements.push(amount);
      account.movementsDates.push(new Date().toISOString());
      refreshInformartion(account);
    }, 3000);
    Swal.fire({
      icon: 'success',
      title: 'Yeiii...',
      text: 'Loan successful approved! You should be able to see it in your account soon',
      footer: '<a href="">Why do I have this issue?</a>',
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Not possible',
      text: `Sorry with your current history we can't loan you this quantity of money`,
    });
  }
});

// SORT ARRAYS
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sorted = sorted ? (sorted = false) : (sorted = true);
  addNewMovement(account, sorted);
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//random values between max and min numbers

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

//setImeInterval
