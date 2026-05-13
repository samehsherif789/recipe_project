const model = document.getElementById("model");
const exampleModalLabel = document.getElementById("exampleModalLabel");
const links = document.querySelectorAll(".nav-link");
const input1 = document.getElementById("input1");
const searchWords = document.getElementById("searchWords");
const error = document.getElementById("error");
const rowData = document.getElementById("data").querySelector(".row");
const food = [
  "carrot",
  "broccoli",
  "asparagus",
  "cauliflower",
  "corn",
  "cucumber",
  "green pepper",
  "lettuce",
  "mushrooms",
  "onion",
  "potato",
  "pumpkin",
  "red pepper",
  "tomato",
  "beetroot",
  "brussel sprouts",
  "peas",
  "zucchini",
  "radish",
  "sweet potato",
  "artichoke",
  "leek",
  "cabbage",
  "celery",
  "chili",
  "garlic",
  "basil",
  "coriander",
  "parsley",
  "dill",
  "rosemary",
  "oregano",
  "cinnamon",
  "saffron",
  "green bean",
  "bean",
  "chickpea",
  "lentil",
  "apple",
  "apricot",
  "avocado",
  "banana",
  "blackberry",
  "blackcurrant",
  "blueberry",
  "boysenberry",
  "cherry",
  "coconut",
  "fig",
  "grape",
  "grapefruit",
  "kiwifruit",
  "lemon",
  "lime",
  "lychee",
  "mandarin",
  "mango",
  "melon",
  "nectarine",
  "orange",
  "papaya",
  "passion fruit",
  "peach",
  "pear",
  "pineapple",
  "plum",
  "pomegranate",
  "quince",
  "raspberry",
  "strawberry",
  "watermelon",
  "salad",
  "pizza",
  "pasta",
  "popcorn",
  "lobster",
  "steak",
  "bbq",
  "pudding",
  "hamburger",
  "pie",
  "cake",
  "sausage",
  "tacos",
  "kebab",
  "poutine",
  "seafood",
  "chips",
  "fries",
  "masala",
  "paella",
  "som tam",
  "chicken",
  "toast",
  "marzipan",
  "tofu",
  "ketchup",
  "hummus",
  "chili",
  "maple syrup",
  "parma ham",
  "fajitas",
  "champ",
  "lasagna",
  "poke",
  "chocolate",
  "croissant",
  "arepas",
  "bunny chow",
  "pierogi",
  "donuts",
  "rendang",
  "sushi",
  "ice cream",
  "duck",
  "curry",
  "beef",
  "goat",
  "lamb",
  "turkey",
  "pork",
  "fish",
  "crab",
  "bacon",
  "ham",
  "pepperoni",
  "salami",
  "ribs"
];

let allRecipes = [];
let singleRecipe;

async function getAllRecipes(food) {
  try {
    const response = await fetch(`https://forkify-api.herokuapp.com/api/search?q=${food}`);
    const data = await response.json();
    console.log(data)
    if (data.recipes && data.recipes.length > 0) {
      allRecipes = data.recipes;
      displayAllRecipes();
    } else {
      rowData.innerHTML = `<p class="text-center text-danger fs-5 mt-4">No recipes found for "${food}".</p>`;
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
    rowData.innerHTML = `<p class="text-center text-danger fs-5 mt-4">Failed to load recipes. Please try again later.</p>`;
  }
}

function displayAllRecipes() {
  let data = '';
  allRecipes.forEach(recipe => {
    data += `
      <div class="col-lg-4 col-md-6">
        <div class="card">
          <img src="${recipe.image_url}" alt="${recipe.title}" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="getSingleRecipe(${recipe.recipe_id})" />
          <div class="card-body">
            <h5 class="card-title text-truncate">${recipe.title}</h5>
            <p class="card-text text-muted mb-0">${recipe.publisher}</p>
          </div>
        </div>
      </div>
    `;
  });
  rowData.innerHTML = data;
}

// Load default recipes
window.addEventListener('DOMContentLoaded', () => {
  getAllRecipes('pizza');
});

// Event Listeners
links.forEach(link => {
  link.addEventListener('click', (e) => {
    getAllRecipes(e.target.innerHTML)
  });
});


async function getSingleRecipe(id) {
  try {
    let response = await fetch(`https://forkify-api.herokuapp.com/api/get?rId=${id}`)
    let data = await response.json()
    // console.log(data)
    if (data.recipe) {
      singleRecipe = data.recipe
      console.log(singleRecipe)
      displaySingleRecipe()
    }
    else {
      rowData.innerHTML = `<p class="text-center text-danger fs-5 mt-4">No recipes found for "${food}".</p>`;
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
    rowData.innerHTML = `<p class="text-center text-danger fs-5 mt-4">Failed to load recipes. Please try again later.</p>`;
  }
}

function displaySingleRecipe() {
  exampleModalLabel.innerHTML = singleRecipe.title

  let ingingredientsList = ''
  for (let i = 0; i < singleRecipe.ingredients.length; i++) {
    ingingredientsList += `
               <li>${singleRecipe.ingredients[i]}</li>
         `
  }
  model.innerHTML = `
           <img src='${singleRecipe.image_url}' class="w-100">
           <h2>ingredients</h2>
           <ul>
             ${ingingredientsList}
           </ul>
      `
}


function search(word) {
  let data = ''
  for (let i = 0; i < food.length; i++) {
    if (food[i].toLowerCase().includes(word.toLowerCase())) {
      data += `
           <li onclick="getAllRecipes('${food[i]}')">${food[i].replace(word, `<span class="span">${word}</span>`)} </li>
          `
    }
  }
  searchWords.innerHTML = data
  if (data.length == 0) {
    error.classList.remove('d-none')
  }
  else {
    error.classList.add('d-none')
    searchWords.classList.remove('d-none')
  }
}
input1.addEventListener('keyup', function () {
  search(input1.value)
})
links.forEach(link => {
  link.addEventListener('click', (e) => {

    // 🔥 remove active from all links
    links.forEach(l => l.classList.remove("active"));

    // 🔥 add active to clicked link
    e.target.classList.add("active");

    // 🔥 get recipes
    getAllRecipes(e.target.innerHTML);
  });
});