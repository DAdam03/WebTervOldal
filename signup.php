<?php 
    include "file_functions.php";

    $user_data = load_json("jsonData/users.json");

    session_start();

    $c_user_data = [];
    foreach($user_data as $id => $u_data){
        $c_data = [];
        $c_data["name"] = $u_data["name"];
        $c_data["admin"] = $u_data["admin"];
        $c_user_data[(int)$id] = $c_data;
    }
    $client_user_data = json_encode($c_user_data, JSON_UNESCAPED_UNICODE | JSON_FORCE_OBJECT);

    $errors = [];
    if(isset($_POST["login"])){
        if(!isset($_POST["username"]) || trim($_POST["username"]) == ""){
            $errors[] = "username";
        }
        if(!isset($_POST["email"]) || trim($_POST["email"]) == ""){
            $errors[] = "email";
        }
        if(!isset($_POST["password"]) || trim($_POST["password"]) == ""){
            $errors[] = "password";
        }
        if(!isset($_POST["password2"]) || (isset($_POST["password"]) && $_POST["password"] != $_POST["password2"])){
            $errors[] = "password2";
        }

        if(count($errors) == 0){
            $username = htmlspecialchars(trim($_POST["username"]));
            $password = htmlspecialchars(trim($_POST["password"]));
            $email = htmlspecialchars(trim($_POST["email"]));

            $exists = FALSE;
            $email_exists = FALSE;
            foreach($user_data as $id => $u_data){
                if($u_data["name"] == $username){
                    $exists = TRUE;
                }
                if($u_data["email"] == $email){
                    $email_exists = TRUE;
                }
            }
            if($exists){
                $errors[] = "username_used";
            }elseif($email_exists){
                $errors[] = "email_used";
            }else{
                $new_id = 0;
                while(array_key_exists((string) $new_id,$user_data)){
                    $new_id++;
                }
                $new_data = [];
                $new_data["name"] = $username;
                $new_data["password"] = password_hash($password, PASSWORD_DEFAULT);;
                $new_data["email"] = $email;
                $new_data["score"] = 0;
                $new_data["admin"] = FALSE;
                
                $user_data[(string) $new_id] = $new_data;

                store_json($user_data,"jsonData/users.json");

                session_unset();
                session_destroy();

                session_start();
                $_SESSION["user"] = ["id" => $new_id, "data" => $new_data];

                header("Location: profile.php");
            }
        }
    }

?>
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

    <script src="script/globals.js"></script>
    <?php
        if(isset($_SESSION["user"])){
            $user_id = $_SESSION["user"]["id"];
            echo "<script>currentUser = Number('$user_id');</script>";
        }
        echo "<script>userData = JSON.parse('$client_user_data');</script>";
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
                <?php
                    if(isset($_SESSION["user"]) && $_SESSION["user"]["data"]["admin"]){
                        echo '<a href="admin.php">Admin oldal</a>';
                    }
                ?>
                <a href="login.php?logout=TRUE">Kijelentkezés</a>
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
        <form class="nyolcszog" method="POST">
            <div class="login-input-wrapper">
                <input name="username" id="username" type="text" placeholder="">
                <label for="username">Felhasználó név</label>
            </div>
            <?php
                if(in_array("username",$errors)){
                    echo "<p id='error'>Töltsd ki a mezőt!</p>";
                }elseif(in_array("username_used",$errors)){
                    echo "<p id='error'>Ez a név már foglalt!</p>";
                }
            ?>
            <div class="login-input-wrapper">
                <input name="email" id="email" type="email" placeholder="">
                <label for="email">E-mail</label>
            </div>
            <?php
                if(in_array("email",$errors)){
                    echo "<p id='error'>Töltsd ki a mezőt!</p>";
                }elseif(in_array("email_used",$errors)){
                    echo "<p id='error'>Ez az email már foglalt!</p>";
                }
            ?>
            <div class="login-input-wrapper">
                <input name="password" id="password" type="password" placeholder="">
                <label for="password">Jelszó</label>
            </div>
            <?php
                if(in_array("password",$errors)){
                    echo "<p id='error'>Töltsd ki a mezőt!</p>";
                }
            ?>
            <div class="login-input-wrapper">
                <input name="password2" id="password2" type="password" placeholder="">
                <label for="password2">Jelszó megerősítése</label>
            </div>
            <?php
                if(in_array("password2",$errors)){
                    echo "<p id='error'>A két jelszó nem egyezik!</p>";             
                }
            ?>
            <button class="nyolcszog" type="submit" name="login">Regisztrálás</button>
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
