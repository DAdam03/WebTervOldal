/*
    {
        "ingredients":[[0,1], [1,1], ...],
        "name":"Fánk neve",
        "amount":1,
    }
*/

//Ez majd szerveren lesz tárolva. A kliens csak a felhasználónáv - userId párokat kapja meg a fánkok kiírásához
var userData = {
    0:{
        "name":"TesztFelhasználó",
        "admin":true
    },
    1:{
        "name":"TesztFelhasználó2",
        "admin":false
    },
    2:{
        "name":"TesztFelhasználó3",
        "admin":false
    },
}


var currentUser = -1; // -1 -> nincs bejelentkezve

/*
    {
        "ingredients":[[0,1],[1,1],[2,1],[3,2]],
        "name":"TesztFánk",
        "amount":1
    },

    vagy

    {
        id:donutId,
        amount:1
    },
*/

var donutData = {
    0:{
        "ingredients":[[0,1],[1,1],[2,1],[3,1]],
        "name":"TesztFánk",
        "rating":-1,
        "user":-1
    },
    1:{
        "ingredients":[[0,1],[1,1],[2,1],[3,1]],
        "name":"TesztFánk2",
        "rating":-1,
        "user":-1
    },
    2:{
        "ingredients":[[0,1],[1,1],[2,1],[3,1]],
        "name":"TesztFánk3",
        "rating":-1,
        "user":-1
    },
    3:{
        "ingredients":[[0,1],[1,1],[2,1],[3,1]],
        "name":"TesztFánk4",
        "rating":2,
        "user":0
    },
    4:{
        "ingredients":[[0,1],[1,1],[2,1],[3,1]],
        "name":"TesztFánk5",
        "rating":5.5,
        "user":1
    },
}


/*
var checkoutData = [
    
]
*/

var currentPrice = 0;

/*
összetevőId:[név, kép elérési útvonal, ár, z-index, típus]
típusok: alap, maz, toltelek, feltet -> (ebből több is lehet egyszerre, a többiből csak egy)
*/
/*
    típus-id:[típus-név, lehet-több]
*/

var ingredientTypes = {
    "alap":["Fánk alap",false,0],
    "maz":["Máz",false,1],
    "toltelek":["Töltelék",false,2],
    "feltet":["Feltétek",true,3]
};

var ingredientData = {
    0:["Fánk alap", "img/donut_base.png", 100, "alap"],
    1:["Cukormáz", "img/icing.png", 100, "maz"],
    2:["Csokis töltelék", "img/chocolate_filling.png", 50, "toltelek"],
    3:["Cukorkák", "img/sprinkles.png", 20, "feltet"],
    4:["Narancsos töltelék", "img/orange_filling.png", 40, "toltelek"],
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


if(!sessionStorage.getItem("checkout")){
    sessionStorage.setItem("checkout","[]");
}

if(!sessionStorage.getItem("editId")){
    sessionStorage.setItem("editId","{}");
}

if(!sessionStorage.getItem("editCheckoutIndex")){
    sessionStorage.setItem("editCheckoutIndex","-1");
}

