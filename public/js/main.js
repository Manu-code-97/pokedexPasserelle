// VARIABLES ET OBJETS
const pokedexData = 'POKEMONS';
let pokemons = [];
let poke = [];
let pokemon = {
    idApi: 'id',
    idJeu: 'game_indices[3].game_index',
    name: 'name',
    height: 'height',
    weight: 'weight',
    type1: 'types[0].type.name',
    type2: 'types[1].type.name',
    spriteFront: 'sprites.front_default',
    spriteBack: 'sprites.back_default',
    spritPick: 'sprites.versions.generation-iii.emerald.front_default',
    hp: 'stats[0].base_stat',
    attack: 'stats[1].base_stat',
    defense: 'stats[2].base_stat',
    attackSpe: 'stats[3].base_stat',
    defenseSpe: 'stats[4].base_stat',
    speed: 'stats[5].base_stat',
}

//CHECK LOCALSTORAGE
if (localStorage.getItem(pokedexData) !== null) {
    pokemons = loadData(pokedexData);
    console.log(pokemons);

} else {
    Promise.all([genPokemonFetch(1), genPokemonFetch(2), genPokemonFetch(3)]).then(() => {
        genPokemon();
    });
}


//FUNCTIONS
async function genPokemonFetch(generation) {
    const reponseJSON = await fetch("https://pokeapi.co/api/v2/generation/" + generation + "/");
    let gen = await reponseJSON.json();
    poke.push(gen.pokemon_species);
}

async function getPokemon(pokemonName) {
    if (pokemonName != 'deoxys') {
        const reponseJSON = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        let pokemonApi = await reponseJSON.json();
        pokemons.push(pokemonApi);
    }
}

function genPokemon() {
    let promises = [];
    for (let i = 0; i < poke.length; i++) {
        for (let j = 0; j < poke[i].length; j++) {
            promises.push(getPokemon(poke[i][j].name));
            // refresh();
        }
    }

    // setTimeout(() => {
    //     saveData(pokedexData, pokemons);

    // }, 5000);

    // Promise.all(promises)
    // .then(() => {
    //     console.log(pokemons);
    //     saveData(pokedexData, pokemons)
    // })
    // .catch((err) => {
    //     console.log(err);
    // });        
}

function refresh() {
    let cards = document.getElementById('card');

    cards.innerHTML = '';

    for (let i = 0; i < pokemons.length; i++) {
        cards.innerHTML += `
        <li class="card" style="width: 18rem;">
            <img src="${pokemons[i].sprites.front_default}" class="card-img-top" alt="${pokemons[i].name}">
                <div class="card-body">
                    <h5 class="card-title">${pokemons[i].name}</h5>
                    <p class="card-text">Pokedex Index: ${pokemons[i].order}</p>
                    <p class="card-text">Type: ${pokemons[i].types[0].type.name}</p>
                </div>
            </li>
        `;

    }
}

//MAIN CODE
