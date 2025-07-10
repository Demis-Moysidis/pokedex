let maxNumberOfPokemonToShow = 1302;
let startNumberOfPokemon = 1;
let startAmountOfPokemon = 32;

let pokeCurrentAmount = startAmountOfPokemon;
let pokeAmountForShowMore = 5;

let previousInputLength = 0;
let fetchRequestId = 0;

function init(){
    renderLoadingScreen();
    renderPokecards(startNumberOfPokemon, startAmountOfPokemon);
    eventListenerForInput();
}

async function renderPokecards(pokeStart, pokeEnd){
    let currentId = ++fetchRequestId;

    let refPokecards = document.getElementById('main-pokecards');
    let htmlStructureOfPokemons = "";

    for (let i = pokeStart; i <= pokeEnd; i++) {
        if(i <= maxNumberOfPokemonToShow){
            let j = i;
            if(i > 1025){
                j = i + 8975;
            }
            let pokeData = await fetch('https://pokeapi.co/api/v2/pokemon/' + j);
            let pokeDataJson = await pokeData.json();

            htmlStructureOfPokemons += renderOnePokemonCard(pokeDataJson);
        }
    }

    if(currentId == fetchRequestId){
        refPokecards.removeChild(refPokecards.lastElementChild);
        refPokecards.insertAdjacentHTML('beforeend', htmlStructureOfPokemons + (pokeCurrentAmount < maxNumberOfPokemonToShow ? renderShowMorePokemonBtn() : ""));
    }
}

function renderPokeTypes(typeList){
    let typesHTML = ""
    for (let i = 0; i < typeList.length; i++) {
        typesHTML += renderTypesForOnePokemon(typeList, i);
    }
    return typesHTML
}

function renderPokeAbilities(abilitiesList){
    let abilitiesHTML = ""
    for (let i = 0; i < abilitiesList.length; i++) {
        abilitiesHTML += renderAbilitiesForOnePokemon(abilitiesList, i);
    }
    return abilitiesHTML
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
    
    let allPokemonNames = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
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
        return
    }

    let refPokecards =  document.getElementById('main-pokecards');
    refPokecards.innerHTML = "";
    renderLoadingScreen(); 
    let htmlStructureOfPokemons = "";
    
    let currentId = ++fetchRequestId;

    for (let i = 0; i < matchedObjects.length; i++) {
        let pokemonData = await fetch(matchedObjects[i].url);
        let pokeDataJson = await pokemonData.json();
        htmlStructureOfPokemons += renderOnePokemonCard(pokeDataJson);
    }
    
    if(currentId == fetchRequestId){
        refPokecards.removeChild(refPokecards.lastElementChild);
        refPokecards.insertAdjacentHTML('beforeend', htmlStructureOfPokemons);
    }
}

function eventListenerForInput(){
    let refInputPokeName = document.getElementById('main-poke_search');
    let refInputHint = document.getElementById('main-input_hint');

    refInputPokeName.addEventListener('input', (event) => {
        if(event.target.value.length == 3){
            previousInputLength = 3;
        }else if(event.target.value.length == 1){
            previousInputLength = 0;
        }

        if(event.target.value.length >= 3 || event.target.value.length == 0){
            searchByName();
            refInputHint.classList.add('d_none');
        }else if(event.target.value.length == 2 && previousInputLength == 3){
            renderFirstPartOfPokemon();
            refInputHint.classList.remove('d_none');
        } else{
            refInputHint.classList.remove('d_none');
        }
    });
}

function renderFirstPartOfPokemon(){
    let refPokecards = document.getElementById('main-pokecards');
    refPokecards.innerHTML = "";
    renderLoadingScreen(); 
    renderPokecards(startNumberOfPokemon, startAmountOfPokemon);
    pokeCurrentAmount = startAmountOfPokemon;
}

async function renderSelectedPokemon(pokemonId){

    let pokeData = await fetch('https://pokeapi.co/api/v2/pokemon/' + pokemonId);
    let pokeDataJson = await pokeData.json();

    let pokeSpeciesData = await fetch(pokeDataJson.species.url);
    let pokeSpeciesDataJson = await pokeSpeciesData.json();

    refSelectedPokecard = document.getElementById('main-selected_pokecard').innerHTML = renderSelectedPokeCardHtml(pokeDataJson, pokeSpeciesDataJson);
}

function findGenerationName(generationJsonList){
    let matchedGeneration = generationJsonList.find(generation => generation.language.name == 'en');
    return matchedGeneration.genus
}

function findFlavorText(flavorTextJsonList){
    let matchedFlavorText = flavorTextJsonList.find(flavorText => flavorText.language.name == 'en');
    return matchedFlavorText.flavor_text.replace(/\f/g, ' ')
}

function findPokemonGif(pokeDataJson){
    if(pokeDataJson.sprites.versions['generation-v']['black-white'].animated.front_default != null){
        return pokeDataJson.sprites.versions['generation-v']['black-white'].animated.front_default;
    }else if(pokeDataJson.sprites.other.showdown.front_default != null){
        return pokeDataJson.sprites.other.showdown.front_default;
    }else if(checkIfPokemonKoraidonOrMiraidon(pokeDataJson)[0]){     
        return checkIfPokemonKoraidonOrMiraidon(pokeDataJson)[2]     
    }else{
        return pokeDataJson.sprites.front_default
    }
}

function checkIfPokemonKoraidonOrMiraidon(pokeDataJson){
    if( pokeDataJson.name == "koraidon-limited-build" || 
        pokeDataJson.name == "koraidon-sprinting-build" ||
        pokeDataJson.name == "koraidon-swimming-build" || 
        pokeDataJson.name == "koraidon-gliding-build" 
    ){
        return [true, 'koraidon', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1007.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1007.png']
    }else if(
        pokeDataJson.name == 'miraidon-glide-mode' || 
        pokeDataJson.name == 'miraidon-aquatic-mode' ||
        pokeDataJson.name == 'miraidon-drive-mode' || 
        pokeDataJson.name == 'miraidon-low-power-mode'
    ){
        return [true, 'miraidon', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1008.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1008.png']
    }else{
        return false
    }
}