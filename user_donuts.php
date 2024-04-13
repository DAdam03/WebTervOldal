<?php 
    include "file_functions.php";

    session_start();

    $user_data = load_json("jsonData/users.json");
    $donut_data = load_json("jsonData/donuts.json");
    $ingredient_data = load_json("jsonData/ingredients.json");

    $c_ingredient_types = json_encode($ingredient_data["types"], JSON_UNESCAPED_UNICODE);
    $c_ingredient_data = json_encode($ingredient_data["data"], JSON_UNESCAPED_UNICODE | JSON_FORCE_OBJECT);


    if(isset($_GET["rate_id"]) && isset($_SESSION["user"]) && isset($donut_data[(string)$_GET["rate_id"]])){
        if($_SESSION["user"]["id"] != (string)$donut_data[(string)$_GET["rate_id"]]["user"]){
            if(isset($_GET["rating"])){
                $new_rating = max(min((int)$_GET["rating"],4),0)+1;
                if($donut_data[(string)$_GET["rate_id"]]["rating"] != -1){
                    if(isset($donut_data[(string)$_GET["rate_id"]]["rating"][(string)$_SESSION["user"]["id"]])){
                        //az adott felhasznalo mar pontozta ezt a fankot
                        $donut_data[(string)$_GET["rate_id"]]["rating"][(string)$_SESSION["user"]["id"]] = $new_rating;
                    }else{
                        //az adott felhasznalo meg nem pontozta ezt a fankot
                        //pontot kell adni a fank keszitojenek
                        $donut_data[(string)$_GET["rate_id"]]["rating"][(string)$_SESSION["user"]["id"]] = $new_rating;
                        //az ertekeles tizszereset kapja
                        $user_data[(string)$donut_data[(string)$_GET["rate_id"]]["user"]]["score"] += $new_rating*10;
                        store_json($user_data,"jsonData/users.json");
                    }
                    store_json($donut_data,"jsonData/donuts.json");
                }
                
            }
        }
    }

    if(isset($_GET["delete_donut_id"]) && isset($_SESSION["user"])){
        if(array_key_exists((string)$_GET["delete_donut_id"], $donut_data)){
            if($donut_data[(string)$_GET["delete_donut_id"]]["user"] == (int)$_SESSION["user"]["id"] || $_SESSION["user"]["data"]["admin"]){
                unset($donut_data[(string)$_GET["delete_donut_id"]]);
                store_json($donut_data,"jsonData/donuts.json");
                header("Location: user_donuts.php");
            }
        }
    }


    if(isset($_GET["ingredients"]) && isset($_SESSION["user"])){
        $donut_name = "Új fánk";
        if(isset($_GET["name"])){
            $donut_name = htmlspecialchars(trim($_GET["name"]));
        }
        
        $ingredients = json_decode($_GET["ingredients"],JSON_FORCE_OBJECT);
        $fixed_ingredients = [];
        for($i=0; $i<count($ingredients); $i++){
            if(array_key_exists((string)$ingredients[$i][0],$ingredient_data["data"])){
                $fixed_ingredients[] = $ingredients[$i];
            }
        }
        if(isset($_GET["id"]) && array_key_exists((string)$_GET["id"],$donut_data) && ($donut_data[(string)$_GET["id"]]["user"] == (int)$_SESSION["user"]["id"] || ($donut_data[(string)$_GET["id"]]["user"] == -1 && $_SESSION["user"]["data"]["admin"]))){
            $donut_data[(string)$_GET["id"]]["name"] = $donut_name;
            $donut_data[(string)$_GET["id"]]["ingredients"] = $fixed_ingredients;
        }else{
            $new_donut_id = 0;
            while(array_key_exists((string)$new_donut_id,$donut_data)){
                $new_donut_id++;
            }
            $new_donut_data = [];
            $new_donut_data["ingredients"] = $fixed_ingredients;
            $new_donut_data["name"] = $donut_name;
            $new_donut_data["rating"] = [];
            $new_donut_data["user"] = (int)$_SESSION["user"]["id"];
            $donut_data[$new_donut_id] = $new_donut_data;
        }
        store_json($donut_data,"jsonData/donuts.json");
        if($donut_data[(string)$_GET["id"]]["user"] == -1 && $_SESSION["user"]["data"]["admin"]){
            header("Location: index.php");
        }
        else{
            header("Location: user_donuts.php");
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

?>
<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="style/style.css">
    <link rel="stylesheet" href="style/nyolcszog.css">
    <link rel="stylesheet" href="style/donut_box_style.css">
    <link rel="stylesheet" href="style/profile_menu_style.css">

    <!--betűtípus betöltése-->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">

    <link rel="icon" href="img/favicon.png"/>

    <script src="script/globals.js"></script>
    <?php
        if(isset($_SESSION["user"])){
            $user_id = $_SESSION["user"]["id"];
            echo "<script>currentUser = Number('$user_id');</script>";
        }
        echo "<script>userData = JSON.parse('$client_user_data'); donutData = JSON.parse('$c_donut_data'); ingredientTypes = JSON.parse('$c_ingredient_types'); ingredientData = JSON.parse('$c_ingredient_data');</script>";
    ?>
    <script src="script/donut-image-container.js"></script>
    <script src="script/donut-box.js"></script>
    <script src="script/profile-menu.js"></script>

    <script src="https://kit.fontawesome.com/4455646216.js" crossorigin="anonymous"></script>
    
    <title>Octo Donut</title>
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
            <div class="nav-button selected">
                Felhasználók fánkjai
            </div>
        </nav>

        <div id="content">
            <div id="donut-box-container" class="flex-container">

            </div>
        </div>
    </main>
    <footer>
        <p>Octo Donut</p>
        <p>Készítette: Domokos Ádám, Nógrádi Adrián</p>
    </footer>
</body>
</html>
