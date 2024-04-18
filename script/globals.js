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

var donutData = {}


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

var ingredientTypes = {};

var ingredientData = {};


function getPriceByIngredients(ingredients){
    let price = 0;
    
    let index = Object.keys(ingredients);
    for(let i=0; i<index.length; i++){
        if(String(ingredients[i][0]) in ingredientData){
            price += ingredientData[String(ingredients[i][0])][2]*ingredients[i][1];
        }
    }
    
    return price;
}

function calculateRating(ratings){
    let avgRating = 0.0;
    userIds = Object.keys(ratings);
    for(let i=0; i<userIds.length; i++){
        avgRating += ratings[userIds[i]];
    }
    if(userIds.length > 0){
        avgRating /= userIds.length;
    }
    return avgRating;
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

