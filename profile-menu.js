function openMenu() {
    let profileBtn = document.getElementById("profileMenu");
    if (profileBtn.style.display != "block") {
        profileBtn.style.display = "block";
    } else {
        profileBtn.style.display = "none";
    }
}