
function createIngredientInputs(){
    let ingredientContainer = document.getElementById("ingredient-container");

    let ingredientIds = Object.keys(ingredientData);
    for(let i=0; i<ingredientIds.length; i++){
        let ingredientInput = IngredientInput(ingredientIds[i]);
        ingredientContainer.appendChild(ingredientInput);
    }


}





function IngredientInput(ingredientId){
    let inputDiv = document.createElement("div");
    inputDiv.classList.add("ingredient-input-div");

    let ingredientImg = DonutImgLayer(ingredientId);
    if(ingredientImg != null){
        inputDiv.appendChild(ingredientImg);
    }

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "ch_i_"+String(ingredientId);
    checkbox.name = String(ingredientId);
    inputDiv.appendChild(checkbox);

    let label = document.createElement("label");
    label.for = "ch_i_"+String(ingredientId);
    if(ingredientId in ingredientData){
        label.innerText = ingredientData[ingredientId][0];
    }
    inputDiv.appendChild(label);

    let priceSpan = document.createElement("span");
    priceSpan.classList.add("price-span");
    if(ingredientId in ingredientData){
        priceSpan.innerText = ingredientData[ingredientId][2]+" Ft";
    }
    inputDiv.appendChild(priceSpan);

    let amountInput = document.createElement("input");
    amountInput.type = "number";
    amountInput.value = "1";
    amountInput.max = 999;
    amountInput.min = 1;
    amountInput.size = 3;
    amountInput.classList.add("donut-amount-button");
    inputDiv.appendChild(amountInput);

    return inputDiv;
}

