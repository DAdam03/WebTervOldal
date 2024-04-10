<?php 
    session_start();
    if(!isset($_SESSION["user"])){
        header("Location: login.php");
    }

    include "file_functions.php";

    $user_data = load_json("jsonData/users.json");

    $c_user_data = [];
    foreach($user_data as $id => $u_data){
        $c_data = [];
        $c_data["name"] = $u_data["name"];
        $c_data["admin"] = $u_data["admin"];
        $c_user_data[(int)$id] = $c_data;
    }
    $client_user_data = json_encode($c_user_data, JSON_UNESCAPED_UNICODE | JSON_FORCE_OBJECT);

?>
<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Octo donut</title>

    <link rel="stylesheet" href="style/style.css">
    <link rel="stylesheet" href="style/nyolcszog.css">
    <link rel="stylesheet" href="style/profile.css">
    <link rel="stylesheet" href="style/donut_box_style.css">
    <link rel="stylesheet" href="style/profile_menu_style.css">

    <script src="script/globals.js"></script>
    <?php
        if(isset($_SESSION["user"])){
            $user_id = $_SESSION["user"]["id"];
            echo "<script>currentUser = Number('$user_id');</script>";
        }
        echo "<script>userData = JSON.parse('$client_user_data');</script>";
    ?>
    <script src="script/donut-box.js"></script>
    <script src="script/donut-image-container.js"></script>
    
    <script src="script/profile-menu.js"></script>

    <script src="https://kit.fontawesome.com/4455646216.js" crossorigin="anonymous"></script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">

    <link rel="icon" href="img/favicon.png"/>

</head>
<body onload="createUserDonutBoxes()">
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
                <?php
                    if(isset($_SESSION["user"]) && isset($_SESSION["user"]["data"]["admin"])){
                        echo '<a href="admin.php">Admin oldal</a>';
                    }
                ?>
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
        <h2>Saját adatok:</h2>
        <div id="profile-grid" class="nyolcszog">
            <label for="username">Felhasználó név: </label><br class="only-phone">
            <input type="text" value="Sanyí" id="username" name="username"><br class="only-phone">
            <label for="email">E-mail: </label><br class="only-phone">
            <input type="email" value="sanyiAló@freemail.hu" id="email" name="email"><br class="only-phone">
        </div>
        
        <h2>Saját fánkok:</h2>
        <div id="donut-box-container"></div>
        <button id="admin" class="nyolcszog" onclick="location.href='admin.php'">Admin felület</button>
        <button id="logout" class="nyolcszog" onclick="location.href='login.php'">Kijelentkezés</button>
        <button id="delete" class="nyolcszog" onclick="location.href='login.php'">Profil törlése</button>
    </main>

    <footer>
        <p>Octo Donut</p>
        <p>Készítette: Domokos Ádám, Nógrádi Adrián</p>
    </footer>
</body>
</html>
