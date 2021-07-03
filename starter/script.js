'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Elements

const mainEl = document.querySelector('.main');
const footerEl = document.querySelector('.footer');
const recordsContainer = document.querySelector('.section2__records-container');

const mainBalance = document.querySelector('.section1__header-mainBalance');

const depositeTotal = document.querySelector('.footer--information-in');

const withdrawlTotal = document.querySelector('.footer--information-out');

const interestTotal = document.querySelector('.footer--information-interest');

const btnLogin = document.querySelector('.btn--login');
const inputUsername = document.querySelector('.input--username');
const inputPassword = document.querySelector('.input--password');

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

// Add New Movement to the Records
const addNewMovement = function (movement) {
  recordsContainer.innerHTML = '';
  movement.forEach((element, i) => {
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
const calcDisplayBalance = function (movements) {
  const newBalance = movements.reduce((acumm, value) => acumm + value);
  mainBalance.innerHTML = `$${newBalance}`;
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

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  const username = inputUsername.value;
  const password = Number(inputPassword.value);

  const account =
    accounts.find(element => element.userName === username) &&
    accounts.find(element => element.pin === password);
  addNewMovement([]);
  if (account) {
    inputUsername.value = inputPassword.value = '';
    inputPassword.blur();
    mainEl.classList.remove('hide');
    footerEl.classList.remove('hide');
    headerUserName.innerHTML = `Welcome back, ${account.owner.split(' ')[0]}!`;
    addNewMovement(account.movements);
    calcDisplayBalance(account.movements);
    displaySummary(account);
  } else {
    mainEl.classList.add('hide');
    footerEl.classList.add('hide');
  }
  console.log(account);
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

/////////////////////////////////////////////////

const movements = [199, 450, -400, 3000, -650, -130, 70, 1300];

const account = accounts.find(element => element.owner === 'Peter Davis');
// console.log(account);
