<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="style/style.css">
    <link rel="stylesheet" href="style/text_input_style.css">
    <link rel="stylesheet" href="style/ingredient-box-style.css">
    <link rel="stylesheet" href="style/nyolcszog.css">
    <link rel="stylesheet" href="style/profile_menu_style.css">

    <!--betűtípus betöltése-->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">

    <link rel="icon" href="img/favicon.png"/>

    <script src="script/globals.js"></script>
    <script src="script/donut-image-container.js"></script>
    <script src="script/donut-editor.js"></script>
    <script src="script/profile-menu.js"></script>

    <script src="https://kit.fontawesome.com/4455646216.js" crossorigin="anonymous"></script>

    <title>Octo Donut</title>
</head>
<body onload="createIngredientInputs()">
    <div id="background-image"></div>
    <header class="only-desktop">
        <div id="logo" onclick="location.href='index.php'">
            <img src="img/logo.png" alt="logo">
        </div>
        <button id="checkout" onclick="location.href='checkout.php'"><i class="fa-solid fa-basket-shopping"></i></button>
        <div id="profile-container">
            <button id="profile" onclick="openMenu()"><i class="fa-solid fa-user fa-lg"></i></button>
            <div id="profileMenu" class="nyolcszog">
                <a href="profile.php">Saját profil</a>
                <a href="admin.php">Admin oldal</a>
                <a href="login.php">Kijelentkezés</a>
            </div>
        </div>
    </header>

    <main class="nyolcszog">

        <nav class="flex-container">
            <div id="nav-button-only-phone" class="only-phone">
                <div id="logo-phone" onclick="location.href='index.php'">
                    <img src="img/logo.png" alt="logo">
                </div>
                <button id="checkout-phone" onclick="location.href='checkout.php'"><i class="fa-solid fa-basket-shopping"></i></button>
                <button id="profile-phone" onclick="location.href='login.php'"><i class="fa-solid fa-user fa-lg"></i></button>
            </div>
            <div class="nav-button" onclick="location.href='index.php'">
                Fánk kínálat
            </div>
            <div class="nav-button selected">
                Fánk összeállító
            </div>
            <div class="nav-button" onclick="location.href='user_donuts.php'">
                Felhasználók fánkjai
            </div>
        </nav>

        <div id="content">
            <div class="flex-container">
                <div id="donut-ingredients">
                    <h2>Összetevők:</h2>
                    <div id="ingredient-container-container" class="nyolcszog"><!--ha itt ez nincs akkor elromlik a border, ha megjelenik a scrollbar, ami nem jó-->
                        <div id="ingredient-container">
    
                        </div>
                    </div>
                    <h3 class="only-desktop">Ár: 0 Ft</h3>
                </div>
                <div id="donut-image">
                    <h2>Elkészült fánk:</h2>
                    <div id="image-container" class="nyolcszog">
    
                    </div>
                </div>
            </div>
            <h3 class="only-phone">Ár: 0 Ft</h3>
            <div id="inputs">
                <button id="share-button" class="nyolcszog">Megosztás</button>
                <div id="name-input" class="login-input-wrapper">
                    <input type="text" id="donut-name" placeholder="">
                    <label for="donut-name">Fánk neve:</label>
                </div>
                <input id="buy-amount-button" type="number" min="1" max="999" value="1">
                <button id="buy-button" class="nyolcszog" onclick="donutBuyClicked()">Kosárba</button>
            </div>
        </div>
    </main>
    <footer>
        <p>Octo Donut</p>
        <p>Készítette: Domokos Ádám, Nógrádi Adrián</p>
    </footer>
</body>
</html>
