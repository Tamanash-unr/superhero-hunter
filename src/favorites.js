// Required Keys for Marvel API
const publicKey = "ef9e39e3401de00c55adb173e95906fa";
const privateKey = "952a243d80cec8fef46bff4fcfa91e9a55e5f792";

// HTML element for the Hero List
const heroList = document.getElementById('superhero-list');

// Timestamp
let ts = new Date().getTime();

let favorites = [];
let heroes = [];

/*---- Fetch Favorited Heroes ID from Browser Session Storage and call Marvel-API to retrieve character detail then call renderHeroList() to show all the retrieved heroes ----*/
function fetchFavourites() {
    favorites = JSON.parse(sessionStorage.getItem("favorite-heroes"));
    if (favorites == "" || favorites == null) {
        favorites = [];
    }

    try {
        if (favorites.length > 0) {
            console.log(favorites);

            favorites.forEach(async element => {
                const response = await fetch(`https://gateway.marvel.com:443/v1/public/characters/${element}?ts=${ts}&apikey=ef9e39e3401de00c55adb173e95906fa&hash=${CryptoJS.MD5(ts.toString() + privateKey + publicKey)}`);
                const data = await response.json();
                heroes.push(data.data.results[0]);
            });

            renderHeroList();
        } else {
            renderHeroList();
        }
    } catch (error) {
        console.log("Error Occured:", error);
    }
}

/*---- Remove Hero from favorited list - takes the Hero ID as input, filters it from the list then saves the filtered list in Session Storage and recalls fetchFavourites() to render the page again ----*/
function removeFromFavorites(heroID) {
    let filteredFavs = favorites.filter(function (id) {
        return id != heroID.toString();
    })

    favorites = filteredFavs;
    sessionStorage.setItem("favorite-heroes", JSON.stringify(favorites));
    localStorage.setItem("favorite-heroes", JSON.stringify(favorites));

    heroes = [];
    fetchFavourites();
}

/*---- Creates the HTML element for every Hero in Heroes array and appends it to the heroList ----*/
function addHeroToList(hero) {
    const heroDiv = document.createElement('div');
    let favBtn = "";

    if (favorites.includes(hero.id.toString()) == false) {
        favBtn = `<div class="text-body-secondary">
                    <button id="favorite" class="btn btn-outline-secondary" data-id=${hero.id}>
                        <i class="fas fa-heart"></i>
                        Favorite
                    </button>
                </div>`
    } else {
        favBtn = `<div class="text-body-secondary" data-id=${hero.id}>
                    <button id="unfavorite" class="btn btn-outline-secondary" data-id=${hero.id}>
                        <i class="fas fa-heart-circle-xmark"></i>
                        Remove From Favorites
                    </button>
                </div>`
    }

    heroDiv.innerHTML = `
        <div class="card shadow-sm">
            <img class="bd-placeholder-img card-img-top" width="auto" height="350" src="${hero.thumbnail.path}.${hero.thumbnail.extension}">
            <div class="card-body">
            <h4 class="card-title">${hero.name}</h4>
            <p class="card-text">${hero.description}</p>
            <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                    <button id="view-hero" type="button" class="btn btn-sm btn-outline-secondary" data-id=${hero.id}>View</button>
                </div>
                ${favBtn}                
            </div>
        </div>
    `;

    heroList.append(heroDiv);
}

/*---- Checks if Length of Favorites and Retrieved Heroes is Same. If not same calls the same function after a few milliseconds then Clears the previous list and renders the current elements in Heroes array ----*/
function renderHeroList() {
    if (heroes.length != favorites.length) {
        setTimeout(renderHeroList, 100);
    }

    heroList.innerHTML = '';

    for (let i = 0; i < heroes.length; i++) {
        addHeroToList(heroes[i]);
    }
}

/*---- Stores the Hero ID in Session Storage then opens the Character Detail Page ----*/
function viewCharacter(heroID) {
    sessionStorage.setItem("hero-id", heroID);

    window.open("character.html", "_self");
}

/*--- Handles All the click events ocurring on the page ----*/
function handleClickEvent(evt) {
    const element = evt.target;

    if (element.id == 'view-hero') {
        viewCharacter(element.dataset.id);
    } else if (element.id == 'unfavorite') {
        removeFromFavorites(element.dataset.id);
    }
}

/*---- Initialization Function of the Page ----*/
function initApp() {
    fetchFavourites();
    document.addEventListener('click', handleClickEvent);
}

initApp();