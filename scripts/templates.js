function renderTypesForOnePokemon(typeList, i){
    return /*html*/`
        <p class="${typeList[i].type.name} type">
            <img class="type-icon" src="./assets/icons/types/${typeList[i].type.name}.svg" alt="">
            ${typeList[i].type.name.toUpperCase()}
        </p>
        `
}

function renderAbilitiesForOnePokemon(abilitiesList, i){
    return /*html*/`
        <p class="ability ${abilitiesList[i].is_hidden ? 'ability-hidden' : 'ability-not-hidden'}">
            ${removeDashesAndCapitalizeFirstLetter(abilitiesList[i].ability.name)}
            ${abilitiesList[i].is_hidden ? '<img class="ability-icon" src="./assets/icons/fontawesome/eye-slash-solid.svg" title="Hidden Ability" alt=""></img>' : ''}
        </p>
        `
}

function renderOneWeaknessHtml(type){
    return /*html*/`
            <img class="weakness" title="${type.toUpperCase()}" src="./assets/icons/types-2/${type}.svg" alt="">
        `
}

function renderOneStat(stat){
    return /*html*/`
            <div class="flex-column-center flex-1 stat" title="${removeDashesAndCapitalizeFirstLetter(stat.stat.name)}">
                <p class="m-tb stat-name stat-${statShortForms[stat.stat.name]}">${statShortForms[stat.stat.name]}</p>
                <p class="m-tb stat-value">${stat.base_stat}</p>
            </div>
        `
}

function renderTotalStat(pokemonStatsList){
    return /*html*/`
            <div class="flex-column-center flex-1 stat stat-TOT-bg" title="Total">
                <p class="m-tb stat-name stat-TOT">${statShortForms['total']}</p>
                <p class="m-tb stat-value">${sumOfStats(pokemonStatsList)}</p>
            </div>
        `
}

function renderThreeEvolutions(imgFirstEvolution, imgSecondEvolution, imgThirdEvolution, levelForSecondEvolution, levelForThirdEvolution, pokeIdFirstEvolution, pokeIdSecondEvolution, pokeIdThirdEvolution){
    return /*html*/`
        <img onclick="renderSelectedPokemon(${pokeIdFirstEvolution})" src="${imgFirstEvolution}" alt="">
        <p class="evolution-info flex-1">${levelForSecondEvolution}</p>
        <img onclick="renderSelectedPokemon(${pokeIdSecondEvolution})" src="${imgSecondEvolution}" alt="">
        <p class="evolution-info flex-1">${levelForThirdEvolution}</p>
        <img onclick="renderSelectedPokemon(${pokeIdThirdEvolution})" src="${imgThirdEvolution}" alt="">
    `
}

function renderTwoEvolutions(imgFirstEvolution, imgSecondEvolution, levelForSecondEvolution, pokeIdFirstEvolution, pokeIdSecondEvolution){
    return /*html*/`
        <img onclick="renderSelectedPokemon(${pokeIdFirstEvolution})" src="${imgFirstEvolution}" alt="">
        <p class="evolution-info flex-1">${levelForSecondEvolution}</p>
        <img onclick="renderSelectedPokemon(${pokeIdSecondEvolution})" src="${imgSecondEvolution}" alt="">
    `
}

function renderOneEvolution(imgFirstEvolution, pokeIdFirstEvolution){
    return /*html*/`
        <img onclick="renderSelectedPokemon(${pokeIdFirstEvolution})" src="${imgFirstEvolution}" alt="">
    `
}

function renderOnePokemonCard(pokeDataJson){
    return /*html*/`
        <div onclick="renderSelectedPokemon(${pokeDataJson.id})" class="card poke_card">
            <img src="${findPokemonGif(pokeDataJson)}" alt="">  
            <p>N°${pokeDataJson.id}</p>
            <h3>${removeDashesAndCapitalizeFirstLetter(pokeDataJson.name)}</h3>
            <div class="poke_types">${renderPokeTypes(pokeDataJson.types)}</div>
        </div>
        `
}

function renderLoadingHTML(){
    return /*html*/`
        <div class="main-loading">
            <img src="./assets/icons/pokeball_gray.png" class="rotate_logo" alt="">
            <p>Loading...</p>
        </div>
        `
}

function renderLoadingHTMLForSelectedPokemon(){
    return /*html*/`
        <div class="selected_pokemon-loading">
            <img src="./assets/icons/pokeball_gray.png" class="rotate_logo" alt="">
            <p>Loading...</p>
        </div>
        `
}

function renderNoResultHTML(){
    return /*html*/`
        <div class="">
            <b>Your search did not return any results!</b>
        </div>
        `
}

function renderShowMorePokemonBtn(){
    return /*html*/`
        <div class="main-more_pokemon_container">
            <button onclick="showMorePokemon()" class="main-more_pokemon_btn">Show More Pokémon</button>
        </div>
        `
}

function renderPreviousPokemonHtml(dataPokemonJson){
    return /*html*/`
        <img class="main-selected_pokemon-img" src="${findPokemonGif(dataPokemonJson)}" alt="">
        <b>${sliceString(removeDashesAndCapitalizeFirstLetter(dataPokemonJson.name))}</b>
        <p>#${dataPokemonJson.id}</p>
    `
}

function renderNextPokemonHtml(dataPokemonJson){
    return /*html*/`
        <p>#${dataPokemonJson.id}</p>
        <b>${sliceString(removeDashesAndCapitalizeFirstLetter(dataPokemonJson.name))}</b>
        <img class="main-selected_pokemon-img" src="${findPokemonGif(dataPokemonJson)}" alt="">
    `
}

function renderQuadrupleDamageHtml(){
    return /*html*/`<p title="Quadruple Damage From" class="weakness-4x">4x</p>`
}

function renderDoubleDamageHtml(){
    return /*html*/`<p title="Double Damage From" class="weakness-2x">2x</p>`
}

async function renderSelectedPokeCardHtml(pokeDataJson, pokeSpeciesDataJson, pokeEvolutionDataJson){
    return /*html*/`
            <img onclick="closeSelectedPokemon()" class="main-selected_pokecard_close" src="./assets/icons/fontawesome/xmark-solid.svg" alt="">
            <img class="main-selected_pokecard_img" src="${checkIfPokemonKoraidonOrMiraidon(pokeDataJson)[0] ? checkIfPokemonKoraidonOrMiraidon(pokeDataJson)[3] : pokeDataJson.sprites.other['official-artwork'].front_default}" alt="">
            
            <div class="flex-column-center">
                <p class="m-tb text-gray">#${pokeDataJson.id}</p>
                <h2 class="m-tb">${removeDashesAndCapitalizeFirstLetter(pokeDataJson.name)}</h2>
                <p class="m-tb text-gray">${findGenerationName(pokeSpeciesDataJson.genera) }</p>
                <div class="poke_types m-tb">${renderPokeTypes(pokeDataJson.types)}</div>
            </div>

            <div class="flex-column-center">
                <h4 class="m-tb">POKÉDEX ENTRY</h4>
                <p class="m-tb text-brown">${findFlavorText(pokeSpeciesDataJson.flavor_text_entries)}</p>
            </div>

            <div class="flex-column-center">
                <h4 class="m-tb">ABILITIES</h4>
                <div class="flex-row-center flex-wrap">${renderPokeAbilities(pokeDataJson.abilities)}</div>
            </div>
            
            <div class="flex-row-center">
                <div class="flex-column-center">
                    <h4 class="m-tb">HEIGHT</h4>
                    <p class="info-value">${pokeDataJson.height / 10}m</p>
                </div>
                <div class="flex-column-center">
                    <h4 class="m-tb">WEIGHT</h4>
                    <p class="info-value">${pokeDataJson.weight / 10}Kg</p>
                </div>
            </div>   

            <div class="flex-row-center">
                <div class="flex-column-center">
                    <h4 class="m-tb">WEAKNESSES</h4>
                    <div class="info-value flex-row-center flex-wrap-media">${await renderPokemonWeaknesses(pokeDataJson)}</div>
                </div>
                <div class="flex-column-center">
                    <h4 class="m-tb">BASE EXP</h4>
                    <p class="info-value">${pokeDataJson.base_experience}</p>
                </div>
            </div> 

            <div class="flex-column-center ">
                <h4 class="m-tb">STATS</h4>
                <div class="flex-row-center flex-wrap-media">${renderPokemonStats(pokeDataJson.stats)}</div>
            </div>

            <div class="flex-column-center evolution">
                <h4 class="m-tb">EVOLUTION</h4>
                <div class="flex-row-center flex-wrap-media">${await renderPokemonEvolutions(pokeEvolutionDataJson)}</div>
            </div>

            <div class="main-selected_pokemon-change_pokemon flex-row-center flex-space-between">
                <div onclick="renderSelectedPokemon(${pokeDataJson.id == 1 ? 10277 : pokeDataJson.id -1})" class="flex-row-center flex-row-center-gab-3 main-selected_pokemon-previous">
                    <img class="main-selected_pokemon-arrow-icons" src="./assets/icons/fontawesome/less-than-solid.svg" alt="">
                    ${await renderPreviousOrNextPokemon(pokeDataJson.id == 1 ? 10277 : pokeDataJson.id -1, 'previous')}
                </div>
                <div class="main-selected_pokemon-divider"></div>
                <div onclick="renderSelectedPokemon(${pokeDataJson.id == 10277 ? 1 : pokeDataJson.id + 1})" class="flex-row-center flex-row-center-gab-3 main-selected_pokemon-next">
                    ${await renderPreviousOrNextPokemon(pokeDataJson.id == 10277 ? 1 : pokeDataJson.id + 1, 'next')}
                    <img class="main-selected_pokemon-arrow-icons" src="./assets/icons/fontawesome/greater-than-solid.svg" alt="">
                </div>
            </div>
    `
}