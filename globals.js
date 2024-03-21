/*
    {
        "ingredients":[[0,1], [1,1], ...],
        "name":"Fánk neve",
        "amount":1,
    }
*/

var currentUser = {
    "name":"TesztFelhasználó",
    "admin":true //Nem biztonságos, de most ez is jó lesz
}

var checkoutData = [
    {
        "ingredients":[[0,1],[1,1],[2,1],[3,2]],
        "name":"TesztFánk",
        "amount":1
    },
    {
        "ingredients":[[0,1],[1,1],[2,3],[3,1]],
        "name":"TesztFánk2",
        "amount":2
    },
    {
        "ingredients":[[0,1],[1,4],[2,1],[3,1]],
        "name":"TesztFánk3",
        "amount":1
    }
]

var currentPrice = 0;

/*
összetevőId:[név, kép elérési útvonal, ár, z-index, típus]
típusok: alap, maz, toltelek, feltet -> (ebből több is lehet egyszerre, a többiből csak egy)
*/
/*
    típus-id:[típus-név, lehet-több]
*/

var ingredientTypes = {
    "alap":["Fánk alap",false],
    "maz":["Máz",false],
    "toltelek":["Töltelék",false],
    "feltet":["Feltétek",true]
};

var ingredientData = {
    0:["Fánk alap", "img/donut_base.png", 100, 0, "alap"],
    1:["Cukormáz", "img/icing.png", 100, 1, "maz"],
    2:["Csokis töltelék", "img/chocolate_filling.png", 50, 2, "toltelek"],
    3:["Cukorkák", "img/sprinkles.png", 20, 3, "feltet"],
    4:["Narancsos töltelék", "img/orange_filling.png", 40, 2, "toltelek"],
};


function getPriceByIngredients(ingredients){
    let price = 0;
    
    for(let i=0; i<ingredients.length; i++){
        if(ingredients[i][0] in ingredientData){
            price += ingredientData[ingredients[i][0]][2]*ingredients[i][1];
        }
    }
    
    return price;
}


