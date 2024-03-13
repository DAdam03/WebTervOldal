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
        if(ingredients[i][0] in ingredientData){
            let donutImg = document.createElement("img");
            
            donutImg.src = ingredientData[ingredients[i][0]][1];
            donutImg.alt = "osszetevo";
            
            imgContainerDiv.appendChild(donutImg);
        }
    }

    return imgContainerDiv;
}