let maxNumberOfPokemonToShow = 1025;
let startNumberOfPokemon = 1;
let startAmountOfPokemon = 5;

let pokeCurrentAmount = startAmountOfPokemon;
let pokeAmountForShowMore = 2;

function init(){
    renderLoadingScreen();
    renderPokecards(startNumberOfPokemon, startAmountOfPokemon);
    eventListenerForInput();
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

function renderNoResultScreen(){
    let refPokecards = document.getElementById('main-pokecards');
    refPokecards.innerHTML = renderNoResultHTML();
}

function showMorePokemon(){
    let refPokecards = document.getElementById('main-pokecards');
    refPokecards.removeChild(refPokecards.lastElementChild);

    renderLoadingScreen(); 
    renderPokecards(pokeCurrentAmount + 1, pokeCurrentAmount + pokeAmountForShowMore);
    pokeCurrentAmount += pokeAmountForShowMore;
}

async function searchByName() {
    let [matchedObjects, checkIfInputEmpty] = await filterBasedOnInput();
    renderBasedOnInput(matchedObjects, checkIfInputEmpty);
}

async function filterBasedOnInput(){
    refInputPokeName = document.getElementById('main-poke_search');
    inputValue = refInputPokeName.value;

    if(inputValue == ""){
        return [[], true]
    }
    
    let allPokemonNames = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0');
    let allPokemonNamesJSON = await allPokemonNames.json();
    
    let matchedObjects = allPokemonNamesJSON.results.filter(pokemon => {
        return pokemon.name.toLowerCase().includes(inputValue.toLowerCase());
    })

    return [matchedObjects, false];
}

async function renderBasedOnInput(matchedObjects, checkIfInputEmpty){
    if(matchedObjects.length == 0 && !checkIfInputEmpty){
        renderNoResultScreen();
        return
    }else if(checkIfInputEmpty){
        let refPokecards = document.getElementById('main-pokecards');
        refPokecards.innerHTML = "";
        renderLoadingScreen(); 

        renderPokecards(startNumberOfPokemon, startAmountOfPokemon);
        pokeCurrentAmount = startAmountOfPokemon;
        return
    }

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

function eventListenerForInput(){
    refInputPokeName = document.getElementById('main-poke_search');

    refInputPokeName.addEventListener('input', (event) => {
        if(event.target.value.length >= 3 || event.target.value.length == 0){
            searchByName();
        }
    });
}