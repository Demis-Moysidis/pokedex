function init(){
    renderPokecards(30);
}

async function renderPokecards(pokeAmount){
    let refPokecards = document.getElementById('main-pokecards');

    for (let i = 1; i <= pokeAmount; i++) {

        let pokeData = await fetch('https://pokeapi.co/api/v2/pokemon/' + i);
        let pokeDataJson = await pokeData.json();

        refPokecards.innerHTML += /*html*/`
            <div class="card poke_card">
                <img src="${pokeDataJson.sprites.versions['generation-v']['black-white'].animated.front_default}" alt="">
                
                <p>N°${pokeDataJson.id}</p>
                <h3>${pokeDataJson.name.charAt(0).toUpperCase() + pokeDataJson.name.slice(1)}</h3>
                <div class="poke_types">${renderPokeTypes(pokeDataJson.types)}</div>
            </div>
            `
    }
}

function renderPokeTypes(typeList){
    let typesHTML = ""
    for (let i = 0; i < typeList.length; i++) {
        typesHTML += /*html*/`
            <p class="${typeList[i].type.name} type">
                <img class="type-icon" src="./assets/icons/types/${typeList[i].type.name}.svg" alt="">
                ${typeList[i].type.name.toUpperCase()}
            </p>
        `
    }
    return typesHTML
}
