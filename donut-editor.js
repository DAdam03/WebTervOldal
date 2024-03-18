/*
recept felépítése:
{
    összetevőId:összetevőmennyiség;
    ...
}
*/
var currentRecipe = {

};
var currentPrice = 0;



function createIngredientInputs(){
    let ingredientContainer = document.getElementById("ingredient-container");

    let ingredientIds = Object.keys(ingredientData);

    for(let i=0; i<ingredientIds.length; i++){
        let ingredientInput = IngredientInput(ingredientIds[i]);
        ingredientContainer.appendChild(ingredientInput);
    }
}


function ingredientAmountChanged(){
    let ingredientId = event.target.ingredientId;
    //console.log(event);
    if(event.target.value > event.target.max){
        event.target.value = event.target.max;
    }else if(event.target.value < event.target.min){
        event.target.value = event.target.mim;
    }

    let newAmount = event.target.value;
    let inputDiv = event.target.parentElement;
    
    let priceSpan = inputDiv.getElementsByClassName("price-span")[0];
    //console.log(ingredientId);
    priceSpan.innerText = String(newAmount*ingredientData[ingredientId][2])+" Ft";

    //console.log(newAmount);

    if(ingredientId in currentRecipe){
        let oldAmount = currentRecipe[ingredientId];
        currentRecipe[ingredientId] = newAmount;

        let change = (newAmount - oldAmount)*ingredientData[ingredientId][2];
        currentPrice += change;

        let fullPrice = document.getElementsByTagName("h3")[0];
        fullPrice.innerText = "Ár: "+String(currentPrice)+" Ft";
    }
}

function ingredientCheckChanged(){
    let ingredientId = event.target.ingredientId;

    let imgContainerDiv = document.getElementById("image-container");

    if(ingredientId in currentRecipe){
        let change = currentRecipe[ingredientId]*ingredientData[ingredientId][2];
        delete currentRecipe[ingredientId];
        currentPrice -= change;
        
        let imgLayers = imgContainerDiv.getElementsByClassName("ingredient_"+String(ingredientId));
        for(let i=0; i<imgLayers.length; i++){
            imgLayers[imgLayers.length-i-1].remove();
        }
    }else{
        let inputDiv = event.target.parentElement;
        let amountInput = inputDiv.getElementsByClassName("donut-amount-button")[0];

        let amount = amountInput.value;
        let change = amount*ingredientData[ingredientId][2];

        currentRecipe[ingredientId] = amountInput.value;

        currentPrice += change;

        let imgLayer = DonutImgLayer(ingredientId);
        imgContainerDiv.appendChild(imgLayer);
    }

    let fullPrice = document.getElementsByTagName("h3")[0];
    fullPrice.innerText = "Ár: "+String(currentPrice)+" Ft";
}


function IngredientInput(ingredientId){
    let inputDiv = document.createElement("div");
    inputDiv.classList.add("ingredient-input-div");

    let ingredientImg = DonutImgLayer(ingredientId);
    if(ingredientImg != null){
        //ingredientImg.classList.add("nyolcszog");
        inputDiv.appendChild(ingredientImg);
    }

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "ch_i_"+String(ingredientId);
    checkbox.name = String(ingredientId);
    checkbox.addEventListener("change",ingredientCheckChanged);
    checkbox.ingredientId = ingredientId;
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

    amountInput.addEventListener("change",ingredientAmountChanged);
    amountInput.ingredientId = ingredientId;

    amountInput.classList.add("donut-amount-button");
    inputDiv.appendChild(amountInput);

    return inputDiv;
}

