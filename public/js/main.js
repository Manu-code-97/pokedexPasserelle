// VARIABLES ET OBJETS
const pokedexData = 'POKEMONS';
let pokemons = [];
let poke = [];
let pickedPokemon = null;
let playerFullHp = null;
let npcFullHp = null;
let playerCurrentHp = null;
let npcCurrentHp = null;
let percentHP = null;
/* let pokemon = {
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
} */

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

    // SORT POKEMONS BY ID
    pokemons.sort((a,b) => a.id - b.id)

    for (let i = 0; i < pokemons.length; i++) {
        cards.innerHTML += `
        <div class="col-1 text-center sprite" data-index="${pokemons[i].id}">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/${pokemons[i].id}.png" class="card-img-top w-50" alt="${pokemons[i].name}">
        </div>`;
    }
    chosePokemon();
}

function combat() {
    let mainFrame = document.getElementById('mainFrame');

    let npc = Math.floor(Math.random()*pokemons.length);
    console.log(npc);
    playerFullHp = 2 * pokemons[pickedPokemon].stats[0].base_stat;
    npcFullHp = 2 * pokemons[npc].stats[0].base_stat;
    playerCurrentHp = playerFullHp
    npcCurrentHp = npcFullHp
    percentHP = Math.round((playerCurrentHp * 100)/playerFullHp);
    mainFrame.innerHTML = `
    <div id="playerVsNpc">
        <div id="fightScreen" class="row">
            <div id="player" class="col-6">
                <div id="hp1">
                    <div id="playerHpBar" class="progress" role="progressbar" aria-label="Success example" aria-valuenow="${playerCurrentHp}" aria-valuemin="0" aria-valuemax="${playerFullHp}">
                        <div id="playerHpBarPercent" class="progress-bar bg-success" style="width: 100%"></div>
                    </div>
                </div>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemons[pickedPokemon].id}.png" class="card-img-top w-50" alt="${pokemons[pickedPokemon].name}">
            </div>

            <div id="computer" class="col-6">
                <div id="hp2">
                    <div class="progress" role="progressbar" aria-label="Success example" aria-valuenow="${npcCurrentHp}" aria-valuemin="0" aria-valuemax="${npcFullHp}">
                        <div class="progress-bar bg-danger" style="width: 100%"></div>
                    </div>
                </div>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemons[npc].id}.png" class="card-img-top w-50" alt="${pokemons[npc].name}">
            </div>
        </div>
        <div id="menuScreen" class=" container bg-secondary-subtle">
            <div class="row">
                <div class="col-6 row">
                    <button id="attackOne" class="text-center col-6">Atk</button>
                </div>
                <div class="col-6 row">
                    <button id="attackTwo" class="text-center col-6">Atk</button>
                </div>
            </div>
            <div class="row">
                <div class="col-6 row">
                    <button id="attackThree" class="text-center col-6">Atk</button>
                </div>
                <div class="col-6 row">
                    <button id="attackFour" class="text-center col-6">Atk</button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    let attackOne = document.getElementById('attackOne');
    let attackTwo = document.getElementById('attackTwo');
    let attackThree = document.getElementById('attackThree');
    let attackFour = document.getElementById('attackFour');
    attackOne.addEventListener('click', attack);
    attackTwo.addEventListener('click', test);
    attackThree.addEventListener('click', test);
    attackFour.addEventListener('click', test);
}

function chosePokemon(event) {
    let sprite = document.querySelectorAll('div.sprite');
    console.log(sprite);
    for (const element of sprite) {
        element.addEventListener('click', currentTarget);
    }
}

function changeFocusPokemon(index,pokemons) {
    let pokeImage = document.getElementById('pokeImage');
    pokeImage.innerHTML = `
    <div>
        <div>
            <div>
                <p>N°: ${index}</p>
            </div>
        </div>
        <div class="text-center">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index}.png" alt="${index}">
        </div>
        <div>
            <p>${(pokemons[index-1].name).toUpperCase()}</p>
            <p>Type: ${(pokemons[index-1].types[0].type.name)} ${pokemonTypes(index, pokemons)}</p>
        </div>
        <div>
            <p>Height: ${(pokemons[index-1].height)/10} m</p>
            <p>Weight: ${(pokemons[index-1].weight)/10} kg</p>
        </div>
        <button data-index="${index}">Choisir</button>
    </div>
    `;
    pickedPokemon = index-1;
    let button = document.querySelector('button');
    button.addEventListener('click', combat);
}

function pokemonTypes(index, pokemons){
    if ((pokemons[index-1].types[1]) !== undefined){
        return '& ' + pokemons[index-1].types[1].type.name;
    } else {
        return '';
    }
}

function currentTarget(event) {
    let index = event.currentTarget.dataset.index;
    changeFocusPokemon(index, pokemons);
}

function test() {
    console.log('hi');
    
}

function attack(){
    let dmg = Math.floor(Math.random()*pokemons[pickedPokemon].stats[1].base_stat);
    let hp1 = document.getElementById('hp1');
    let hp2 = document.getElementById('hp2');
    /* if (playerCurrentHp <= 0){
        alert('GAME OVER!');
    } else if (npcCurrentHp <= 0) {
        alert('VICTORY!');
    }else{
        playerCurrentHp -= dmg;
        percentHP = Math.round((playerCurrentHp * 100)/playerFullHp);
        hp1.innerHTML = `
        <div id="playerHpBar" class="progress" role="progressbar" aria-label="Success example" aria-valuenow="${playerCurrentHp}" aria-valuemin="0" aria-valuemax="${playerFullHp}">
            <div class="progress-bar bg-success" style="width: ${percentHP}%"></div>
        </div>`;
        dmg = Math.floor(Math.random()*pokemons[pickedPokemon].stats[1].base_stat);
        npcCurrentHp -= dmg;
        percentHP = Math.round((npcCurrentHp * 100)/npcFullHp);
        hp2.innerHTML = `
        <div class="progress" role="progressbar" aria-label="Success example" aria-valuenow="${npcCurrentHp}" aria-valuemin="0" aria-valuemax="${npcFullHp}">
            <div class="progress-bar bg-danger" style="width: ${percentHP}%"></div>
        </div>`;
    } */
    playerCurrentHp -= dmg;
    percentHP = Math.round((playerCurrentHp * 100)/playerFullHp);
    hp1.innerHTML = `
        <div id="playerHpBar" class="progress" role="progressbar" aria-label="Success example" aria-valuenow="${playerCurrentHp}" aria-valuemin="0" aria-valuemax="${playerFullHp}">
            <div class="progress-bar bg-success" style="width: ${percentHP}%"></div>
        </div>`;
    dmg = Math.floor(Math.random()*pokemons[pickedPokemon].stats[1].base_stat);
    npcCurrentHp -= dmg;
    percentHP = Math.round((npcCurrentHp * 100)/npcFullHp);
    hp2.innerHTML = `
        <div class="progress" role="progressbar" aria-label="Success example" aria-valuenow="${npcCurrentHp}" aria-valuemin="0" aria-valuemax="${npcFullHp}">
            <div class="progress-bar bg-danger" style="width: ${percentHP}%"></div>
        </div>`;
    if (playerCurrentHp <= 0){
        alert('GAME OVER!');
        window.location.reload();
    } else if (npcCurrentHp <= 0){
        alert('VICTORY!');
        window.location.reload();
    }
}
//MAIN CODE
setTimeout(refresh, 3000);