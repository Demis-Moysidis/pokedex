let maxNumberOfPokemonToShow = 1302;
let startNumberOfPokemon = 1;
let startAmountOfPokemon = 32;

let pokeCurrentAmount = startAmountOfPokemon;
let pokeAmountForShowMore = 32;

let previousInputLength = 0;
let fetchRequestId = 0;

let selectedPokemonId = 0;

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

function renderLoadingScreenForSelectedPokemon(){
    let refSelectedPokemon = document.getElementById('main-selected_pokecard');
    refSelectedPokemon.innerHTML = renderLoadingHTMLForSelectedPokemon();
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

function renderFirstPartOfPokemon(){
    let refPokecards = document.getElementById('main-pokecards');
    refPokecards.innerHTML = "";
    renderLoadingScreen(); 
    renderPokecards(startNumberOfPokemon, startAmountOfPokemon);
    pokeCurrentAmount = startAmountOfPokemon;
}

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

async function renderPokemonWeaknesses(pokeDataJson){
    if(pokeDataJson.types.length == 1){
        return await renderWeaknessForOneType(pokeDataJson);
    }else{
        return await renderWeaknessForTwoType(pokeDataJson);
    }
}

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

async function renderWeaknessForTwoType(pokeDataJson) {
        let weaknessesHtml = ""; 
        let allQuadrupleDamage = [], allDoubleDamage = [], allHalfDamage = [], allNoDamage = []
        for (let i = 0; i < pokeDataJson.types.length; i++) {
            let typeData = await fetch(pokeDataJson.types[i].type.url);
            let typeDataJson = await typeData.json();
            typeDataJson.damage_relations.double_damage_from.forEach(type => allDoubleDamage.push(type.name));
            typeDataJson.damage_relations.half_damage_from.forEach(type => allHalfDamage.push(type.name));
            typeDataJson.damage_relations.no_damage_from.forEach(type => allNoDamage.push(type.name));
        }

        allQuadrupleDamage = allDoubleDamage.filter((type, i) => allDoubleDamage.indexOf(type) !== i);
        allDoubleDamage = allDoubleDamage.filter((type) => allDoubleDamage.indexOf(type) === allDoubleDamage.lastIndexOf(type));
        allDoubleDamage = allDoubleDamage.filter((type) => !allNoDamage.includes(type));
        allDoubleDamage = allDoubleDamage.filter((type) => !allHalfDamage.includes(type));

        if(allQuadrupleDamage.length > 0){
            weaknessesHtml = renderQuadrupleDamageHtml();
            allQuadrupleDamage.forEach(type => weaknessesHtml += renderOneWeaknessHtml(type));
        }
        weaknessesHtml += renderDoubleDamageHtml(); 
        allDoubleDamage.forEach(type => weaknessesHtml += renderOneWeaknessHtml(type)); 
        return weaknessesHtml;
}

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

function sumOfStats(pokemonStatsList){
    return pokemonStatsList.reduce((sum, stat) => sum + stat.base_stat, 0)
}

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

async function getDataAndRenderTwoEvolutions(pokeEvolutionDataJson, imgFirstEvolution, levelForSecondEvolution, dataFirstEvolutionJson, dataSecondSpeciesJson) {
    let dataSecondEvolution = await fetch('https://pokeapi.co/api/v2/pokemon/' + dataSecondSpeciesJson.id);
    let dataSecondEvolutionJson = await dataSecondEvolution.json();
    let imgSecondEvolution = dataSecondEvolutionJson.sprites.other['official-artwork'].front_default;

    if(pokeEvolutionDataJson.chain.evolves_to[0]?.evolution_details[0]?.min_level == null){
        levelForSecondEvolution = 'No Lvl';
    }
    return renderTwoEvolutions(imgFirstEvolution, imgSecondEvolution, levelForSecondEvolution, dataFirstEvolutionJson.id, dataSecondEvolutionJson.id)
}

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

function closeSelectedPokemon(){
    document.getElementById('main-selected_pokemon').classList.add('d_none-selected_pokemon');
    selectedPokemonId = 0;
}

async function renderPreviousOrNextPokemon(id, direction){
    let dataPokemon = await fetch('https://pokeapi.co/api/v2/pokemon/' + id);
    let dataPokemonJson = await dataPokemon.json();

    if(direction == 'previous'){
        return renderPreviousPokemonHtml(dataPokemonJson);
    }else if(direction == 'next'){
        return renderNextPokemonHtml(dataPokemonJson);
    }
}

function sliceString(string){
    if(string.length > 10){
        return string.slice(0, 10) + ' ...'
    }else{
        return string
    }    
}