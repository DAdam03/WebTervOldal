<?php 
    include "file_functions.php";

    $user_data = load_json("jsonData/users.json");

    if(isset($_POST["username"])){
        $password = "";
        if(isset($_POST["password"])){
            $password = $_POST["password"];
        }

        foreach($user_data as $id => $u_data){
            if($u_data["name"] == $_POST["username"] && password_verify($password,$u_data["name"])){
                session_start();
                $_SESSION["user"] = ["id" => $id, "data" => $u_data];
                break;
            }else{
                //hibas adatok
            }
        }

    }else{
        //nincs un
    }

?>
<!DOCTYPE html>
<html lang="en">
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

    <script src="script/globals.js"></script>
    <?php
        if(isset($_SESSION["user"])){
            $user_id = $_SESSION["user"]["id"];
            echo "<script>currentUser = '$user_id'; userData = '$user_data';</script>";
        }
    ?>
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
        <form action="profile.php" class="nyolcszog" method="POST">
            <div class="login-input-wrapper">
                <input name="username" id="username" type="text" placeholder="">
                <label for="username">Felhasználó név</label>
            </div>
            <div class="login-input-wrapper">
                <input name="password" id="password" type="password" placeholder="">
                <label for="password">Jelszó</label>
            </div>
            <p id="error">Hibás felhasználó név vagy jelszó</p>
            <button class="nyolcszog" type="submit">Bejelentkezés</button>
        </form>

        <p id="redirect">Még nem regisztráltál?<br>
            <a href="signup.php">Regisztráció</a>
        </p>
    </main>

    <footer>
        <p>Octo Donut</p>
        <p>Készítette: Domokos Ádám, Nógrádi Adrián</p>
    </footer>
</body>
</html>
