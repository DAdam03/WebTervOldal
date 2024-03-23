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
    //console.log("xd");
    let donutBoxContainer = document.getElementById("donut-box-container");
    
    let testData = {
        "ingredients":[[0,1],[1,1],[2,1],[3,1]],
        "name":"TesztFánk",
        "rating":-1,
        "user":""
    }

    for(let i=0; i<5; i++){
        let donutBox = DonutBox(testData);
        donutBoxContainer.appendChild(donutBox);
    }
}

function createUserDonutBoxes(){
    let donutBoxContainer = document.getElementById("donut-box-container");
    
    let testData = {
        "ingredients":[[0,1],[1,1],[2,1],[3,1]],
        "name":"TesztFánk",
        "rating":3.5,
        "user":"TesztFelhasználó2"
    }

    for(let i=0; i<5; i++){
        let donutBox = DonutBox(testData);
        donutBoxContainer.appendChild(donutBox);
    }
}

function donutEditClicked(){
    location.href = "donut_maker.html";
}

function donutDeleteClicked(){
    let donutBoxDiv = this.parentElement;
    donutBoxDiv.remove();
}

function starMouseEntered(){
    let ratingDiv = this.parentElement;
    let starElements = ratingDiv.childNodes;
    for(let i=0; i<starElements.length; i++){
        if(starElements[i].classList.contains("fa-star")){
            if(starElements[i].index <= this.index){
                if(!(starElements[i].classList.contains("star-hovered"))){
                    starElements[i].classList.add("star-hovered");
                }
            }
        }
    }
}

function starMouseExited(){
    let ratingDiv = this.parentElement;
    let starElements = ratingDiv.childNodes;
    for(let i=0; i<starElements.length; i++){
        if(starElements[i].classList.contains("fa-star")){
            if(starElements[i].index <= this.index){
                if(starElements[i].classList.contains("star-hovered")){
                    starElements[i].classList.remove("star-hovered");
                }
            }
        }
    }
}

function starClicked(){
    let ratingDiv = this.parentElement;
    let starElements = ratingDiv.childNodes;
    for(let i=0; i<starElements.length; i++){
        if(starElements[i].classList.contains("fa-star")){
            if(starElements[i].index <= this.index){
                if(!starElements[i].classList.contains("star-selected")){
                    starElements[i].classList.add("star-selected");
                }
            }else{
                if(starElements[i].classList.contains("star-selected")){
                    starElements[i].classList.remove("star-selected");
                }
            }
        }
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
    let price = getPriceByIngredients(data.ingredients);
    priceTag.innerText = String(price)+" Ft";
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


    if(data.rating != -1 && currentUser["name"] != data.user){
        let ratingDiv = document.createElement("div");
        ratingDiv.classList.add("rating-container");
        donutBoxDiv.appendChild(ratingDiv);

        for(let i=0; i<5; i++){
            let starIcon = document.createElement("i");
            starIcon.classList.add("fa-solid");
            starIcon.classList.add("fa-star");
            starIcon.index = i;
            starIcon.addEventListener("mouseenter",starMouseEntered);
            starIcon.addEventListener("mouseleave",starMouseExited);
            starIcon.addEventListener("click",starClicked);
            ratingDiv.appendChild(starIcon);
        }
        let ratingSpan = document.createElement("span");
            ratingSpan.classList.add("rating-span");
            ratingSpan.innerText = String(data.rating);
            ratingDiv.appendChild(ratingSpan);

        
        let userNameTag = document.createElement("h4");
        userNameTag.innerText = data.user;
        donutBoxDiv.appendChild(userNameTag);
    }

    let buyButton = document.createElement("button");
    buyButton.classList.add("buy-button");
    /*adrian*/
    buyButton.classList.add("nyolcszog");
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

    let lnbreak = document.createElement("br");
    lnbreak.classList.add("only-desktop");
    donutBoxDiv.appendChild(lnbreak);

    let editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.title = "Fánk szerkesztése";

    let editIcon = document.createElement("i");
    editIcon.classList.add("fa-solid");
    editIcon.classList.add("fa-pen");
    editButton.appendChild(editIcon);
    
    editButton.addEventListener("click", donutEditClicked);
    donutBoxDiv.appendChild(editButton);

    if(data.user == currentUser.name || currentUser.admin){
        let lnbreak = document.createElement("br");
        donutBoxDiv.appendChild(lnbreak);

        let deleteInput = document.createElement("button");
        deleteInput.classList.add("delete-button");

        let deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid");
        deleteIcon.classList.add("fa-trash");
        deleteIcon.classList.add("fa-xs");

        deleteInput.appendChild(deleteIcon);
        deleteInput.addEventListener("click", donutDeleteClicked);
        donutBoxDiv.appendChild(deleteInput);
    }

    return donutBoxDiv;
}

function createCheckoutDonutBoxes(){
    let donutBoxContainer = document.getElementById("order-container");

    for(let i=0; i<checkoutData.length; i++){
        let donutBox = CheckoutDonutBox(checkoutData[i],i);
        donutBoxContainer.appendChild(donutBox);
        currentPrice += donutBox.price*checkoutData[donutBox.index]["amount"];
    }

    let priceSum = document.getElementById("price");
    priceSum.innerText = "Fizetendő összeg: "+String(currentPrice)+" Ft";
}


function CheckoutDonutAmountChanged(){
    let donutBoxDiv = event.target.parentElement;
    let oldAmount = checkoutData[donutBoxDiv.index]["amount"];
    let newAmount = event.target.value;
    checkoutData[donutBoxDiv.index]["amount"] = newAmount;
    if(newAmount > event.target.max){
        newAmount = event.target.max;
    }else if(newAmount < event.target.min){
        newAmount = event.target.min;
    }
    let priceTag = donutBoxDiv.getElementsByTagName("h3")[0];
    priceTag.innerText = String(newAmount*donutBoxDiv.price)+" Ft";

    currentPrice += (newAmount-oldAmount)*donutBoxDiv.price;
    
    let priceSum = document.getElementById("price");
    priceSum.innerText = "Fizetendő összeg: "+String(currentPrice)+" Ft";
}

function CheckoutDonutDeleted(){
    let donutBoxDiv = this.parentElement;
    let amount = checkoutData[donutBoxDiv.index]["amount"];
    
    currentPrice -= amount*donutBoxDiv.price;

    let priceSum = document.getElementById("price");
    priceSum.innerText = "Fizetendő összeg: "+String(currentPrice)+" Ft";

    let donutBoxContainer = document.getElementById("order-container");
    for(let i=0; i<donutBoxContainer.childNodes.length; i++){
        if(donutBoxContainer.childNodes[i].index > donutBoxDiv.index){
            donutBoxContainer.childNodes[i].index -= 1;
        }
    }

    checkoutData.splice(donutBoxDiv.index,1);

    donutBoxDiv.remove();
}


function CheckoutDonutBox(data,index){
    let donutBoxDiv = document.createElement("div");
    donutBoxDiv.classList.add("checkout-donut-box");

    donutBoxDiv.index = index;

    let imgContainerDiv = DonutImgContainer(data.ingredients);
    donutBoxDiv.appendChild(imgContainerDiv);

    let nameTag = document.createElement("h2");
    nameTag.innerText = data.name;
    donutBoxDiv.appendChild(nameTag);

    let priceTag = document.createElement("h3");
    let price = getPriceByIngredients(data.ingredients);
    donutBoxDiv.price = price;
    priceTag.innerText = String(price*data.amount)+" Ft";
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
    ingredientsP.classList.add("only-desktop");
    donutBoxDiv.appendChild(ingredientsP);

    let amountInput = document.createElement("input");
    amountInput.type = "number";
    amountInput.value = String(data.amount);
    amountInput.max = 999;
    amountInput.min = 1;
    amountInput.size = 3;
    amountInput.classList.add("donut-amount-button");

    amountInput.addEventListener("change",CheckoutDonutAmountChanged);

    donutBoxDiv.appendChild(amountInput);

    let editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.title = "Fánk szerkesztése";

    let editIcon = document.createElement("i");
    editIcon.classList.add("fa-solid");
    editIcon.classList.add("fa-pen");
    editButton.appendChild(editIcon);
    
    editButton.addEventListener("click", donutEditClicked);
    donutBoxDiv.appendChild(editButton);

    let deleteInput = document.createElement("button");
    deleteInput.classList.add("delete-button");
    //deleteInput.classList.add("nyolcszog");
    //deleteInput.innerText = "Törlés";

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid");
    deleteIcon.classList.add("fa-trash");
    deleteIcon.classList.add("fa-xs");

    deleteInput.appendChild(deleteIcon);
    deleteInput.addEventListener("click", CheckoutDonutDeleted);
    donutBoxDiv.appendChild(deleteInput);


    return donutBoxDiv;
}

