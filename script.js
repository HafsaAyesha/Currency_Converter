const BASE_URL = "https://api.exchangerate-api.com/v4/latest/";

const dropdowns = document.querySelectorAll("select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amount = document.querySelector(".amount input");
const swapBtn = document.getElementById("swap");

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;

    // Set default values
    if ((select.name === "from" && currCode === "USD") || 
        (select.name === "to" && currCode === "PKR")) {
      option.selected = true;
    }

    select.appendChild(option);
  }

  select.addEventListener("change", (e) => updateFlag(e.target));
}

function updateFlag(element) {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  const img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

async function getExchangeRate() {
  let amtVal = amount.value;
  if (amtVal === "" || amtVal <= 0) {
    amtVal = 1;
    amount.value = 1;
  }

  const from = fromCurr.value;
  const to = toCurr.value;

  try {
    const response = await fetch(`${BASE_URL}${from}`);
    const data = await response.json();
    const rate = data.rates[to];

    if (!rate) {
      msg.innerText = `Exchange rate for ${to} not found.`;
      return;
    }

    const finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${from} = ${finalAmount} ${to}`;
  } catch (error) {
    // Fallback in case of API failure
    if (from === "USD" && to === "PKR") {
      const fallbackRate = 283.25;
      const finalAmount = (amtVal * fallbackRate).toFixed(2);
      msg.innerText = `${amtVal} USD = ${finalAmount} PKR (approx.)`;
    } else {
      msg.innerText = "Could not fetch exchange rate. Try again later.";
    }
  }
}

btn.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeRate();
});

swapBtn.addEventListener("click", () => {
  const temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;
  updateFlag(fromCurr);
  updateFlag(toCurr);
  getExchangeRate();
});

// Set default message manually first
window.addEventListener("load", () => {
  msg.innerText = "1 USD = 283.25 PKR";
  updateFlag(fromCurr);
  updateFlag(toCurr);
  getExchangeRate();
});
