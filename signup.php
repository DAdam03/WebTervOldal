<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Octo Donut</title>

    <link rel="stylesheet" href="style/nyolcszog.css">
    <link rel="stylesheet" href="style/style.css">
    <link rel="stylesheet" href="style/login.css">
    <link rel="stylesheet" href="style/text_input_style.css">
    <link rel="stylesheet" href="style/profile_menu_style.css">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">

    <link rel="icon" href="img/favicon.png"/>

    <script src="https://kit.fontawesome.com/4455646216.js" crossorigin="anonymous"></script>

    <script src="script/profile-menu.js"></script>
</head>
<body>
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
            <div class="nav-button" onclick="location.href='donut_maker.php'">
                Fánk összeállító
            </div>
            <div class="nav-button" onclick="location.href='user_donuts.php'">
                Felhasználók fánkjai
            </div>
        </nav>
        <form class="nyolcszog">
            <div class="login-input-wrapper">
                <input name="username" id="username" type="text" placeholder="">
                <label for="username">Felhasználó név</label>
            </div>
            <div class="login-input-wrapper">
                <input name="email" id="email" type="email" placeholder="">
                <label for="email">E-mail</label>
            </div>
            <div class="login-input-wrapper">
                <input name="password" id="password" type="password" placeholder="">
                <label for="password">Jelszó</label>
            </div>
            <div class="login-input-wrapper">
                <input name="password2" id="password2" type="password" placeholder="">
                <label for="password2">Jelszó megerősítése</label>
            </div>
            <button class="nyolcszog" type="submit">Regisztrálás</button>
        </form>

        <p id="redirect">Már regisztráltál?<br>
            <a href="login.php">Bejelentkezés</a>
        </p>
    </main>

    <footer>
        <p>Octo Donut</p>
        <p>Készítette: Domokos Ádám, Nógrádi Adrián</p>
    </footer>
</body>
</html>
