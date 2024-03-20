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
összetevőId:[név, kép elérési útvonal, ár, z-index]
*/
var ingredientData = {
    0:["Fánk alap", "img/donut_base.png", 100, 0],
    1:["Cukormáz", "img/icing.png", 100, 1],
    2:["Csokis töltelék", "img/chocolate_filling.png", 50, 2],
    3:["Cukorkák", "img/sprinkles.png", 20, 3]
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


