function openMenu() {
    let profileBtn = document.getElementById("profileMenu");
    if(currentUser != -1){
        if (profileBtn.style.display != "block") {
            profileBtn.style.display = "block";
        } else {
            profileBtn.style.display = "none";
        }
    }else{
        location.href = 'login.php';
    }
}