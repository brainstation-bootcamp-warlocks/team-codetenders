/* 
  blue print of what we have to do
  * <div class="drink__container">
        <div class="drink__name-img">
        <h3 class="drink__subtitle">Drink Name</h3>
        <img class="drink__img" src="./assets/images/drink.jpg" alt="drink">
        </div>
        * <div class="drink__body-container">
          * <div class="drink__ingredient-container">
            * <p class="drink__ingredient">Ingredient One - <span class="drink__measurement">Amount</span></p>
            * <p class="drink__ingredient">Ingredient Two - <span class="drink__measurement">Amount</span></p>
            * <p class="drink__ingredient">Ingredient Three - <span class="drink__measurement">Amount</span></p>
            * <p class="drink__ingredient">Ingredient four - <span class="drink__measurement">Amount</span></p>
          * </div>
          * <div class="drink__instructions-container">
            * <h3 class="drink__instructions-title">Instructions</h3>
           *  <p class="drink__instructions-body">Drinks instructions to follow</p>
          * </div>
        * </div>
      * </div> 
*/
// Url
const url = 'https://www.thecocktaildb.com/api/json/v2/';
const key = '9973533';
// search by multiple ingredients
const urlFilter = '/filter.php?i=';
const ingredient = [];
// search by drink name
const cocktailInfo = '/search.php?s=margarita';

const displayDrinks = (drinksObject) => {
  const drinkContainer = document.createElement('div');
  drinkContainer.classList.add('drink__container');

  // create drink cards elements
  const drinkNameImg = document.createElement('div');
  drinkNameImg.classList.add('drink__name-img');

  // create drink name title
  const drinkSubtitle = document.createElement('h3');
  drinkSubtitle.classList.add('drink__subtitle');

  const drinkImg = document.createElement('img');
  drinkImg.classList.add('drink__img');
  drinkImg.setAttribute('src', '../assets/images/drink.jpg');
  drinkImg.setAttribute('alt', 'drink');

  // drink body container
  const drinkBodyContainer = document.createElement('div');
  drinkBodyContainer.classList.add('drink__body-container');
};

const getForm = document.getElementById('ingredients__form');

// read checks values to store them in array
getForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const getCheckbox = document.querySelectorAll('input[type="checkbox"]');

  if (ingredient !== '') {
    ingredient.splice(0, ingredient.length);
    for (let i = 0; i < getCheckbox.length; i++) {
      if (getCheckbox[i].checked === true) {
        ingredient.push(getCheckbox[i].value);
      }
    }
  }

  // prevent submit when checks are empty
  // if (!getForm.cocktails.checked) {

  // }

  // call api function
  fetchDrinks();
  // reset checks
  e.target.reset();
});

// get drinks by ingredients
const fetchDrinks = () => {
  const arrayToString = ingredient.join();
  const getDrinks = url + key + urlFilter + arrayToString;
  axios
    .get(getDrinks)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

// get drinks by Name
const drinksInfo = () => {
  const getDrinkByName = url + key + cocktailInfo;
  axios.get(getDrinkByName).then((response) => {
    console.log(response.data.drinks[0].strIngredient1);
  });
};

drinksInfo();
fetchDrinks();
