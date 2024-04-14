var oldIngredientData = JSON.parse(JSON.stringify(ingredientData));

function createAdminIngredientBoxes(){
    let ingredientContainer = document.getElementById("admin-ingredients");
    let ingredientIds = Object.keys(ingredientData);

    for(let i=0; i<ingredientIds.length; i++){
        let ingredientBox = AdminIngredientBox(Number(ingredientIds[i]));
        ingredientContainer.appendChild(ingredientBox);
    }
}

function ingredientSave(){
    let deleteIds = [];
    let newData = {};
    let newImages = [];

    let oldIds = Object.keys(oldIngredientData);
    for(let i=0; i<oldIds.length; i++){
        if(!(oldIds[i] in ingredientData)){
            deleteIds.push(oldIds[i]);
        }else{
            //0-n-nev 1-i-kep 2-p-ar 3-t-tipus
            let ingredientIndex = Object.keys(oldIngredientData[oldIds[i]])
            for(let j=0; j<ingredientIndex.length; j++){
                if(oldIngredientData[oldIds[i]][j] != ingredientData[oldIds[i]][j]){
                    if(!(oldIds[i] in newData)){
                        newData[oldIds[i]] = {};
                    }
                    switch(j){
                        case 0:
                            newData[oldIds[i]]["n"] = ingredientData[oldIds[i]][j]
                            break;
                        case 1:
                            newData[oldIds[i]]["i"] = "i_"+String(newImages.push(ingredientData[oldIds[i]][j])-1)
                            break;
                        case 2:
                            newData[oldIds[i]]["p"] = ingredientData[oldIds[i]][j]
                            break;
                        case 3:
                            newData[oldIds[i]]["t"] = ingredientData[oldIds[i]][j]
                            break;
                    }
                }
            }
        }
    }

    //console.log(sessionStorage.getItem("checkout"));

    let newIds = Object.keys(ingredientData);
    for(let i=0; i<newIds.length; i++){
        if(!(newIds[i] in oldIngredientData)){
            let newIngredientData = {
                "n":ingredientData[newIds[i]][0],
                "p":ingredientData[newIds[i]][2],
                "t":ingredientData[newIds[i]][3]
            };
            if(typeof ingredientData[newIds[i]][1] == "string"){
                newIngredientData["i"] = ingredientData[newIds[i]][1];
            }else{
                newIngredientData["i"] = "i_"+String(newImages.push(ingredientData[newIds[i]][1])-1);
            }
            newData[newIds[i]] = newIngredientData;
        }
    }

    let checkoutDataNew = JSON.parse(sessionStorage.getItem("checkout"));
    for(let i=0; i<checkoutDataNew.length; i++){
        if("ingredients" in checkoutDataNew[i]){
            let newCheckoutIngredients = []
            for(let j=0; j<checkoutDataNew[i]["ingredients"].length; j++){
                if(! deleteIds.includes(checkoutDataNew[i]["ingredients"][j][0])){
                        newCheckoutIngredients.push(checkoutDataNew[i]["ingredients"][j]);
                }
            }
            checkoutDataNew[i]["ingredients"] = newCheckoutIngredients;
        }
    }
    sessionStorage.setItem("checkout",JSON.stringify(checkoutDataNew));

    
    var formData = new FormData();
    
    formData.append("ingredient_changes","true");
    formData.append("new_data",JSON.stringify(newData));
    formData.append("deleted_ids",JSON.stringify(deleteIds));
    for(let i=0; i<newImages.length; i++){
        formData.append("i_"+String(i),newImages[i]);
    }

    fetch("admin.php", { method: 'POST', body: formData })
    .then(function (response) {
        return response.text();
    })
    .then(function (body) {
        //console.log(body);
        location.href = "admin.php";
    });
}




function newIngredientClicked(){
    let ingredientContainer = document.getElementById("admin-ingredients");
    let newIngredientId = 0;
    while(String(newIngredientId) in ingredientData){
        newIngredientId++;
    }

    let newData = [
        "Új összetevő",
        "img/donut_base.png",
        100,
        "alap"
    ];

    ingredientData[String(newIngredientId)] = newData;

    let ingredientBox = AdminIngredientBox(newIngredientId);
    ingredientContainer.appendChild(ingredientBox);
}


function ingredientDeleteClicked(){
    let ingredientId = this.parentElement.id;

    delete ingredientData[String(ingredientId)];
    this.parentElement.remove();
}


function ingredientImageUploaded(){
    let files = this.files;

    if(files.length > 0){
        let src = URL.createObjectURL(files[0]);
        let imgTag = this.parentElement.querySelector("img");
        imgTag.src = src;
        ingredientData[String(this.parentElement.id)][1] = files[0];
    }
}

function ingredientPriceChanged(){
    ingredientData[String(this.parentElement.parentElement.id)][2] = Number(this.value);
}

function ingredientTypeChanged(){
    let options = this.childNodes;
    for(let i=0; i<options.length; i++){
        if(options[i].selected){
            ingredientData[String(this.parentElement.id)][3] = options[i].value;
            break;
        }
    }
}

function ingredientNameChanged(){
    ingredientData[String(this.parentElement.id)][0] = this.value;
}


function AdminIngredientBox(ingredientId){
    let adminIngredientDiv = document.createElement("div");
    adminIngredientDiv.classList.add("admin-ingredient-container");
    adminIngredientDiv.id = ingredientId;

    let nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.name = "donut_name";
    nameInput.value = ingredientData[String(ingredientId)][0];
    nameInput.addEventListener("change",ingredientNameChanged);
    adminIngredientDiv.appendChild(nameInput);

    let priceDiv = document.createElement("div");
    priceDiv.classList.add("price-div");

    let priceInput = document.createElement("input");
    priceInput.type = "number";
    priceInput.name = "donut_price";
    priceInput.value = String(ingredientData[String(ingredientId)][2]);
    priceInput.addEventListener("change",ingredientPriceChanged);
    priceDiv.appendChild(priceInput);

    let priceSpan = document.createElement("span");
    priceSpan.innerText = "Ft";
    priceDiv.appendChild(priceSpan);

    adminIngredientDiv.appendChild(priceDiv);

    let imageDiv = document.createElement("div");
    imageDiv.classList.add("image");

    let imageSpan = document.createElement("span");
    imageSpan.innerText = "Mostani kép:";
    imageSpan.classList.add("only-desktop");
    imageDiv.appendChild(imageSpan);

    let image = document.createElement("img");
    image.src = ingredientData[String(ingredientId)][1];
    image.alt = ingredientData[String(ingredientId)][0];
    imageDiv.appendChild(image);

    adminIngredientDiv.appendChild(imageDiv);

    let newImageLabel = document.createElement("label");
    newImageLabel.classList.add("nyolcszog");
    newImageLabel.htmlFor = "img_input"+String(ingredientId);
    newImageLabel.innerText = "Új kép megadása";

    adminIngredientDiv.appendChild(newImageLabel);

    let imageInput = document.createElement("input");
    imageInput.type = "file";
    imageInput.id = "img_input"+String(ingredientId);
    imageInput.name = "donut_image";
    imageInput.accept = "image/*"
    imageInput.addEventListener("change",ingredientImageUploaded);

    adminIngredientDiv.appendChild(imageInput);

    let typeSelect = document.createElement("select");
    typeSelect.name = "donut_type"
    typeSelect.classList.add("donut-type-select");
    let typeId = Object.keys(ingredientTypes);
    for(let i=0; i<typeId.length; i++){
        let typeOption = document.createElement("option");
        typeOption.value = typeId[i];
        typeOption.innerText = ingredientTypes[typeId[i]][0];
        if(typeId[i] == ingredientData[String(ingredientId)][3]){
            typeOption.selected = true;
        }
        typeSelect.appendChild(typeOption);
    }
    typeSelect.addEventListener("change",ingredientTypeChanged);
    adminIngredientDiv.appendChild(typeSelect);


    let deleteInput = document.createElement("button");
    deleteInput.classList.add("delete-button");

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid");
    deleteIcon.classList.add("fa-trash");
    deleteIcon.classList.add("fa-xs");

    deleteInput.appendChild(deleteIcon);
    deleteInput.addEventListener("click", ingredientDeleteClicked);
    adminIngredientDiv.appendChild(deleteInput);

    return adminIngredientDiv;
}


