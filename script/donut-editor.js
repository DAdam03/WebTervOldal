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

var checkoutIndex = -1;

function saveDonut(){
    if(currentUser == -1){
        location.href = "login.php";
    }else{
        let curIngredients = [];
        let curIngredientIds = Object.keys(currentRecipe);
        for(let i=0; i<curIngredientIds.length; i++){
            curIngredients.push([curIngredientIds[i],currentRecipe[curIngredientIds[i]]]);
        }

        let nameInput = document.getElementById("donut-name");
        let curName = nameInput.value;

        let editId = JSON.parse(sessionStorage.getItem("editId"));

        let newLocation = "user_donuts.php?";
        if(curName.length != 0){
            newLocation+="name="+curName+"&";
        }
        newLocation+="ingredients="+JSON.stringify(curIngredients);
        if("id" in editId){
            newLocation+="&id="+String(editId["id"]);
        }

        sessionStorage.setItem("editId","{}");

        location.href = newLocation;
    }
}


function createIngredientInputs(){

    let editId = JSON.parse(sessionStorage.getItem("editId"));
    let editData = {};
    if(Object.keys(editId).length != 0){
        if("id" in editId){
            editData["ingredients"] = [];
            arrays = Object.values(donutData[Number(editId["id"])]["ingredients"]);
            for(let i=0; i<arrays.length; i++){
                editData["ingredients"].push(Object.values(arrays[i]));
            }
            editData["name"] = donutData[Number(editId["id"])]["name"];
            editData["amount"] = Number(editId["amount"]);
        }else{
            editData = editId;
        }
    }
    

    let ingredientContainer = document.getElementById("ingredient-container");

    let ingredientIds = Object.keys(ingredientData);
    let typeIds = Object.keys(ingredientTypes);

    for(let j=0; j<typeIds.length; j++){
        let typeDiv = document.createElement("div");
        
        let typeName = document.createElement("h2");
        typeName.innerText = ingredientTypes[typeIds[j]][0];
        typeDiv.appendChild(typeName);

        let firstIngredient = true; //az első összetevő kiválasztásához kell

        for(let i=0; i<ingredientIds.length; i++){
            if(ingredientData[ingredientIds[i]][3] == typeIds[j]){
                let ingredientInput = IngredientInput(Number(ingredientIds[i]));
                let canHaveMore = ingredientTypes[ingredientData[ingredientIds[i]][3]][1];
                if(!canHaveMore && firstIngredient){
                    firstIngredient = false;
                    let radio = ingredientInput.querySelector("#r_i_"+ingredientIds[i]);
                    if(Object.keys(editId).length == 0){
                        radio.checked = true;
                    
                        let imgContainerDiv = document.getElementById("image-container");
                        let imgLayer = DonutImgLayer(Number(ingredientIds[i]));
                        imgContainerDiv.appendChild(imgLayer);

                        currentRecipe[Number(ingredientIds[i])] = 1;
                        currentPrice += ingredientData[ingredientIds[i]][2];
                        
                        let fullPrice = document.getElementsByTagName("h3")[0];
                        fullPrice.innerText = "Ár: "+String(currentPrice)+" Ft";
                    }
                }
                if(Object.keys(editId).length != 0){
                    for(let k=0; k<editData["ingredients"].length; k++){
                        if(Number(ingredientIds[i]) == editData["ingredients"][k][0]){
                            if(canHaveMore){
                                let amountInput = ingredientInput.querySelector(".donut-amount-button");
                                amountInput.value = Number(editData["ingredients"][k][1]);
                                let radio = ingredientInput.querySelector("#ch_i_"+ingredientIds[i]);
                                radio.checked = true;
                            }else{
                                let radio = ingredientInput.querySelector("#r_i_"+ingredientIds[i]);
                                radio.checked = true;
                            }

                            let imgContainerDiv = document.getElementById("image-container");
                            let imgLayer = DonutImgLayer(Number(ingredientIds[i]));
                            imgContainerDiv.appendChild(imgLayer);

                            currentRecipe[Number(ingredientIds[i])] = 1;
                            currentPrice += ingredientData[ingredientIds[i]][2];
                            
                            let fullPrice = document.getElementsByTagName("h3")[0];
                            fullPrice.innerText = "Ár: "+String(currentPrice)+" Ft";

                            break;
                        }
                    }
                }
                typeDiv.appendChild(ingredientInput);
            }
        }

        ingredientContainer.appendChild(typeDiv);
    }

    if(Object.keys(editId).length != 0){
        let nameInput = document.getElementById("donut-name");
        nameInput.value = editData["name"];

        let amountInput = document.getElementById("buy-amount-button");
        amountInput.value = Number(editData["amount"]);
    }

    checkoutIndex = Number(sessionStorage.getItem("editCheckoutIndex"));
    sessionStorage.setItem("editCheckoutIndex","-1");
}

function donutBuyClicked(){
    let checkoutData = JSON.parse(sessionStorage.getItem("checkout"));

    let curIngredients = [];
    let curIngredientIds = Object.keys(currentRecipe);
    for(let i=0; i<curIngredientIds.length; i++){
        curIngredients.push([curIngredientIds[i],currentRecipe[curIngredientIds[i]]]);
    }

    let nameInput = document.getElementById("donut-name");
    let curName = nameInput.value;

    let amountInput = document.getElementById("buy-amount-button");
    let curAmount = amountInput.value;

    let curData = {
        "ingredients":curIngredients,
        "name":curName,
        "amount":curAmount
    };

    if(checkoutIndex == -1){
        checkoutData.push(curData);
    }else{
        checkoutData[checkoutIndex] = curData;
    }

    sessionStorage.setItem("editId","{}");
    sessionStorage.setItem("checkout",JSON.stringify(checkoutData));

    location.href = "checkout.php";
}


function ingredientAmountChanged(){
    let ingredientId = this.ingredientId;
    if(this.value > this.max){
        this.value = this.max;
    }else if(this.value < this.min){
        this.value = this.mim;
    }

    let newAmount = this.value;
    let inputDiv = this.parentElement;
    
    let priceSpan = inputDiv.getElementsByClassName("price-span")[0];
    priceSpan.innerText = String(newAmount*ingredientData[String(ingredientId)][2])+" Ft";

    if(ingredientId in currentRecipe){
        let oldAmount = currentRecipe[ingredientId];
        currentRecipe[ingredientId] = newAmount;

        let change = (newAmount - oldAmount)*ingredientData[String(ingredientId)][2];
        currentPrice += change;

        let fullPrice = document.getElementsByTagName("h3")[0];
        fullPrice.innerText = "Ár: "+String(currentPrice)+" Ft";
    }
}

function ingredientCheckChanged(){
    let ingredientId = this.ingredientId;

    let canHaveMore = ingredientTypes[ingredientData[String(ingredientId)][3]][1];

    let imgContainerDiv = document.getElementById("image-container");

    if(ingredientId in currentRecipe){
        let change = currentRecipe[ingredientId]*ingredientData[String(ingredientId)][2];
        delete currentRecipe[ingredientId];
        currentPrice -= change;
        
        let imgLayers = imgContainerDiv.getElementsByClassName("ingredient_"+String(ingredientId));
        for(let i=0; i<imgLayers.length; i++){
            imgLayers[imgLayers.length-i-1].remove();
        }
    }else{
        let inputDiv = this.parentElement;
        let amount = 1;
        let change = 0;
        if(canHaveMore){
            let amountInput = inputDiv.getElementsByClassName("donut-amount-button")[0];
            amount = amountInput.value;
        }else{
            let sibligNodes = this.parentElement.parentElement.childNodes;
            for(let i=0; i<sibligNodes.length; i++){
                if(sibligNodes[i].classList.contains("ingredient-input-div")){
                    let siblingIngredientId = sibligNodes[i].ingredientId;
                    if(siblingIngredientId in currentRecipe){
                        change -= ingredientData[String(siblingIngredientId)][2];
                        let imgLayers = imgContainerDiv.getElementsByClassName("ingredient_"+String(siblingIngredientId));
                        for(let i=0; i<imgLayers.length; i++){
                            imgLayers[imgLayers.length-i-1].remove();
                        }
                        delete currentRecipe[siblingIngredientId];
                    }
                }
            }
        }
        
        change += amount*ingredientData[String(ingredientId)][2];

        currentRecipe[ingredientId] = amount;

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
    inputDiv.ingredientId = ingredientId;

    let ingredientImg = DonutImgLayer(ingredientId);
    if(ingredientImg != null){
        inputDiv.appendChild(ingredientImg);
    }

    let canHaveMore = ingredientTypes[ingredientData[String(ingredientId)][3]][1];

    let checkbox = document.createElement("input");
    if(canHaveMore){
        checkbox.type = "checkbox";
        checkbox.id = "ch_i_"+String(ingredientId);
        checkbox.name = String(ingredientId);
    }else{
        checkbox.type = "radio";
        checkbox.id = "r_i_"+String(ingredientId);
        checkbox.name = ingredientData[String(ingredientId)][3];
    }
    
    checkbox.addEventListener("change",ingredientCheckChanged);
    checkbox.ingredientId = ingredientId;
    inputDiv.appendChild(checkbox);

    let label = document.createElement("label");
    label.for = "ch_i_"+String(ingredientId);
    if(String(ingredientId) in ingredientData){
        label.innerText = ingredientData[String(ingredientId)][0];
    }
    inputDiv.appendChild(label);

    let priceSpan = document.createElement("span");
    priceSpan.classList.add("price-span");
    if(String(ingredientId) in ingredientData){
        priceSpan.innerText = ingredientData[String(ingredientId)][2]+" Ft";
    }
    inputDiv.appendChild(priceSpan);

    if(canHaveMore){
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
    }
    

    return inputDiv;
}

