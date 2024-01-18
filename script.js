document.addEventListener("DOMContentLoaded", function () {
  const list = document.querySelector("#movie-list ul");
  const forms = document.forms;

  // Function to create a list item for a movie
  function createMovieListItem(movie) {
    const li = document.createElement("li");
    const movieName = document.createElement("span");
    const deleteBtn = document.createElement("span");
    const author = document.createElement("span");
    const date = document.createElement("span");

    // add text content
    movieName.textContent = movie.name;
    deleteBtn.textContent = "delete";
    author.textContent = movie.author;
    date.textContent = movie.year_of_release;
    // add classes
    movieName.classList.add("name");
    deleteBtn.classList.add("delete");
    author.classList.add("author");
    date.classList.add("date");
    // append to DOM
    li.appendChild(movieName);
    li.appendChild(deleteBtn);
    li.appendChild(author);
    li.appendChild(date);
    list.appendChild(li);
    // console.log(list.innerHTML);
  }

  // Check if local storage is empty
  const localStorageData = localStorage.getItem("moviesData");
  if (!localStorageData || localStorageData === "[]") {
    // Local storage is empty, fetch data and store in local storage
    fetch("./movies.json")
      .then((response) => response.json())
      .then((moviesData) => {
        // console.log(moviesData);

        // Store data in local storage
        localStorage.setItem("moviesData", JSON.stringify(moviesData));
        // console.log(localStorage.getItem("moviesData"));

        // Loop through the movies and create list items
        moviesData.forEach((movie) => {
          createMovieListItem(movie);
        });
      })
      .catch((error) => console.error("Error fetching JSON:", error));
  } else {
    // Local storage is not empty, retrieve data from local storage
    const parsedData = JSON.parse(localStorageData);

    // Loop through the stored movies and create list items
    parsedData.forEach((movie) => {
      createMovieListItem(movie);
    });
  }

  // delete movies
  list.addEventListener("click", (e) => {
    if (e.target.className == "delete") {
      const li = e.target.parentElement;
      li.parentNode.removeChild(li);
      updateLocalStorage(); // Update local storage after deletion
    }
  });

  // add movies
  const addForm = forms["add-movie"];
  addForm.addEventListener("submit", function (e) {
    e.preventDefault();
    validateYear();
    // create elements
    const value = addForm.querySelector('input[type="text"]').value;
    const li = document.createElement("li");
    const movieName = document.createElement("span");
    const deleteBtn = document.createElement("span");

    // add text content
    movieName.textContent = value;
    deleteBtn.textContent = "delete";
    // add classes
    movieName.classList.add("name");
    deleteBtn.classList.add("delete");
    // append to DOM
    li.appendChild(movieName);
    li.appendChild(deleteBtn);
    list.appendChild(li);
    // clear input
    addForm.querySelector('input[type="text"]').value = "";

    updateLocalStorage(); // Update local storage after addition
  });

  // Function to update local storage with the current movie list
  function updateLocalStorage() {
    const movieItems = Array.from(list.children);
    const moviesData = movieItems.map((item) => ({
      name: item.querySelector(".name").textContent,
    }));
    localStorage.setItem("moviesData", JSON.stringify(moviesData));
  }

  function validateYear() {
    const yearInput = document.getElementById("yearInput").value;
    const isValidYear = /^\d{4}$/.test(yearInput);

    if (isValidYear) {
      alert("Year is valid: " + yearInput);
      // You can perform further actions with the valid year here
    } else {
      alert("Invalid year. Please enter a valid 4-digit year.");
    }
  }
});
