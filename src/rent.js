const rentForm = document.getElementById("rent-form");
const result = document.getElementById("result");
const resultTable = document.querySelector(".result-table tbody");
const formContainer = document.getElementById("form-container");
const editDetails = document.getElementById("edit-details");
const backArrow = document.getElementById("back-arrow");
const editText = document.getElementById("edit-text");

const numberOfPayments = 24;
const localStorageKey = "rentDetails";

// Helper function to get values from localStorage
const getStoredValues = () =>
  JSON.parse(localStorage.getItem(localStorageKey)) || null;

// Helper function to format date as dd MMMM yyyy
const formatDate = (date) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

// Calculate rent
const calculateRent = async (startDate, rentAmount, rentFrequency) => {
  let currentDate = new Date(startDate);
  let daysToAdd = 0;
  switch (rentFrequency) {
    case "weekly":
      daysToAdd = 7;
      break;
    case "fortnightly":
      daysToAdd = 14;
      break;
    case "four-weekly":
      daysToAdd = 28;
      break;
    default:
      daysToAdd = 0;
  }

  const results = [];
  for (let i = 0; i < numberOfPayments; i++) {
    results.push({
      date: formatDate(currentDate),
      amount: rentAmount.toFixed(2),
    });
    currentDate.setDate(currentDate.getDate() + daysToAdd);
  }
  return results;
};

// Display results in table
const displayResults = (results) => {
  resultTable.innerHTML = "";
  const currentDate = new Date();
  results.forEach((result, index) => {
    const row = document.createElement("tr");
    const idCell = document.createElement("td");
    const dateCell = document.createElement("td");
    const amountCell = document.createElement("td");
    const statusCell = document.createElement("td");

    idCell.textContent = index + 1;
    dateCell.textContent = result.date;
    amountCell.textContent = `$${result.amount}`;
    statusCell.innerHTML = new Date(result.date) < currentDate ? "✅" : "❌";

    [idCell, dateCell, amountCell, statusCell].forEach((cell) => {
      cell.classList.add("border", "p-2");
      row.appendChild(cell);
    });

    resultTable.appendChild(row);
  });

  result.classList.remove("hidden");
};

// Initialize form values
const loadFormValues = () => {
  const storedValues = getStoredValues();
  if (storedValues) {
    document.getElementById("start-date").value = storedValues.startDate;
    document.getElementById("weekly-rent").value = storedValues.rentAmount;
    document.getElementById("rent-frequency").value =
      storedValues.rentFrequency;

    calculateRent(
      new Date(storedValues.startDate),
      storedValues.rentAmount,
      storedValues.rentFrequency
    ).then(displayResults);

    formContainer.classList.add("hidden");
    editDetails.classList.remove("hidden");
  }
};

// Store form values in localStorage
const storeFormValues = (startDate, rentAmount, rentFrequency) => {
  localStorage.setItem(
    localStorageKey,
    JSON.stringify({ startDate, rentAmount, rentFrequency })
  );
};

// Event listeners
backArrow.addEventListener("click", () => {
  formContainer.classList.remove("hidden");
  editDetails.classList.add("hidden");
  result.classList.add("hidden");
});

editText.addEventListener("click", () => {
  formContainer.classList.remove("hidden");
  editDetails.classList.add("hidden");
  result.classList.add("hidden");
});

rentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(rentForm);
  const startDate = formData.get("start-date");
  const rentAmount = Number(formData.get("weekly-rent"));
  const rentFrequency = formData.get("rent-frequency");

  storeFormValues(startDate, rentAmount, rentFrequency);
  calculateRent(new Date(startDate), rentAmount, rentFrequency).then(
    displayResults
  );

  formContainer.classList.add("hidden");
  editDetails.classList.remove("hidden");
});

window.addEventListener("load", loadFormValues);
