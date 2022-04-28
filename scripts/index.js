/* 
  blue print of what we have to do
  * <div class="drink__container">
        <div class="drink__name-img">
        <h3 class="drink__subtitle">Drink Name</h3>
        <img class="drink__img" src="./assets/images/drink.jpg" alt="drink">
        </div>
        <div class="drink__body-container">
          <div class="drink__ingredient-container">
            <p class="drink__ingredient">Ingredient One - <span class="drink__measurement">Amount</span></p>
            <p class="drink__ingredient">Ingredient Two - <span class="drink__measurement">Amount</span></p>
            <p class="drink__ingredient">Ingredient Three - <span class="drink__measurement">Amount</span></p>
            <p class="drink__ingredient">Ingredient four - <span class="drink__measurement">Amount</span></p>
          </div>
          * <div class="drink__instructions-container">
            * <h3 class="drink__instructions-title">Instructions</h3>
           *  <p class="drink__instructions-body">Drinks instructions to follow</p>
          * </div>
        * </div>
      * </div> 
*/
// Url
const url = "https://www.thecocktaildb.com/api/json/v2/";
const key = "9973533";
// search by multiple ingredients
const urlFilter = "/filter.php?i=";
const ingredient = [];
// search by drink name

const cocktailInfo = "/search.php?s=";
let drinkName;

const displayDrinks = (drinksObject) => {
  console.log(drinksObject);
  const drinkContainer = document.createElement("div");
  drinkContainer.classList.add("drink__container");

  // create drink title and img container
  const drinkNameImg = document.createElement("div");
  drinkNameImg.classList.add("drink__name-img");

  // create drink name title div
  const drinkSubtitle = document.createElement("h3");
  drinkSubtitle.classList.add("drink__subtitle");

  // create drink img div
  const drinkImg = document.createElement("img");
  drinkImg.classList.add("drink__img");
  drinkImg.setAttribute("src", drinksObject.strDrinkThumb);
  drinkImg.setAttribute("alt", "drink");

  // drink card body elements container
  const drinkBodyContainer = document.createElement("div");
  drinkBodyContainer.classList.add("drink__body-container");

  // drinks ingredients and measurements title
  const ingredientsTitle = document.createElement("h3");
  ingredientsTitle.classList.add("drink__ingredients-title");
  ingredientsTitle.innerText = "Ingredients and Measurements";

  drinkBodyContainer.append(ingredientsTitle);

  /* * <div class="drink__instructions-container">
   * <h3 class="drink__instructions-title">Instructions</h3>
   *  <p class="drink__instructions-body">Drinks instructions to follow</p>
   * </div> */

  // create instructions container
  const drinkInstructionsContainer = document.createElement("div");
  drinkInstructionsContainer.classList.add("drink__instructions-container");

  // create instructions container title
  const drinkInstructionsTitle = document.createElement("h3");
  drinkInstructionsTitle.classList.add("drink__instructions-title");

  // create drink instructions
  const drinkInstructions = document.createElement("p");
  drinkInstructions.classList.add("drink__instructions-body");

  drinkInstructionsTitle.innerText = "Instructions";
  drinkInstructions.innerText = drinksObject.strInstructions;

  drinkInstructionsContainer.append(drinkInstructionsTitle, drinkInstructions);

  for (let i = 1; i <= 15; i++) {
    const bodyCardContainer = document.createElement("div");
    bodyCardContainer.classList.add("drink__ingredient-container");

    if (
      drinksObject[`strIngredient${i}`] === null ||
      drinksObject[`strIngredient${i}`] === ""
    ) {
      break;
    }

    bodyCardContainer.innerText =
      drinksObject[`strIngredient${i}`] +
      ` - ` +
      drinksObject[`strMeasure${i}`];

    drinkBodyContainer.append(bodyCardContainer, drinkInstructionsContainer);
  }

  drinkSubtitle.innerText = drinksObject.strDrink;

  drinkNameImg.append(drinkSubtitle, drinkImg);
  drinkContainer.append(drinkNameImg, drinkBodyContainer);

  return drinkContainer;
};

const renderDrinks = (listOfDrinks) => {
  // select class to append drinks
  const drink = document.querySelector(".drink__cards");

  // create a drink card container
  const drinkContainer = document.createElement("div");
  drinkContainer.classList.add("drink__card-container");

  listOfDrinks.forEach((drinksArray) => {
    drinkContainer.append(displayDrinks(drinksArray));

    empty(drink);
    drink.append(drinkContainer);
  });
};

let emptySelector = document.querySelector(".drink");

let empty = (element) => {
  while (element.firstElementChild) {
    element.firstElementChild.remove();
  }
};

const getForm = document.getElementById("ingredients-form");

// read checks values to store them in array
getForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const getCheckbox = document.querySelectorAll('input[type="checkbox"]');

  if (ingredient !== "") {
    ingredient.splice(0, ingredient.length);
    for (let i = 0; i < getCheckbox.length; i++) {
      if (getCheckbox[i].checked === true) {
        ingredient.push(getCheckbox[i].value);
      }
    }
  }

  // call api function
  fetchDrinks();
  // reset checks
  e.target.reset();
  // // prevent submit when checks are empty
  // if (!getForm.cocktails.checked) {
  //   return false;
  // }
});

// get drinks by ingredients
const fetchDrinks = () => {
  const arrayToString = ingredient.join();
  const getDrinks = url + key + urlFilter + arrayToString;
  /* if (test something){
     add class with the spinner using css 
  } */
  axios
    .get(getDrinks)
    .then(async (response) => {
      let dataDrinks = [];

      await response.data.drinks.reduce(async (previous, currentDrink) => {
        await previous;
        await axios
          .get(url + key + cocktailInfo + currentDrink.strDrink)
          .then((response) => dataDrinks.push(response.data.drinks[0]));
      }, Promise.resolve());
      renderDrinks(dataDrinks);
    })
    .catch((error) => {
      console.log("Do not try that!!");
    });
};

const siteLogo = document.querySelector(".nav__logo");
siteLogo.innerText = "<code/>Tenders";
