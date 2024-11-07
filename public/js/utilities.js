function saveData(name, data){
    // console.log(data);
    let data_json = JSON.stringify(data);
    
    localStorage.setItem(name, data_json);
}

function loadData(name){
    let data_json = localStorage.getItem(name);
    let data = JSON.parse(data_json);
    return data
}