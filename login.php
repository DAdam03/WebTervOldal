<?php 
    include "file_functions.php";

    $user_data = load_json("jsonData/users.json");
    $donut_data = load_json("jsonData/donuts.json");
    $ingredient_data = load_json("jsonData/ingredients.json");

    $c_ingredient_types = json_encode($ingredient_data["types"], JSON_UNESCAPED_UNICODE);
    $c_ingredient_data = json_encode($ingredient_data["data"], JSON_UNESCAPED_UNICODE | JSON_FORCE_OBJECT);
    

    session_start();

    if(isset($_GET["logout"])){
        session_unset();
        session_destroy();

        session_start();
    }

    if(isset($_GET["delete"]) && $_GET["delete"] == session_id()){
        if(isset($_SESSION["user"])){
            // fankok torlese, ertekelesek torlese
            $new_donut_data = [];
            foreach($donut_data as $id => $data){
                if($data["user"] != $_SESSION["user"]){
                    if(isset($data["ratings"][(string)$_SESSION["user"]])){
                        unset($data["ratings"][(string)$_SESSION["user"]]);
                    }
                    $new_donut_data[$id] = $data;
                }
            }
            $donut_data = $new_donut_data;

            //profilkep torlese
            if(file_exists("img/profilePics/img_".(string)$_SESSION["user"]["id"].".png")){
                unlink("img/profilePics/img_".(string)$_SESSION["user"]["id"].".png");
            }

            store_json($donut_data, "jsonData/donuts.json");

            unset($user_data[(string)$_SESSION["user"]["id"]]);
            store_json($user_data,"jsonData/users.json");


            session_unset();
            session_destroy();

            session_start();
        }
    }

    $c_donut_data = json_encode($donut_data, JSON_UNESCAPED_UNICODE | JSON_FORCE_OBJECT);

    $c_user_data = [];
    foreach($user_data as $id => $u_data){
        $c_data = [];
        $c_data["name"] = $u_data["name"];
        $c_data["admin"] = $u_data["admin"];
        $c_user_data[(int)$id] = $c_data;
    }
    $client_user_data = json_encode($c_user_data, JSON_UNESCAPED_UNICODE | JSON_FORCE_OBJECT);

    $error = FALSE;

    if(isset($_POST["login"])){
        if(isset($_POST["username"])){
            $password = "";
            if(isset($_POST["password"])){
                $password = $_POST["password"];
            }
    
    
            foreach($user_data as $id => $u_data){
                if($u_data["name"] == $_POST["username"] && password_verify($password,$u_data["password"])){
                    session_unset();
                    session_destroy();
                    
                    session_start();
                    $_SESSION["user"] = ["id" => (int)$id, "data" => $u_data];
                    header("Location: profile.php");
                    break;
                }else{
                    $error = TRUE;
                }
            }
    
        }else{
            $error = TRUE;
        }
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
            echo "<script>currentUser = Number('$user_id');</script>";
        }
        echo "<script>userData = JSON.parse('$client_user_data'); donutData = JSON.parse('$c_donut_data'); ingredientTypes = JSON.parse('$c_ingredient_types'); ingredientData = JSON.parse('$c_ingredient_data');</script>";
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
            <div class="login-input-wrapper">
                <input name="password" id="password" type="password" placeholder="">
                <label for="password">Jelszó</label>
            </div>
            <?php
                if($error){
                    echo "<p id='error'>Hibás felhasználó név vagy jelszó</p>";
                }
            ?>
            <button class="nyolcszog" type="submit" name="login">Bejelentkezés</button>
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
