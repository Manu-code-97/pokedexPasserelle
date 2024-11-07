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
        <div class="col-1">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/${pokemons[i].id}.png" class="card-img-top w-50 sprite" data-index="${pokemons[i].id}" alt="${pokemons[i].name}">
        </div>`;
    }
}

function chosePokemon(event) {
    let sprite = document.querySelectorAll('img.sprite');
    console.log(sprite);
    for (const element of sprite) {
        element.addEventListener('click', test);
    }
}

function changeFocusPokemon(index) {
    let pokeImage = document.getElementById('pokeImage');
    pokeImage.innerHTML = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index}.png" class="fixed-top" alt="${index}">`;
}

function test(event) {
    let index = event.currentTarget.dataset.index;
    changeFocusPokemon(index);
}

//MAIN CODE
