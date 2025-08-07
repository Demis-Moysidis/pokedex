let maxNumberOfPokemonToShow = 1302;
let startNumberOfPokemon = 1;
let startAmountOfPokemon = 32;

let pokeCurrentAmount = startAmountOfPokemon;
let pokeAmountForShowMore = 32;

let previousInputLength = 0;
let fetchRequestId = 0;

let selectedPokemonId = 0;

/**
 * Initializes the application by rendering the loading screen and the initial set of Pokémon cards.
 * @returns {void}
 */
function init(){
    renderLoadingScreen();
    renderPokecards(startNumberOfPokemon, startAmountOfPokemon);
    eventListenerForInput();
}

/**
 * Renders a set of Pokémon cards from a specified start to end index.
 * @param {number} pokeStart - The starting index of Pokémon to render.
 * @param {number} pokeEnd - The ending index of Pokémon to render.
 * @returns {Promise<void>} A promise that resolves when the Pokémon cards are rendered.
 */
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

/**
 * Renders types for a single Pokémon.
 * @param {Array} typeList - An array of types associated with the Pokémon.
 * @returns {string} HTML string representing the type of the Pokémon.
 */
function renderPokeTypes(typeList){
    let typesHTML = ""
    for (let i = 0; i < typeList.length; i++) {
        typesHTML += renderTypesForOnePokemon(typeList, i);
    }
    return typesHTML
}

/**
 * Renders abilities for a list of Pokémon.
 * @param {Array} abilitiesList - An array of abilities associated with the Pokémon.
 * @returns {string} HTML string representing the abilities of the Pokémon.
 */
function renderPokeAbilities(abilitiesList){
    let abilitiesHTML = ""
    for (let i = 0; i < abilitiesList.length; i++) {
        abilitiesHTML += renderAbilitiesForOnePokemon(abilitiesList, i);
    }
    return abilitiesHTML
}

/**
 * Renders a loading screen while fetching Pokémon data.
 * @returns {void}
 */
function renderLoadingScreen(){
    let refPokecards = document.getElementById('main-pokecards');
    refPokecards.insertAdjacentHTML('beforeend', renderLoadingHTML());
}

/**
 * Renders a loading screen for the selected Pokémon card.
 * @returns {void}
 */
function renderLoadingScreenForSelectedPokemon(){
    let refSelectedPokemon = document.getElementById('main-selected_pokecard');
    refSelectedPokemon.innerHTML = renderLoadingHTMLForSelectedPokemon();
}

/**
 * Renders a screen indicating that no results were found for the Pokémon search.
 * @returns {void}
 */
function renderNoResultScreen(){
    let refPokecards = document.getElementById('main-pokecards');
    refPokecards.innerHTML = renderNoResultHTML();
}

/**
 * Renders a "Show More Pokémon" button.
 * @returns {void}
 */
function showMorePokemon(){
    let refPokecards = document.getElementById('main-pokecards');
    refPokecards.removeChild(refPokecards.lastElementChild);

    renderLoadingScreen(); 
    renderPokecards(pokeCurrentAmount + 1, pokeCurrentAmount + pokeAmountForShowMore);
    pokeCurrentAmount += pokeAmountForShowMore;
}

/**
 * Searches for Pokémon by name based on user input.
 * @returns {Promise<void>} A promise that resolves when the search is complete and results are rendered.
 */
async function searchByName() {
    let [matchedObjects, checkIfInputEmpty] = await filterBasedOnInput();
    renderBasedOnInput(matchedObjects, checkIfInputEmpty);
}

/**
 * Filters Pokémon based on user input from the search field.
 * @returns {Promise<Array>} A promise that resolves to an array containing matched Pokémon objects.
 */
async function filterBasedOnInput(){
    refInputPokeName = document.getElementById('main-poke_search');
    inputValue = refInputPokeName.value;

    if(inputValue == ""){
        return [[], true]
    }
    
    let currentId = ++fetchRequestId;

    let allPokemonNames = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
    let allPokemonNamesJSON = await allPokemonNames.json();
    
    let matchedObjects = allPokemonNamesJSON.results.filter(pokemon => {
        return pokemon.name.toLowerCase().includes(inputValue.toLowerCase());
    })

    if(currentId == fetchRequestId){
        return [matchedObjects, false]; 
    }else{
        return [[], true]
    }
}

/**
 * Renders the matched Pokémon objects based on user input.
 * @param {Array} matchedObjects - An array of matched Pokémon objects.
 * @param {boolean} checkIfInputEmpty - A flag indicating whether the input is empty.
 * @returns {Promise<void>} A promise that resolves when the matched Pokémon objects are rendered.
 */
async function renderBasedOnInput(matchedObjects, checkIfInputEmpty){
    if(matchedObjects.length == 0 && !checkIfInputEmpty){
        renderNoResultScreen();
        return
    }else if(checkIfInputEmpty){
        return
    }

    renderMatchedObjects(matchedObjects);
}

/**
 * Renders the matched Pokémon objects as cards in the UI.
 * @param {Array} matchedObjects - An array of matched Pokémon objects.
 * @returns {Promise<void>} A promise that resolves when the matched Pokémon cards are rendered.
 */
async function renderMatchedObjects(matchedObjects){
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

/**
 * Sets up an event listener for the Pokémon name input field.
 * It listens for input changes and triggers a search if the input length is 3 or more
 * or resets the view if the input length is less than 3.
 * @returns {void}
 */
function eventListenerForInput(){
    let refInputPokeName = document.getElementById('main-poke_search');
    let refInputHint = document.getElementById('main-input_hint');

    refInputPokeName.addEventListener('input', (event) => {
        if(event.target.value.length >= 3 ){
            searchByName();  
        }else if((event.target.value.length <= 2 && previousInputLength == 3)){
            renderFirstPartOfPokemon();
        }

        if(event.target.value.length == 0 || event.target.value.length >= 3){
            refInputHint.classList.add('d_none');
        }else{
            refInputHint.classList.remove('d_none');
        }

        if(event.target.value.length >= 3){
            previousInputLength = 3;
        }else if(event.target.value.length < 3){
            previousInputLength = 0;
        }
    });
}

/**
 * Renders the first part of the Pokémon cards, resetting the view to show the initial set of Pokémon.
 * @returns {void} 
 */
function renderFirstPartOfPokemon(){
    let refPokecards = document.getElementById('main-pokecards');
    refPokecards.innerHTML = "";
    renderLoadingScreen(); 
    renderPokecards(startNumberOfPokemon, startAmountOfPokemon);
    pokeCurrentAmount = startAmountOfPokemon;
}

/**
 * Renders the selected Pokémon card based on the provided Pokémon ID.
 * @param {number} pokemonId - The ID of the Pokémon to be rendered.
 * @returns {Promise<void>} A promise that resolves when the selected Pokémon card is rendered.
 */
async function renderSelectedPokemon(pokemonId){
    if(selectedPokemonId == pokemonId){
        return
    }else{
        selectedPokemonId = pokemonId;
        renderLoadingScreenForSelectedPokemon();
        document.getElementById('main-selected_pokemon').classList.remove('d_none-selected_pokemon');
    }

    let pokeData = await fetch('https://pokeapi.co/api/v2/pokemon/' + pokemonId);
    let pokeDataJson = await pokeData.json();

    let pokeSpeciesData = await fetch(pokeDataJson.species.url);
    let pokeSpeciesDataJson = await pokeSpeciesData.json();

    let pokeEvolutionData = await fetch(pokeSpeciesDataJson.evolution_chain.url);
    let pokeEvolutionDataJson = await pokeEvolutionData.json();

    refSelectedPokecard = document.getElementById('main-selected_pokecard').innerHTML = await renderSelectedPokeCardHtml(pokeDataJson, pokeSpeciesDataJson, pokeEvolutionDataJson);
}

/**
 * Finds the generation name from a list of generation JSON objects.
 * @param {Array} generationJsonList - An array of generation JSON objects.
 * @return {string} The name of the generation in English.
 */
function findGenerationName(generationJsonList){
    let matchedGeneration = generationJsonList.find(generation => generation.language.name == 'en');
    return matchedGeneration.genus
}

/**
 * Finds the flavor text in English from a list of flavor text JSON objects.
 * @param {Array} flavorTextJsonList - An array of flavor text JSON objects.
 * @return {string} The flavor text in English, with form feed characters replaced by spaces.
 */
function findFlavorText(flavorTextJsonList){
    let matchedFlavorText = flavorTextJsonList.find(flavorText => flavorText.language.name == 'en');
    return matchedFlavorText.flavor_text.replace(/\f/g, ' ')
}

/**
 * Finds the GIF URL for a Pokémon based on its sprite data.
 * @param {Object} pokeDataJson - JSON object containing Pokémon data.
 * @return {string} The URL of the Pokémon GIF, or the default sprite if no GIF is available.
 */
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

/**
 * Checks if the Pokémon is Koraidon or Miraidon and returns relevant data.
 * @param {Object} pokeDataJson - JSON object containing Pokémon data.
 * @return {Array|boolean} An array containing a boolean indicating if it's Koraidon or Miraidon, the name, and URLs for the sprite and official artwork, or false if not.
 */
function checkIfPokemonKoraidonOrMiraidon(pokeDataJson){
    if( pokeDataJson.name == "koraidon-limited-build" || 
        pokeDataJson.name == "koraidon-sprinting-build" ||
        pokeDataJson.name == "koraidon-swimming-build" || 
        pokeDataJson.name == "koraidon-gliding-build" 
    ){
        return [true, 
                'koraidon', 
                'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1007.png', 
                'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1007.png'
            ]
    }else if(
        pokeDataJson.name == 'miraidon-glide-mode' || 
        pokeDataJson.name == 'miraidon-aquatic-mode' ||
        pokeDataJson.name == 'miraidon-drive-mode' || 
        pokeDataJson.name == 'miraidon-low-power-mode'
    ){
        return [true, 
                'miraidon', 
                'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1008.png', 
                'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1008.png'
            ]
    }else{
        return false
    }
}

/**
 * Renders the weaknesses of a Pokémon.
 * @param {Object} pokeDataJson - JSON object containing Pokémon data.
 * @return {Promise<string>} A promise that resolves to an HTML string representing the Pokémon's weaknesses.
 */
async function renderPokemonWeaknesses(pokeDataJson){
    if(pokeDataJson.types.length == 1){
        return await renderWeaknessForOneType(pokeDataJson);
    }else{
        return await renderWeaknessForTwoType(pokeDataJson);
    }
}

/**
 * Renders the weaknesses for a single type Pokémon.
 * @param {Object} pokeDataJson - JSON object containing Pokémon data.
 * @return {Promise<string>} A promise that resolves to an HTML string representing the weaknesses of the Pokémon.
 */
async function renderWeaknessForOneType(pokeDataJson){
        let weaknessesHtml = "";
        let typeData = await fetch(pokeDataJson.types[0].type.url);
        let typeDataJson = await typeData.json();
        weaknessesHtml = /*html*/`<p title="Double Damage From" class="weakness-2x">2x</p>`
        typeDataJson.damage_relations.double_damage_from.forEach(type => {
            weaknessesHtml += renderOneWeaknessHtml(type.name);
        }); 
        return weaknessesHtml;
}

/**
 * Renders the weaknesses for a two-type Pokémon.
 * @param {Object} pokeDataJson - JSON object containing Pokémon data.
 * @return {Promise<string>} A promise that resolves to an HTML string representing the weaknesses of the Pokémon.
 */
async function renderWeaknessForTwoType(pokeDataJson) {
        let weaknessesHtml = ""; 
        let [allQuadrupleDamage, allDoubleDamage, allHalfDamage, allNoDamage] = await getDamageData(pokeDataJson);

        allQuadrupleDamage = allDoubleDamage.filter((type, i) => allDoubleDamage.indexOf(type) !== i);
        allDoubleDamage = filterDoubleDamage(allDoubleDamage, allNoDamage, allHalfDamage);

        if(allQuadrupleDamage.length > 0){
            weaknessesHtml = renderQuadrupleDamageHtml();
            allQuadrupleDamage.forEach(type => weaknessesHtml += renderOneWeaknessHtml(type));
        }
        weaknessesHtml += renderDoubleDamageHtml(); 
        allDoubleDamage.forEach(type => weaknessesHtml += renderOneWeaknessHtml(type)); 
        return weaknessesHtml;
}

/**
 * Fetches damage data for a Pokémon based on its types.
 * @param {Object} pokeDataJson - JSON object containing Pokémon data.
 * @returns {Promise<Array>} A promise that resolves to an array containing lists of types that cause quadruple, double, half, and no damage.
 */
async function getDamageData(pokeDataJson){
    let allQuadrupleDamage = [], allDoubleDamage = [], allHalfDamage = [], allNoDamage = []
    for (let i = 0; i < pokeDataJson.types.length; i++) {
        let typeData = await fetch(pokeDataJson.types[i].type.url);
        let typeDataJson = await typeData.json();
        typeDataJson.damage_relations.double_damage_from.forEach(type => allDoubleDamage.push(type.name));
        typeDataJson.damage_relations.half_damage_from.forEach(type => allHalfDamage.push(type.name));
        typeDataJson.damage_relations.no_damage_from.forEach(type => allNoDamage.push(type.name));
    }

    return [allQuadrupleDamage, allDoubleDamage, allHalfDamage, allNoDamage]
}

/**
 * Filters out duplicate types from the list of double damage types,
 * ensuring that types that also cause no damage or half damage are excluded.
 * @param {Array} allDoubleDamage - An array of types that cause double damage.
 * @param {Array} allNoDamage - An array of types that cause no damage.
 * @param {Array} allHalfDamage - An array of types that cause half damage.
 * @returns {Array} An array of unique types that cause double damage, excluding those that also cause no damage or half damage.
 */
function filterDoubleDamage(allDoubleDamage, allNoDamage, allHalfDamage){
    allDoubleDamage = allDoubleDamage.filter((type) => allDoubleDamage.indexOf(type) === allDoubleDamage.lastIndexOf(type));
    allDoubleDamage = allDoubleDamage.filter((type) => !allNoDamage.includes(type));
    allDoubleDamage = allDoubleDamage.filter((type) => !allHalfDamage.includes(type));
    return allDoubleDamage
}

/**
 * Removes dashes from a Pokémon name and capitalizes the first letter of each word.
 * @param {string} pokeName - The name of the Pokémon, possibly containing dashes.
 * @returns {string} The formatted Pokémon name with dashes removed and the first letter of each word capitalized.
 */
function removeDashesAndCapitalizeFirstLetter(pokeName){
    let indexOfDashes = [];
    for (let i = 0; i < pokeName.length; i++) {
        if(pokeName.charAt(i) == '-') indexOfDashes.push(i);
    }
    for (let j = 0; j < indexOfDashes.length; j++) {
        pokeName = pokeName.slice(0, indexOfDashes[j] + 1) 
        + pokeName.charAt(indexOfDashes[j] + 1).toUpperCase() 
        + pokeName.slice(indexOfDashes[j] + 2);
    }
    pokeName = (pokeName.charAt(0).toUpperCase() + pokeName.slice(1)).replaceAll('-', ' ');

    return pokeName
}

/**
 * Renders stats for a single Pokémon.
 * @param {Object} stat - An object containing the base stat and its name.
 * @returns {string} HTML string representing the stat of the Pokémon.  
 */
function renderPokemonStats(pokemonStatsList){
    statsHtml = "";
    statShortForms = {'hp': 'HP', 
                      'attack': 'ATK', 
                      'defense': 'DEF', 
                      'special-attack': 'SpA',
                      'special-defense': 'SpD',
                      'speed':'SPD',
                      'total': 'TOT'}

    pokemonStatsList.forEach(stat => {
        statsHtml += renderOneStat(stat);
    })

    statsHtml += renderTotalStat(pokemonStatsList);  
    return statsHtml
}

/**
 * Sums the base stat of a Pokémon.
 * @param {Array} pokemonStatsList - An array of objects containing the base stats of the Pokémon.
 * @returns {number} The total base stat of the Pokémon.
 */
function sumOfStats(pokemonStatsList){
    return pokemonStatsList.reduce((sum, stat) => sum + stat.base_stat, 0)
}

/**
 * Renders the evolution details of a Pokémon based on its evolution chain data.
 * @param {Object} pokeEvolutionDataJson - JSON object containing the evolution chain data of the Pokémon.
 * @returns {Promise<string>} A promise that resolves to an HTML string representing the Pokémon's evolutions.
 */
async function renderPokemonEvolutions(pokeEvolutionDataJson){
    let levelForThirdEvolution =  'Lvl ' + pokeEvolutionDataJson.chain.evolves_to[0]?.evolves_to[0]?.evolution_details[0]?.min_level;    
    let levelForSecondEvolution = 'Lvl ' + pokeEvolutionDataJson.chain.evolves_to[0]?.evolution_details[0]?.min_level;

    let [dataFirstSpeciesJson, dataSecondSpeciesJson, dataThirdSpeciesJson] = await fetchDataForEvolutions(pokeEvolutionDataJson);

    let dataFirstEvolution = await fetch('https://pokeapi.co/api/v2/pokemon/' + dataFirstSpeciesJson.id);
    let dataFirstEvolutionJson = await dataFirstEvolution.json();

    let imgFirstEvolution = dataFirstEvolutionJson.sprites.other['official-artwork'].front_default;

    if(dataThirdSpeciesJson){
        return await getDataAndRenderThreeEvolutions(pokeEvolutionDataJson, imgFirstEvolution, dataFirstEvolutionJson, dataSecondSpeciesJson, dataThirdSpeciesJson, levelForSecondEvolution, levelForThirdEvolution);
    }else if(dataSecondSpeciesJson){
        return await getDataAndRenderTwoEvolutions(pokeEvolutionDataJson, imgFirstEvolution, levelForSecondEvolution, dataFirstEvolutionJson, dataSecondSpeciesJson);
    }else{
        return renderOneEvolution(imgFirstEvolution, dataFirstEvolutionJson.id)
    }
}

/**
 * Fetches data for the first, second, and third species in the evolution chain.
 * @param {Object} pokeEvolutionDataJson - JSON object containing the evolution chain data of the Pokémon.
 * @returns {Promise<Array>} A promise that resolves to an array containing the JSON data for the first, second, and third species in the evolution chain.
 */
async function fetchDataForEvolutions(pokeEvolutionDataJson){
    let dataFirstSpecies = await fetch(pokeEvolutionDataJson.chain.species.url);
    let dataFirstSpeciesJson = await dataFirstSpecies.json();

    let dataSecondSpeciesJson;
    if(pokeEvolutionDataJson.chain.evolves_to[0]?.species?.url){
        let dataSecondSpecies = await fetch(pokeEvolutionDataJson.chain.evolves_to[0]?.species?.url);
        dataSecondSpeciesJson = await dataSecondSpecies.json();
    }

    let dataThirdSpeciesJson;
    if(pokeEvolutionDataJson.chain.evolves_to[0]?.evolves_to[0]?.species?.url){
        let dataThirdSpecies = await fetch(pokeEvolutionDataJson.chain.evolves_to[0]?.evolves_to[0]?.species?.url);
        dataThirdSpeciesJson = await dataThirdSpecies.json();
    }

    return [dataFirstSpeciesJson, dataSecondSpeciesJson, dataThirdSpeciesJson]
}

/**
 * Fetches and renders the evolution details for two evolutions of a Pokémon.
 * @param {Object} pokeEvolutionDataJson - JSON object containing the evolution chain data of the Pokémon.
 * @param {string} imgFirstEvolution - The image URL of the first evolution.
 * @param {number} levelForSecondEvolution - The level required for the second evolution.
 * @param {Object} dataFirstEvolutionJson - JSON object containing the data for the first evolution.
 * @param {Object} dataSecondSpeciesJson - JSON object containing the data for the second species in the evolution chain.
 * @returns {Promise<string>} A promise that resolves to an HTML string representing the two evolutions of the Pokémon.
 */
async function getDataAndRenderTwoEvolutions(pokeEvolutionDataJson, imgFirstEvolution, levelForSecondEvolution, dataFirstEvolutionJson, dataSecondSpeciesJson) {
    let dataSecondEvolution = await fetch('https://pokeapi.co/api/v2/pokemon/' + dataSecondSpeciesJson.id);
    let dataSecondEvolutionJson = await dataSecondEvolution.json();
    let imgSecondEvolution = dataSecondEvolutionJson.sprites.other['official-artwork'].front_default;

    if(pokeEvolutionDataJson.chain.evolves_to[0]?.evolution_details[0]?.min_level == null){
        levelForSecondEvolution = 'No Lvl';
    }
    return renderTwoEvolutions(imgFirstEvolution, imgSecondEvolution, levelForSecondEvolution, dataFirstEvolutionJson.id, dataSecondEvolutionJson.id)
}

/**
 * Fetches and renders the evolution details for three evolutions of a Pokémon.
 * @param {Object} pokeEvolutionDataJson - JSON object containing the evolution chain data of the Pokémon.
 * @param {string} imgFirstEvolution - The image URL of the first evolution.
 * @param {Object} dataFirstEvolutionJson - JSON object containing the data for the first evolution.
 * @param {Object} dataSecondSpeciesJson - JSON object containing the data for the second species in the evolution chain.
 * @param {Object} dataThirdSpeciesJson - JSON object containing the data for the third species in the evolution chain.
 * @param {number} levelForSecondEvolution - The level required for the second evolution.
 * @param {number} levelForThirdEvolution - The level required for the third evolution.
 * @returns {Promise<string>} A promise that resolves to an HTML string representing the three evolutions of the Pokémon.
 */
async function getDataAndRenderThreeEvolutions(pokeEvolutionDataJson, imgFirstEvolution, dataFirstEvolutionJson, dataSecondSpeciesJson, dataThirdSpeciesJson, levelForSecondEvolution, levelForThirdEvolution){
    let dataThirdEvolution = await fetch('https://pokeapi.co/api/v2/pokemon/' + dataThirdSpeciesJson.id);
    let dataThirdEvolutionJson = await dataThirdEvolution.json();
    let imgThirdEvolution = dataThirdEvolutionJson.sprites.other['official-artwork'].front_default;

    let dataSecondEvolution = await fetch('https://pokeapi.co/api/v2/pokemon/' + dataSecondSpeciesJson.id);
    let dataSecondEvolutionJson = await dataSecondEvolution.json();
    let imgSecondEvolution = dataSecondEvolutionJson.sprites.other['official-artwork'].front_default;

    if(pokeEvolutionDataJson.chain.evolves_to[0]?.evolves_to[0]?.evolution_details[0]?.min_level == null){
        levelForThirdEvolution = 'No Lvl';
    }

    if(pokeEvolutionDataJson.chain.evolves_to[0]?.evolution_details[0]?.min_level == null){
        levelForSecondEvolution = 'No Lvl';
    }
    return renderThreeEvolutions(imgFirstEvolution, imgSecondEvolution, imgThirdEvolution, levelForSecondEvolution, levelForThirdEvolution, dataFirstEvolutionJson.id, dataSecondEvolutionJson.id, dataThirdEvolutionJson.id) 
}

/**
 * Closes the selected Pokémon card and resets the selected Pokémon ID.
 * @returns {void}
 */
function closeSelectedPokemon(){
    document.getElementById('main-selected_pokemon').classList.add('d_none-selected_pokemon');
    selectedPokemonId = 0;
}

/** 
 * Renders the previous or next Pokémon based on the provided ID and direction.
 * @param {number} id - The ID of the Pokémon to render.
 * @param {string} direction - The direction to navigate ('previous' or 'next').
 * @returns {Promise<string>} A promise that resolves to an HTML string representing the previous or next Pokémon.
 */
async function renderPreviousOrNextPokemon(id, direction){
    let dataPokemon = await fetch('https://pokeapi.co/api/v2/pokemon/' + id);
    let dataPokemonJson = await dataPokemon.json();

    if(direction == 'previous'){
        return renderPreviousPokemonHtml(dataPokemonJson);
    }else if(direction == 'next'){
        return renderNextPokemonHtml(dataPokemonJson);
    }
}

/**
 * Slices a string to a maximum length of 10 characters and appends ' ...' if it exceeds that length.
 * @param {string} string - The string to be sliced.
 * @returns {string} The sliced string with ' ...' appended if it exceeds 10 characters, or the original string if it does not.
 */
function sliceString(string){
    if(string.length > 10){
        return string.slice(0, 10) + ' ...'
    }else{
        return string
    }    
}