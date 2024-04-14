<?php 

    include "file_functions.php";

    session_start();

    if(!isset($_SESSION["user"]) || !$_SESSION["user"]["data"]["admin"]){
        header("Location: login.php");
    }

    $user_data = load_json("jsonData/users.json");
    $donut_data = load_json("jsonData/donuts.json");
    $ingredient_data = load_json("jsonData/ingredients.json");


    $new_data = [];
    if(isset($_POST["ingredient_changes"])){
        if(isset($_POST["new_data"])){
            $new_data = json_decode($_POST["new_data"], JSON_FORCE_OBJECT);
            foreach($new_data as $ingredient_id => $i_data){
                if(isset($i_data["n"])){
                    $ingredient_data["data"][$ingredient_id]["0"] = $i_data["n"];
                }
                if(isset($i_data["i"])){
                    if($i_data["i"][1] == "_"){
                        if(isset($_FILES[$i_data["i"]])){
                            $img_path = "img/" . $_FILES[$i_data["i"]]["name"];
                            if(move_uploaded_file($_FILES[$i_data["i"]]["tmp_name"], $img_path)){
                                $ingredient_data["data"][$ingredient_id]["1"] = $img_path;
                            }
                        }
                    }else{
                        $ingredient_data["data"][$ingredient_id]["1"] = $i_data["i"];
                    }
                }
                if(isset($i_data["p"])){
                    $ingredient_data["data"][$ingredient_id]["2"] = $i_data["p"];
                }
                if(isset($i_data["t"])){
                    $ingredient_data["data"][$ingredient_id]["3"] = $i_data["t"];
                }
            }
        }
        if(isset($_POST["deleted_ids"])){
            $deleted_ids = json_decode($_POST["deleted_ids"]);
            for($i=0; $i<count($deleted_ids); $i++){
                unset($ingredient_data["data"][$deleted_ids[$i]]);
            }
            if(count($deleted_ids) > 0){
                foreach($donut_data as $id => $d_data){
                    $new_donut_ingredients = [];
                    foreach($d_data["ingredients"] as $i_index => $i_data){
                        if(isset($ingredient_data["data"][$i_data["0"]])){
                            $new_donut_ingredients[$i_index] = $i_data;
                        }
                    }
                    $donut_data[$id]["ingredients"] = $new_donut_ingredients;
                }
                store_json($donut_data,"jsonData/donuts.json");
            }
        }
        
        store_json($ingredient_data,"jsonData/ingredients.json");
    }

    $c_ingredient_types = json_encode($ingredient_data["types"], JSON_UNESCAPED_UNICODE);
    $c_ingredient_data = json_encode($ingredient_data["data"], JSON_UNESCAPED_UNICODE | JSON_FORCE_OBJECT);

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
    <title>Octo Donut</title>

    <link rel="stylesheet" href="style/style.css">
    <link rel="stylesheet" href="style/nyolcszog.css">
    <link rel="stylesheet" href="style/profile_menu_style.css">
    <link rel="stylesheet" href="style/donut_box_style.css">
    <link rel="stylesheet" href="style/admin.css">

    <script src="script/globals.js"></script>
    <?php
        if(isset($_SESSION["user"])){
            $user_id = $_SESSION["user"]["id"];
            echo "<script>currentUser = Number('$user_id');</script>";
        }
        echo "<script>userData = JSON.parse('$client_user_data'); donutData = JSON.parse('$c_donut_data'); ingredientTypes = JSON.parse('$c_ingredient_types'); ingredientData = JSON.parse('$c_ingredient_data');</script>";
    ?>
    <script src="script/donut-box.js"></script>
    <script src="script/admin-ingredient-box.js"></script>
    <script src="script/profile-menu.js"></script>

    <script src="https://kit.fontawesome.com/4455646216.js" crossorigin="anonymous"></script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">

    <link rel="icon" href="img/favicon.png"/>

</head>
<body onload="createAdminIngredientBoxes()">
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

        <div id="admin-ingredients" class="nyolcszog">

        </div>

        <button id="newIngredient" class="nyolcszog" onclick="newIngredientClicked()">Új hozzáadása</button>
        <button id="save-button" class="nyolcszog" onclick="ingredientSave()">Mentés</button>
    </main>

    <footer>
        <p>Octo Donut</p>
        <p>Készítette: Domokos Ádám, Nógrádi Adrián</p>
    </footer>

    
</body>
</html>