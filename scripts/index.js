// Url
const url = 'https://www.thecocktaildb.com/api/json/v2/';
const key = '9973533';
// search by multiple ingredients
const urlFilter = '/filter.php?i=';
const ingredient = [];
// search by drink name

const cocktailInfo = '/search.php?s=';

const displayDrinks = (drinksObject) => {
  const drinkContainer = document.createElement('div');
  drinkContainer.classList.add('drink__container');

  // create drink title and img container
  const drinkNameImg = document.createElement('div');
  drinkNameImg.classList.add('drink__name-img');

  // create drink name title div
  const drinkSubtitle = document.createElement('h3');
  drinkSubtitle.classList.add('drink__subtitle');

  // create drink img div
  const drinkImg = document.createElement('img');
  drinkImg.classList.add('drink__img');
  drinkImg.setAttribute('src', drinksObject.strDrinkThumb);
  drinkImg.setAttribute('alt', 'drink');

  // drink card body elements container
  const drinkBodyContainer = document.createElement('div');
  drinkBodyContainer.classList.add('drink__body-container');

  // drinks ingredients and measurements title
  const ingredientsTitle = document.createElement('h3');
  ingredientsTitle.classList.add('drink__ingredients-title');
  ingredientsTitle.innerText = 'Ingredients and Measurements';

  drinkBodyContainer.append(ingredientsTitle);

  // create instructions container
  const drinkInstructionsContainer = document.createElement('div');
  drinkInstructionsContainer.classList.add('drink__instructions-container');

  // create instructions container title
  const drinkInstructionsTitle = document.createElement('h3');
  drinkInstructionsTitle.classList.add('drink__instructions-title');

  // create drink instructions
  const drinkInstructions = document.createElement('p');
  drinkInstructions.classList.add('drink__instructions-body');

  drinkInstructionsTitle.innerText = 'Instructions';
  drinkInstructions.innerText = drinksObject.strInstructions;

  drinkInstructionsContainer.append(drinkInstructionsTitle, drinkInstructions);

  for (let i = 1; i <= 15; i++) {
    const bodyCardContainer = document.createElement('p');
    bodyCardContainer.classList.add('drink__ingredient-container');

    if (
      drinksObject[`strIngredient${i}`] === null ||
      drinksObject[`strIngredient${i}`] === ''
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
  const drink = document.querySelector('.drink__cards');

  // create a drink card container
  const drinkContainer = document.createElement('div');
  drinkContainer.classList.add('drink__card-container');

  listOfDrinks.forEach((drinksArray) => {
    drinkContainer.append(displayDrinks(drinksArray));

    empty(drink);
    drink.append(drinkContainer);
  });
};

let emptySelector = document.querySelector('.drink');

let empty = (element) => {
  while (element.firstElementChild) {
    element.firstElementChild.remove();
  }
};

const getForm = document.getElementById('ingredients-form');

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
    .then(async (response) => {
      let dataDrinks = [];
      if (typeof response.data.drinks === 'string') {
        const errorMessage = document.querySelector('.drink__title');
        errorMessage.innerText = `You wouldn't want to try that poison!`;

        const removeEl = document.querySelector('.drink__card-container');
        removeEl.remove();
      } else {
        await response.data.drinks.reduce(async (previous, currentDrink) => {
          await previous;
          await axios
            .get(url + key + cocktailInfo + currentDrink.strDrink)
            .then((response) => {
              dataDrinks.push(response.data.drinks[0]);
              const normalTitle = document.querySelector('.drink__title');
              normalTitle.innerText = 'Your Drink';
            });
        }, Promise.resolve());
        renderDrinks(dataDrinks);
      }
    })
    .catch((error) => {
      console.log('Do not try that!!');
    });
};

const siteLogo = document.querySelector('.nav__logo');
siteLogo.innerText = '<code/>Tenders';

const defaultDrink = () => {
  const randomDrink = '/random.php';
  const randomDrinkUrl = url + key + randomDrink;
  axios.get(randomDrinkUrl).then((response) => {
    renderDrinks(response.data.drinks);
    const randomTitle = document.querySelector('.drink__title');
    randomTitle.innerText = 'Your Random Drink';
  });
};

defaultDrink();
