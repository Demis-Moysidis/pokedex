function renderTypesForOnePokemon(typeList, i){
    return /*html*/`
        <p class="${typeList[i].type.name} type">
            <img class="type-icon" src="./assets/icons/types/${typeList[i].type.name}.svg" alt="">
            ${typeList[i].type.name.toUpperCase()}
        </p>
        `
}

function renderOnePokemonCard(pokeDataJson){
    return /*html*/`
        <div onclick="renderSelectedPokemon(${pokeDataJson.id})" class="card poke_card">
            <img src="${pokeDataJson.id < 650 ? pokeDataJson.sprites.versions['generation-v']['black-white'].animated.front_default : pokeDataJson.sprites.front_default}" alt="">  
            <p>N°${pokeDataJson.id}</p>
            <h3>${pokeDataJson.name.charAt(0).toUpperCase() + pokeDataJson.name.slice(1)}</h3>
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

function renderShowMorePokemonBtn(){
    return /*html*/`
        <div class="main-more_pokemon_container">
            <button onclick="showMorePokemon()" class="main-more_pokemon_btn">Show More Pokémon</button>
        </div>
        `
}