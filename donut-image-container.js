/*
ingredients felépítése:
[
    [összetevő1-id, összetevő1-mennyiség],
    [összetevő2-id, összetevő2-mennyiség],
    ...
]
*/
function DonutImgContainer(ingredients){
    let imgContainerDiv = document.createElement("div");
    imgContainerDiv.classList.add("donut-img-container");
    
    for(let i=0; i<ingredients.length; i++){
        let donutImg = DonutImgLayer(ingredients[i][0]);
        if(donutImg != null){
            imgContainerDiv.appendChild(donutImg);
        }
    }
    return imgContainerDiv;
}


function DonutImgLayer(ingredientId){
    if(ingredientId in ingredientData){
        let donutImg = document.createElement("img");
                
        donutImg.src = ingredientData[ingredientId][1];
        donutImg.alt = "osszetevo";
        donutImg.classList.add("ingredient_"+String(ingredientId));
        donutImg.style.zIndex = ingredientData[ingredientId][3];

        return donutImg;
    }
    return null;
}

