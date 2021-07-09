'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Elements

const allInputs = document.querySelectorAll('input');
const mainEl = document.querySelector('.main');
const footerEl = document.querySelector('.footer');
const recordsContainer = document.querySelector('.section2__records-container');

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
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

//Global Variables
let account;
let sorted = false;

// Add New Movement to the Records
const addNewMovement = function (account, sort = false) {
  sorted = false;
  recordsContainer.innerHTML = '';

  const sortMovements = sort ? account.slice().sort((a, b) => a - b) : account;

  sortMovements.forEach((element, i) => {
    const type = element > 0 ? 'Deposit' : 'Withdrawl';
    const html = `<li>
  <div>
    <p class="section2__records-transactionNumber">${
      i + 1
    } <span class="movement__type movement__type-${type}">${type}</span></p>
    <p class="section2__records-transactionDate">02/22/2021</p>
  </div>

  <p class="section2__records-transactionAmount">$${element}</p>
</li>`;
    recordsContainer.insertAdjacentHTML('afterbegin', html);
  });
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
  mainBalance.innerHTML = `$${account.balance}`;
};

//Display total Deposite
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

  depositeTotal.innerHTML = `$${totalDeposites}`;
  withdrawlTotal.innerHTML = `-$${Math.abs(totalWithDrawls)}`;
  interestTotal.innerHTML = `$${totalInterest}`;
};

// Login Function

createUserName(accounts);

const refreshInformartion = function (account) {
  addNewMovement(account.movements, sorted);
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
  const receiver = inputTransferTo.value;
  const amount = Number(inputAmountTransfer.value);

  const personTo = accounts.find(element => element.userName == receiver);

  if (amount > 0 && personTo && personTo?.userName !== account.userName) {
    if (account.balance >= amount) {
      personTo.movements.push(amount);
      account.movements.push(-amount);
      account.balance -= amount;
      Swal.fire({
        icon: 'success',
        title: 'Yeiii...',
        text: 'Transfer successful!',
        footer: '<a href="">Why do I have this issue?</a>',
      });
      refreshInformartion(account);
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

  const amount = Number(inputLoanAmount.value);

  const canRequest = account.movements.some(element => element >= amount * 0.1);

  if (canRequest && amount > 0) {
    account.movements.push(amount);
    refreshInformartion(account);
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
  addNewMovement(account.movements, sorted);
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
