let pokeCurrentAmount = 30;
let pokeAmountForShowMore = 50;

let maxNumberOfPokemonToShow = 1025;
let startNumberOfPekon = 1;

function init(){
    renderLoadingScreen();
    renderPokecards(startNumberOfPekon, pokeCurrentAmount);
}

async function renderPokecards(pokeStart, pokeEnd){
    let refPokecards = document.getElementById('main-pokecards');
    let htmlStructureOfPokemons = "";

    for (let i = pokeStart; i <= pokeEnd; i++) {

        if(i <= maxNumberOfPokemonToShow){
            let pokeData = await fetch('https://pokeapi.co/api/v2/pokemon/' + i);
            let pokeDataJson = await pokeData.json();

            htmlStructureOfPokemons += renderOnePokemonCard(pokeDataJson);
        }
    }
    refPokecards.removeChild(refPokecards.lastElementChild);
    refPokecards.insertAdjacentHTML('beforeend', htmlStructureOfPokemons + (pokeCurrentAmount < maxNumberOfPokemonToShow ? renderShowMorePokemonBtn() : ""));
}

function renderPokeTypes(typeList){
    let typesHTML = ""
    for (let i = 0; i < typeList.length; i++) {
        typesHTML += renderTypesForOnePokemon(typeList, i);
    }
    return typesHTML
}

function renderSelectedPokemon(pokemonId){
    console.log(pokemonId);
}

function renderLoadingScreen(){
    let refPokecards = document.getElementById('main-pokecards');
    refPokecards.insertAdjacentHTML('beforeend', renderLoadingHTML());
}

function showMorePokemon(){
    let refPokecards = document.getElementById('main-pokecards');
    refPokecards.removeChild(refPokecards.lastElementChild);

    renderLoadingScreen();

    renderPokecards(pokeCurrentAmount + 1, pokeCurrentAmount + pokeAmountForShowMore);
    pokeCurrentAmount += pokeAmountForShowMore;
}

async function searchByName() {
    let matchedObjects = await filterBasedOnInput();
    renderBasedOnInput(matchedObjects);
}

async function filterBasedOnInput(){
    refInputPokeName = document.getElementById('main-poke_search');
    inputValue = refInputPokeName.value;
    refInputPokeName.value = "";
    
    let allPokemonNames = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0');
    let allPokemonNamesJSON = await allPokemonNames.json();
    
    let matchedObjects = allPokemonNamesJSON.results.filter(pokemon => {
        return pokemon.name.toLowerCase().includes(inputValue.toLowerCase());
    })

    return matchedObjects;
}

async function renderBasedOnInput(matchedObjects){
    let refPokecards =  document.getElementById('main-pokecards');
    refPokecards.innerHTML = "";
    renderLoadingScreen(); 
    let htmlStructureOfPokemons = "";
    
    for (let i = 0; i < matchedObjects.length; i++) {
        let pokemonData = await fetch(matchedObjects[i].url);
        let pokeDataJson = await pokemonData.json();
        htmlStructureOfPokemons += renderOnePokemonCard(pokeDataJson);
    }
    
    refPokecards.removeChild(refPokecards.lastElementChild);
    refPokecards.insertAdjacentHTML('beforeend', htmlStructureOfPokemons);
}