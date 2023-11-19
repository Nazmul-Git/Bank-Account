const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const transactionContainer = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = (movements, sort=false) => { 
  transactionContainer.innerHTML = "";
  
  const movs=sort ? movements.slice().sort((a,b)=>a-b) : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov} $</div>
        </div>
      `;
    transactionContainer.insertAdjacentHTML("beforeend", html);
  });
};

// console.log(transactionContainer.innerHTML);

const printBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance} $`;
};


const displaySummery = (acc) => {
  // deposit
  const income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income} $`;

  // withdraw
  const withdraw = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(withdraw)} $`;

  // interest
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  // console.log(interest);
  labelSumInterest.textContent = `${interest} $`;
};


const createUsername = (acc) => {
  acc.forEach((ac) => {
    ac.username = ac.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsername(accounts);

// updateUI
const updateUI=(acc)=>{
  displayMovements(acc.movements);
  printBalance(acc);
  displaySummery(acc);
}

// login event
let currentAccount;
// console.log('current account=', currentAccount);
btnLogin.addEventListener("click", (e) => {
  // prevent form reload
  e.preventDefault();

  currentAccount= accounts.find((user) => user.username === inputLoginUsername.value);

  if(currentAccount?.pin === Number(inputLoginPin.value)){
    // console.log(currentAccount);
    labelWelcome.textContent=`Welcome back, ${currentAccount.owner.split(' ')[0]}`
  };
  containerApp.style.opacity=100;
  displayMovements(currentAccount.movements);
  printBalance(currentAccount);
  displaySummery(currentAccount);

  // clear login field
  inputLoginUsername.value=inputLoginPin.value='';
  inputLoginPin.blur();
  updateUI(currentAccount);
});


btnTransfer.addEventListener('click',(e)=>{
  e.preventDefault();
  const amount= Number(inputTransferAmount.value);
  const receiver=accounts.find(acc=>acc.username===inputTransferTo.value);
  // console.log(amount, receiver);
  inputTransferAmount.value=inputTransferTo.value='';

  if(amount > 0 && receiver && currentAccount.balance >= amount && receiver?.username !== currentAccount.username){
    // console.log('Transfer valid');
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);

    // update UI
    updateUI(currentAccount);
  }else{
    // console.log('Transfer not valid')
  }
});

btnLoan.addEventListener('click',(e)=>{
  e.preventDefault();
  const amount=Number(inputLoanAmount.value);
  if(amount > 0 && currentAccount.movements.some(mov=>mov >= amount * 0.1)){
    currentAccount.movements.push(amount);

    // update UI
    updateUI(currentAccount);
  }
})

btnClose.addEventListener('click', (e)=>{
  e.preventDefault();

  if(inputCloseUsername.value===currentAccount.username && Number(inputClosePin.value)===currentAccount.pin){
    const index=accounts.findIndex(acc=>acc.username===currentAccount.username);

    console.log(index);
    // indexOf(2) //use for get 2 index value

    // delete account
    accounts.splice(index,1);

    // hide UI
    containerApp.style.opacity=0;

  }

  inputCloseUsername.value=inputClosePin.value='';
})

// SORT
let sorted=false
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})











/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// RUN IN CONSOLE

// flat()
const accountMovement=accounts.map(acc=>acc.movements);
console.log(accountMovement);
const allMovement=accountMovement.flat();
console.log(allMovement);
const overallBalance=allMovement.reduce((acc, mov)=>acc+mov, 0);
console.log(overallBalance); //17840

//we can write short cut
const overallBalance2=accounts.map(acc=>acc.movements).flat().reduce((acc, mov)=>acc + mov, 0);
console.log(overallBalance2); //17840

// flatMap()
const overallBalance3= accounts.flatMap(acc=>acc.movements).reduce((acc, mov)=>acc + mov, 0);
console.log(overallBalance3); //17840

/////////////////////////////////////////////////
