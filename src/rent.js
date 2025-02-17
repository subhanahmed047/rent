const rentForm = document.getElementById("rent-form");
const result = document.getElementById("result");
const resultTable = document.getElementById("result-table");
const numberOfPayments = 24;

// A function to calculate the next rental payment due dates
const calculateRent = async (startDate, rentAmount, rentFrequency) => {
  // A helper function to format a date as dd MMMM yyyy
  const formatDate = (date) => {
    // Create an array of month names
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

  // An array to store the results
  const results = [];

  // A variable to store the current date
  let currentDate = new Date(Number(startDate));

  // A variable to store the days to add based on the rent frequency
  let daysToAdd;

  // A switch statement to assign the daysToAdd value
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

  // A loop to calculate the next X rental payment due dates
  for (let i = 0; i < numberOfPayments; i++) {
    // If the current date is before the start date, set it to the start date
    if (currentDate < startDate) {
      currentDate = startDate;
    }

    // Push the current date and rent amount to the results array
    results.push({
      date: formatDate(currentDate),
      amount: rentAmount.toFixed(2),
    });

    // Add the daysToAdd value to the current date
    currentDate.setDate(currentDate.getDate() + daysToAdd);
  }

  // Return the results array
  return results;
};

// A function to display the results in a table
const displayResults = (results) => {
  // Clear the previous table body
  resultTable.querySelector("tbody").innerHTML = "";

  // Get the current date
  const currentDate = new Date();

  // Loop through the results array and create table rows and cells
  results.forEach((result, index) => {
    const row = document.createElement("tr");
    const idCell = document.createElement("td");
    const dateCell = document.createElement("td");
    const amountCell = document.createElement("td");
    const checkboxCell = document.createElement("td"); // New cell for the checkbox
    idCell.textContent = index + 1;
    dateCell.textContent = result.date;
    amountCell.textContent = `$${result.amount}`;
    idCell.classList.add("border", "p-2");
    dateCell.classList.add("border", "p-2");
    amountCell.classList.add("border", "p-2");

    // Check if the date has passed and add a green checkbox if it has
    if (new Date(result.date) < currentDate) {
      const checkbox = document.createElement("span");
      checkbox.textContent = "✅"; // Green checkbox
      checkbox.classList.add("text-green-500", "ml-2"); // Tailwind CSS classes for green text
      checkboxCell.appendChild(checkbox);
    }

    row.appendChild(idCell);
    row.appendChild(dateCell);
    row.appendChild(amountCell);
    row.appendChild(checkboxCell); // Append the new cell with the checkbox
    resultTable.querySelector("tbody").appendChild(row);
  });

  // Show the result div
  result.classList.remove("hidden");
};

// Add an event listener to the rent form submit event
rentForm.addEventListener("submit", async (event) => {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get the form data
  const formData = new FormData(rentForm);

  // Get the start date, rent amount and rent frequency values from the form data
  const startDate = new Date(formData.get("start-date"));
  const rentAmount = Number(formData.get("rent-amount"));
  const rentFrequency = formData.get("rent-frequency");

  // Validate the form data
  if (isNaN(startDate.getTime()) || isNaN(rentAmount) || !rentFrequency) {
    alert("Please enter valid data");
    return;
  }

  console.log("Calculating Rent for:", {
    startDate,
    rentAmount,
    rentFrequency,
  });

  // Call the calculateRent function and await for the results
  const results = await calculateRent(startDate, rentAmount, rentFrequency);

  // Call the displayResults function with the results
  displayResults(results);
});
