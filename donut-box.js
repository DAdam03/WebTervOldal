/*
data felépítése
{
    "ingredients":összetevők,
    "name":"Fánk neve",
    "price":200,
    "rating": -1,
    "user":"Készítő neve"
}
*/

function createDonutBoxes(){
    console.log("xd");
    let donutBoxContainer = document.getElementById("donut-box-container");
    
    let testData = {
        "ingredients":[[0,1],[1,1],[2,1],[3,1]],
        "name":"TesztFánk",
        "price":400,
        "rating":-1,
        "user":""
    }

    for(let i=0; i<5; i++){
        let donutBox = DonutBox(testData);
        donutBoxContainer.appendChild(donutBox);
    }
}


function DonutBox(data){
    let donutBoxDiv = document.createElement("div");
    donutBoxDiv.classList.add("donut-box");
    donutBoxDiv.classList.add("nyolcszog");
    
    let imgContainerDiv = DonutImgContainer(data.ingredients);
    donutBoxDiv.appendChild(imgContainerDiv);

    let nameTag = document.createElement("h2");
    nameTag.innerText = data.name;
    donutBoxDiv.appendChild(nameTag);

    let priceTag = document.createElement("h3");
    nameTag.innerText = String(data.price)+" Ft";
    donutBoxDiv.appendChild(priceTag);

    let ingredientsP = document.createElement("p");
    let ingredientsText = "";

    if(data.ingredients.length > 0 && data.ingredients[0][0] in ingredientData){
        ingredientsText += ingredientData[data.ingredients[0][0]][0];
    }
    for(let i=1; i<data.ingredients.length; i++){
        if(data.ingredients[i][0] in ingredientData){
            if(ingredientsText.length != 0){
                ingredientsText += ", ";
            }

            ingredientsText += ingredientData[data.ingredients[i][0]][0];
            if(data.ingredients[i][1] > 1){
                ingredientsText += (" x"+data.ingredients[i][1]);
            }
        }
    }
    ingredientsP.innerText = ingredientsText;
    donutBoxDiv.appendChild(ingredientsP);

    let buyButton = document.createElement("button");
    buyButton.classList.add("buy-button");
    buyButton.innerText = "Kosárba";
    donutBoxDiv.appendChild(buyButton);

    let amountInput = document.createElement("input");
    amountInput.type = "number";
    amountInput.value = "1";
    amountInput.max = 999;
    amountInput.min = 1;
    amountInput.size = 3;
    amountInput.classList.add("donut-amount-button");
    donutBoxDiv.appendChild(amountInput);

    return donutBoxDiv;
}