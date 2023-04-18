// Required Keys for Marvel API
const publicKey = "ef9e39e3401de00c55adb173e95906fa";
const privateKey = "952a243d80cec8fef46bff4fcfa91e9a55e5f792";

// Timestamp
let ts = new Date().getTime();
let heroDetail;

// Retrieves Hero ID from Session Storage then calls Marvel-API to get detail for the Character of the given ID then calls fillHeroDetail
async function fetchHeroDetail(){
    try {
        console.log(`https://gateway.marvel.com:443/v1/public/characters/${sessionStorage.getItem("hero-id")}?ts=${ts}&apikey=ef9e39e3401de00c55adb173e95906fa&hash=${CryptoJS.MD5(ts.toString()+privateKey+publicKey)}`);

        const response = await fetch(`https://gateway.marvel.com:443/v1/public/characters/${sessionStorage.getItem("hero-id")}?ts=${ts}&apikey=ef9e39e3401de00c55adb173e95906fa&hash=${CryptoJS.MD5(ts.toString()+privateKey+publicKey)}`);
        const data = await response.json();
        heroDetail = data.data.results

        fillHeroDetail();
    } catch (error) {
        console.log("Error Occurred :", error);
    }
}

// Populates the Character Details in the HTML page
function fillHeroDetail(){
    document.getElementById('hero-title').innerHTML = heroDetail[0].name;
    document.getElementById('hero-description').innerHTML = heroDetail[0].description;
    document.getElementById('hero-comics-detail').innerHTML = heroDetail[0].comics.available;
    document.getElementById('hero-series-detail').innerHTML = heroDetail[0].series.available;
    document.getElementById('hero-event-detail').innerHTML = heroDetail[0].events.available;
    document.getElementById('hero-story-detail').innerHTML = heroDetail[0].stories.available;
    document.getElementById('superhero-detail-img').src = heroDetail[0].thumbnail.path + "." + heroDetail[0].thumbnail.extension;
}

fetchHeroDetail();