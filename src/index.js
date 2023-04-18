// Required Keys for Marvel API
const publicKey = "ef9e39e3401de00c55adb173e95906fa";
const privateKey = "952a243d80cec8fef46bff4fcfa91e9a55e5f792"

const heroList = document.getElementById('superhero-list');

// Timestamp
let ts = new Date().getTime();

let heroes = [];
let favorites = [];

/*---- Retrieves all favorited heroes from Session Storage/Local Storage ----*/
function fetchFavourites(){
    let sessionFavs = JSON.parse(sessionStorage.getItem("favorite-heroes"));
    if(sessionFavs != null && sessionFavs.length > 0){
        localStorage.setItem("favorite-heroes", JSON.stringify(sessionFavs));
    }

    favorites = JSON.parse(localStorage.getItem("favorite-heroes"));
    if(favorites == "" || favorites == null){
        favorites = [];
    }
    
    sessionStorage.setItem("favorite-heroes", JSON.stringify(favorites));
}

/*---- Adds Hero to favorited list - takes the Hero ID as input, pushes it to the favorites list then saves the list in Session Storage as well as Local Storage and recalls renderHeroList() to render the list again ----*/
function addToFavorites(heroID){
    if(!favorites.includes(heroID)){
        favorites.push(heroID.toString());
        sessionStorage.setItem("favorite-heroes", JSON.stringify(favorites));
        localStorage.setItem("favorite-heroes", JSON.stringify(favorites));

        renderHeroList();
    }
}

/*---- Remove Hero from favorited list - takes the Hero ID as input, filters it from the list then saves the filtered list in Session Storage as well as Local Storage and recalls renderHeroList() to render the list again ----*/
function removeFromFavorites(heroID){
    let filteredFavs = favorites.filter(function(id) {
        return id != heroID.toString();
    })

    favorites = filteredFavs;
    sessionStorage.setItem("favorite-heroes", JSON.stringify(favorites));
    localStorage.setItem("favorite-heroes",  JSON.stringify(favorites));

    renderHeroList();
}

/*---- Creates the HTML element for every Hero in Heroes array and appends it to the heroList ----*/
function addHeroToList(hero){
    const heroDiv = document.createElement('div');
    let favBtn = "";

    if(favorites.includes(hero.id.toString()) == false){
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

/*---- Stores the Hero ID in Session Storage then opens the Character Detail Page ----*/
function viewCharacter(heroID){
    sessionStorage.setItem("hero-id", heroID);

    window.open("character.html","_self");
}

/*---- Clears the previous list and renders the current elements in Heroes array ----*/
function renderHeroList(){
    heroList.innerHTML = '';

    for( let i = 0; i < heroes.length; i++){
        addHeroToList(heroes[i]);
    }
}

/*---- Handles Search Operation on every 'keyup' event, passes input to the Marvel-API then stores the response in the heroes array and calls the renderHeroList() ----*/
async function searchHero(evt){
    try {
        const searchText = evt.target.value;

        if(!searchText){
            return;
        }

        const response = await fetch(`https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=ef9e39e3401de00c55adb173e95906fa&hash=${CryptoJS.MD5(ts.toString()+privateKey+publicKey)}&nameStartsWith=${evt.target.value}`);
        const data = await response.json();
        heroes = data.data.results

        renderHeroList();
    } catch (error) {
        console.log("Error Occurred :", error);
    }
}

/*--- Handles All the click events ocurring on the page ----*/
function handleClickEvent(evt) {
    const element = evt.target

    if(element.id == 'view-hero'){
        viewCharacter(element.dataset.id);
    } else if (element.id == 'favorite'){
        addToFavorites(element.dataset.id);
    } else if (element.id == 'unfavorite'){
        removeFromFavorites(element.dataset.id);
    }
}

/*---- Initialization Function of the Page ----*/
function initApp(){
    fetchFavourites();
    document.getElementById('superhero-search').addEventListener('keyup', searchHero)
    document.addEventListener('click', handleClickEvent);
}

initApp();
