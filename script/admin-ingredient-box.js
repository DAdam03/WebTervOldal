

function createAdminIngredientBoxes(){
    let ingredientContainer = document.getElementById("admin-ingredient-container");
    let ingredientIds = Object.keys(ingredientData);

    for(let i=0; i<ingredientIds.length; i++){
        let ingredientBox = AdminIngredientBox(ingredientIds[i]);
        ingredientContainer.appendChild(ingredientBox);
    }
}

function newIngredientClicked(){
    let ingredientContainer = document.getElementById("admin-ingredient-container");
    let newIngredientId = 0;
    while(newIngredientId in ingredientData){
        newIngredientId++;
    }

    let newData = [
        "Új összetevő",
        "img/donut_base.png",
        100,
        "alap"
    ];

    ingredientData[newIngredientId] = newData;

    let ingredientBox = AdminIngredientBox(newIngredientId);
    ingredientContainer.appendChild(ingredientBox);
}


function ingredientDeleteClicked(){
    let ingredientId = this.ingredientId;

    //itt majd szólni kell a szervernek, hogy a fánkokból törölje ki ezt az összetevőt
    delete ingredientData[ingredientId];
    this.parentElement.remove();
}


function ingredientImageUploaded(){
    let files = this.files;

    if(files.length > 0){
        let src = URL.createObjectURL(files[0]);
        let imgTag = this.parentElement.querySelector("img");
        imgTag.src = src;
    }
}



function AdminIngredientBox(ingredientId){
    let adminIngredientDiv = document.createElement("div");
    adminIngredientDiv.classList.add("admin-ingredient-container");

    let nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.name = "donut_name";
    nameInput.value = ingredientData[ingredientId][0];
    adminIngredientDiv.appendChild(nameInput);

    let priceDiv = document.createElement("div");
    priceDiv.classList.add("price-div");

    let priceInput = document.createElement("input");
    priceInput.type = "number";
    priceInput.name = "donut_price";
    priceInput.value = String(ingredientData[ingredientId][2]);
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
    image.src = ingredientData[ingredientId][1];
    image.alt = ingredientData[ingredientId][0];
    imageDiv.appendChild(image);

    adminIngredientDiv.appendChild(imageDiv);

    let newImageLabel = document.createElement("label");
    newImageLabel.classList.add("nyolcszog");
    newImageLabel.htmlFor = String(ingredientId);
    newImageLabel.innerText = "Új kép megadása";

    adminIngredientDiv.appendChild(newImageLabel);

    let imageInput = document.createElement("input");
    imageInput.type = "file";
    imageInput.id = String(ingredientId);
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
        if(typeId[i] == ingredientData[ingredientId][3]){
            typeOption.selected = true;
        }
        typeSelect.appendChild(typeOption);
    }
    adminIngredientDiv.appendChild(typeSelect);


    let deleteInput = document.createElement("button");
    deleteInput.classList.add("delete-button");
    //deleteInput.classList.add("nyolcszog");
    //deleteInput.innerText = "Törlés";

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid");
    deleteIcon.classList.add("fa-trash");
    deleteIcon.classList.add("fa-xs");

    deleteInput.appendChild(deleteIcon);
    deleteInput.addEventListener("click", ingredientDeleteClicked);
    adminIngredientDiv.appendChild(deleteInput);

    /*
    let deleteDiv = document.createElement("div");
    deleteDiv.classList.add("nyolcszog");
    deleteDiv.classList.add("end");
    deleteDiv.addEventListener("click",ingredientDeleteClicked);
    deleteDiv.ingredientId = ingredientId;

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid");
    deleteIcon.classList.add("fa-trash");
    deleteIcon.classList.add("fa-xs");

    deleteDiv.appendChild(deleteIcon);

    adminIngredientDiv.appendChild(deleteDiv);
    */
    return adminIngredientDiv;
}


