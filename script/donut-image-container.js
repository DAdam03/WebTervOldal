/*
ingredients felépítése:
[
    [összetevő1-id, összetevő1-mennyiség], 
    [összetevő2-id, összetevő2-mennyiség],
    ...
]

php miatt itt mar objectek vannak ugyanazokkal az indexekkel
*/
function DonutImgContainer(ingredients){
    let imgContainerDiv = document.createElement("div");
    imgContainerDiv.classList.add("donut-img-container");
    /*adrian*/
    imgContainerDiv.classList.add("nyolcszog");
    
    let ingredientIndex = Object.keys(ingredients); //ez muszaj mert a php osszekeveri az array-t es az object-et

    for(let i=0; i<ingredientIndex.length; i++){
        let donutImg = DonutImgLayer(ingredients[i][0]);
        if(donutImg != null){
            imgContainerDiv.appendChild(donutImg);
        }
    }
    return imgContainerDiv;
}


function DonutImgLayer(ingredientId){
    if(String(ingredientId) in ingredientData){
        let donutImg = document.createElement("img");
                
        donutImg.src = ingredientData[String(ingredientId)][1];
        donutImg.alt = "osszetevo";
        donutImg.classList.add("ingredient_"+String(ingredientId));
        donutImg.style.zIndex = ingredientTypes[ingredientData[String(ingredientId)][3]][2];

        return donutImg;
    }
    return null;
}

