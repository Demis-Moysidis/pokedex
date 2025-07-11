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
            ${abilitiesList[i].ability.name.charAt(0).toUpperCase() + abilitiesList[i].ability.name.slice(1)}
            ${abilitiesList[i].is_hidden ? '<img class="ability-icon" src="./assets/icons/fontawesome/eye-slash-solid.svg" title="Hidden Ability" alt=""></img>' : ''}
        </p>
        `
}

function renderOneWeaknessHtml(type){
    return /*html*/`
            <img class="weakness" title="${type.toUpperCase()}" src="./assets/icons/types-2/${type}.svg" alt="">
        `
}

function renderOnePokemonCard(pokeDataJson){
    return /*html*/`
        <div onclick="renderSelectedPokemon(${pokeDataJson.id})" class="card poke_card">
            <img src="${findPokemonGif(pokeDataJson)}" alt="">  
            <p>N°${pokeDataJson.id}</p>
            <h3>${modifyPokeName(pokeDataJson.name)}</h3>
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

async function renderSelectedPokeCardHtml(pokeDataJson, pokeSpeciesDataJson){
    return /*html*/`
        
            <img src="${checkIfPokemonKoraidonOrMiraidon(pokeDataJson)[0] ? checkIfPokemonKoraidonOrMiraidon(pokeDataJson)[3] : pokeDataJson.sprites.other['official-artwork'].front_default}" alt="">
            
            <div class="flex-column-center">
                <p class="m-tb text-gray">#${pokeDataJson.id}</p>
                <h2 class="m-tb">${modifyPokeName(pokeDataJson.name)}</h2>
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
                    <div class="info-value flex-row-center">${await renderPokemonWeaknesses(pokeDataJson)}</div>
                </div>
            
                <div class="flex-column-center">
                    <h4 class="m-tb">BASE EXP</h4>
                    <p class="info-value">${pokeDataJson.base_experience}</p>
                </div>
            </div> 
    `
}