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
    let donutBoxContainer = document.getElementById("donut-box-container");

    let donutIds = Object.keys(donutData);

    for(let i=0; i<donutIds.length; i++){
        if(donutData[donutIds[i]]["rating"] == -1){
            let donutBox = DonutBox(donutIds[i]);
            donutBoxContainer.appendChild(donutBox);
        }
    }
}

function ratingSort(idX,idY){
    let ratingX = calculateRating(donutData[idX]["rating"]);
    let ratingY = calculateRating(donutData[idY]["rating"]);
    if(ratingX < ratingY){
        return 1;
    }else if(ratingX > ratingY){
        return -1;
    }
    return 0;
}

function createUserDonutBoxes(){
    let donutBoxContainer = document.getElementById("donut-box-container");
    
    let donutIds = Object.keys(donutData);
    let sortedIds = [];

    for(let i=0; i<donutIds.length; i++){
        if(donutData[donutIds[i]]["rating"] != -1){
            sortedIds.push(donutIds[i]);
        }
    }

    sortedIds.sort(ratingSort);

    for(let i=0; i<sortedIds.length; i++){
        let donutBox = DonutBox(sortedIds[i]);
        donutBoxContainer.appendChild(donutBox);
    }
}

function createProfileDonutBoxes(){
    let donutBoxContainer = document.getElementById("donut-box-container");
    
    let donutIds = Object.keys(donutData);
    let sortedIds = [];

    for(let i=0; i<donutIds.length; i++){
        if(donutData[donutIds[i]]["rating"] != -1 && donutData[donutIds[i]]["user"] == currentUser){
            sortedIds.push(donutIds[i]);
        }
    }

    sortedIds.sort(ratingSort);

    for(let i=0; i<sortedIds.length; i++){
        let donutBox = DonutBox(sortedIds[i]);
        donutBoxContainer.appendChild(donutBox);
    }
}


function donutEditClicked(){
    let donutAmount = this.parentElement.querySelector(".donut-amount-button");
    let editData = {
        "id":this.parentElement.id,
        "amount":donutAmount.value,
    }
    sessionStorage.setItem("editId",JSON.stringify(editData));
    location.href = "donut_maker.php";
}

function donutDeleteClicked(){
    let donutBoxDiv = this.parentElement;
    donutBoxDiv.remove();

    let phpLocation = location.href.split("?")[0];
    let donutId = donutBoxDiv.id;

    location.href = phpLocation+"?delete_donut_id="+donutId;
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

    if(currentUser == -1){
        location.href = "login.php";
    }else{
        let phpLocation = location.href.split("?")[0];
        let donutId = ratingDiv.parentElement.id;
        location.href = phpLocation+"?rate_id="+donutId+"&rating="+this.index;
    }
}


function donutAmountChanged(){
    if(this.value > this.max){
        this.value = this.max;
    }else if(this.value < this.min){
        this.value = this.min;
    }
}


function donutBuyClicked(){
    let donutBoxDiv = this.parentElement;
    let donutAmountInput = donutBoxDiv.querySelector(".donut-amount-button");
    let donutId = donutBoxDiv.id;
    
    let checkoutData = JSON.parse(sessionStorage.getItem("checkout"));
    
    for(let i=0; i<checkoutData.length; i++){
        if("id" in checkoutData[i] && checkoutData[i]["id"] == donutId){
            checkoutData[i]["amount"] = Number(checkoutData[i]["amount"]);
            checkoutData[i]["amount"] += Number(donutAmountInput.value);
            sessionStorage.setItem("checkout",JSON.stringify(checkoutData));
            return;
        }
    }
    let newDonutData = {
        "id":donutId,
        "amount":donutAmountInput.value,
    };

    checkoutData.push(newDonutData);
    sessionStorage.setItem("checkout",JSON.stringify(checkoutData));

    location.href = "checkout.php";
}


function DonutBox(donutId){
    let data = donutData[donutId];
    let donutBoxDiv = document.createElement("div");
    donutBoxDiv.classList.add("donut-box");
    donutBoxDiv.classList.add("nyolcszog");

    donutBoxDiv.id = donutId;
    
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

    let ingredientIndex = Object.keys(data.ingredients); //ez muszaj mert a php osszekeveri az array-t es az object-et

    if(ingredientIndex.length > 0 && String(data.ingredients[0][0]) in ingredientData){
        ingredientsText += ingredientData[String(data.ingredients[0][0])][0];
    }
    for(let i=1; i<ingredientIndex.length; i++){
        if(String(data.ingredients[i][0]) in ingredientData){
            if(ingredientsText.length != 0){
                ingredientsText += ", ";
            }

            ingredientsText += ingredientData[String(data.ingredients[i][0])][0];
            if(data.ingredients[i][1] > 1){
                ingredientsText += (" x"+data.ingredients[i][1]);
            }
        }
    }
    ingredientsP.innerText = ingredientsText;
    donutBoxDiv.appendChild(ingredientsP);


    if(data.rating != -1){
        let ratingDiv = document.createElement("div");
        ratingDiv.classList.add("rating-container");
        donutBoxDiv.appendChild(ratingDiv);

        if(currentUser != data.user){
            let userRating = 0;
            if(String(currentUser) in data.rating){
                userRating = data.rating[String(currentUser)];
            }
            for(let i=0; i<5; i++){
                let starIcon = document.createElement("i");
                starIcon.classList.add("fa-solid");
                starIcon.classList.add("fa-star");
                starIcon.index = i;

                if(i<userRating){
                    starIcon.classList.add("star-selected");
                }

                starIcon.addEventListener("mouseenter",starMouseEntered);
                starIcon.addEventListener("mouseleave",starMouseExited);
                starIcon.addEventListener("click",starClicked);
                ratingDiv.appendChild(starIcon);
            }
        }
        let ratingbreak = document.createElement("br");
        ratingDiv.appendChild(ratingbreak)
        let ratingAmount = calculateRating(data.rating);
        let ratingSpan = document.createElement("span");
        ratingSpan.classList.add("rating-span");
        ratingSpan.innerText = "Pontok: "+String(Math.round(ratingAmount*10)/10);
        ratingDiv.appendChild(ratingSpan);

        
        let userNameTag = document.createElement("h4");
        userNameTag.innerText = userData[String(data.user)]["name"];
        donutBoxDiv.appendChild(userNameTag);
    }

    let buyButton = document.createElement("button");
    buyButton.classList.add("buy-button");
    /*adrian*/
    buyButton.classList.add("nyolcszog");
    buyButton.innerText = "Kosárba";
    buyButton.addEventListener("click",donutBuyClicked);
    donutBoxDiv.appendChild(buyButton);

    let amountInput = document.createElement("input");
    amountInput.type = "number";
    amountInput.value = "1";
    amountInput.max = 999;
    amountInput.min = 1;
    amountInput.size = 3;
    amountInput.classList.add("donut-amount-button");
    amountInput.addEventListener("change",donutAmountChanged);
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

    if(currentUser != -1 && (data.user == currentUser || userData[String(currentUser)].admin)){
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

    let checkoutData = JSON.parse(sessionStorage.getItem("checkout"));

    for(let i=0; i<checkoutData.length; i++){
        if("id" in checkoutData[i]){
            let data = {
                "ingredients":donutData[checkoutData[i]["id"]]["ingredients"],
                "name":donutData[checkoutData[i]["id"]]["name"],
                "amount":checkoutData[i]["amount"],
            };
            let donutBox = CheckoutDonutBox(data,i);
            donutBoxContainer.appendChild(donutBox);
            currentPrice += donutBox.price*checkoutData[donutBox.index]["amount"];
        }else{
            let donutBox = CheckoutDonutBox(checkoutData[i],i);
            donutBoxContainer.appendChild(donutBox);
            currentPrice += donutBox.price*checkoutData[donutBox.index]["amount"];
        }
    }

    let priceSum = document.getElementById("price");
    priceSum.innerText = "Fizetendő összeg: "+String(currentPrice)+" Ft";
}


function CheckoutDonutAmountChanged(){
    let checkoutData = JSON.parse(sessionStorage.getItem("checkout"));

    let donutBoxDiv = this.parentElement;
    let oldAmount = checkoutData[donutBoxDiv.index]["amount"];
    let newAmount = this.value;
    
    if(newAmount > this.max){
        newAmount = this.max;
    }else if(newAmount < this.min){
        newAmount = this.min;
    }
    checkoutData[donutBoxDiv.index]["amount"] = newAmount;

    sessionStorage.setItem("checkout",JSON.stringify(checkoutData));

    this.value = newAmount;
    let priceTag = donutBoxDiv.getElementsByTagName("h3")[0];
    priceTag.innerText = String(newAmount*donutBoxDiv.price)+" Ft";

    currentPrice += (newAmount-oldAmount)*donutBoxDiv.price;
    
    let priceSum = document.getElementById("price");
    priceSum.innerText = "Fizetendő összeg: "+String(currentPrice)+" Ft";
}


function checkoutDonutEditClicked(){
    let checkoutData = JSON.parse(sessionStorage.getItem("checkout"));
    let donutIndex = this.parentElement.index;
    sessionStorage.setItem("editCheckoutIndex",donutIndex);
    sessionStorage.setItem("editId",JSON.stringify(checkoutData[donutIndex]));
    location.href = "donut_maker.php";
}


function CheckoutDonutDeleted(){
    let checkoutData = JSON.parse(sessionStorage.getItem("checkout"));

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

    sessionStorage.setItem("checkout",JSON.stringify(checkoutData));

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

    let ingredientIndex = Object.keys(data.ingredients); //ez muszaj mert a php osszekeveri az array-t es az object-et

    if(ingredientIndex.length > 0 && String(data.ingredients[0][0]) in ingredientData){
        ingredientsText += ingredientData[String(data.ingredients[0][0])][0];
    }
    for(let i=1; i<ingredientIndex.length; i++){
        if(String(data.ingredients[i][0]) in ingredientData){
            if(ingredientsText.length != 0){
                ingredientsText += ", ";
            }

            ingredientsText += ingredientData[String(data.ingredients[i][0])][0];
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
    editButton.addEventListener("click", checkoutDonutEditClicked);

    let editIcon = document.createElement("i");
    editIcon.classList.add("fa-solid");
    editIcon.classList.add("fa-pen");
    editButton.appendChild(editIcon);
    
    //editButton.addEventListener("click", donutEditClicked);
    donutBoxDiv.appendChild(editButton);

    let deleteInput = document.createElement("button");
    deleteInput.classList.add("delete-button");

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid");
    deleteIcon.classList.add("fa-trash");
    deleteIcon.classList.add("fa-xs");

    deleteInput.appendChild(deleteIcon);
    deleteInput.addEventListener("click", CheckoutDonutDeleted);
    donutBoxDiv.appendChild(deleteInput);


    return donutBoxDiv;
}

