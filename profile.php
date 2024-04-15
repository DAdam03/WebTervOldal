<?php 
    session_start();
    if(!isset($_SESSION["user"])){
        header("Location: login.php");
    }

    include "file_functions.php";

    $req_points = 200;// ennyi pontonként van egy szint

    $user_data = load_json("jsonData/users.json");
    $donut_data = load_json("jsonData/donuts.json");
    $ingredient_data = load_json("jsonData/ingredients.json");

    $c_ingredient_types = json_encode($ingredient_data["types"], JSON_UNESCAPED_UNICODE);
    $c_ingredient_data = json_encode($ingredient_data["data"], JSON_UNESCAPED_UNICODE | JSON_FORCE_OBJECT);

    if(isset($_GET["delete_donut_id"]) && isset($_SESSION["user"])){
        if(array_key_exists((string)$_GET["delete_donut_id"], $donut_data)){
            if($donut_data[(string)$_GET["delete_donut_id"]]["user"] == (int)$_SESSION["user"]["id"] || $_SESSION["user"]["data"]["admin"]){
                unset($donut_data[(string)$_GET["delete_donut_id"]]);
                store_json($donut_data,"jsonData/donuts.json");
                header("Location: profile.php");
            }
        }
    }

    $c_donut_data = json_encode($donut_data, JSON_UNESCAPED_UNICODE | JSON_FORCE_OBJECT);
    
    $errors = [];

    if(isset($_POST["data-save"])){
        if(!isset($_POST["username"]) || trim($_POST["username"]) == ""){
            $errors[] = "username";
        }
        if(!isset($_POST["email"]) || trim($_POST["email"]) == ""){
            $errors[] = "email";
        }
        if(count($errors) == 0){
            $username = htmlspecialchars(trim($_POST["username"]));
            $email = htmlspecialchars(trim($_POST["email"]));

            $exists = FALSE;
            $email_exists = FALSE;
            foreach($user_data as $id => $u_data){
                if($id != (string)$_SESSION["user"]["id"]){
                    if($u_data["name"] == $username){
                        $exists = TRUE;
                    }
                    if($u_data["email"] == $email){
                        $email_exists = TRUE;
                    }
                }
            }
            if($exists){
                $errors[] = "username_used";
            }elseif($email_exists){
                $errors[] = "email_used";
            }else{
                $_SESSION["user"]["data"]["name"] = $username;
                $_SESSION["user"]["data"]["email"] = $email;

                $user_data[(string)$_SESSION["user"]["id"]] = $_SESSION["user"]["data"];
                store_json($user_data,"jsonData/users.json");
            }
        }
    }

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
        echo "<script>userData = JSON.parse('$client_user_data'); donutData = JSON.parse('$c_donut_data'); ingredientTypes = JSON.parse('$c_ingredient_types'); ingredientData = JSON.parse('$c_ingredient_data');</script>";
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
<body onload="createProfileDonutBoxes()">
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
        <h2>Saját adatok:</h2>
        <form id="profile-grid" class="nyolcszog" method="POST">
            <label for="username">Felhasználó név: </label><br class="only-phone">
            <?php
                echo '<input type="text" value="';
                if(isset($_SESSION["user"])){
                    echo $_SESSION["user"]["data"]["name"];
                }
                echo '" id="username" name="username"><br class="only-phone">';
            ?>
            <?php
                if(in_array("username",$errors)){
                    echo "<p id='error'>Töltsd ki a mezőt!</p><br>";
                }elseif(in_array("username_used",$errors)){
                    echo "<p id='error'>Ez a név már foglalt!</p><br>";
                }
            ?>
            <label for="email">E-mail: </label><br class="only-phone">
            <?php
                echo '<input type="email" value="';
                if(isset($_SESSION["user"])){
                    echo $_SESSION["user"]["data"]["email"];
                }
                echo '" id="email" name="email"><br class="only-phone">';
            ?>
            <?php
                if(in_array("email",$errors)){
                    echo "<p id='error'>Töltsd ki a mezőt!</p><br>";
                }elseif(in_array("email_used",$errors)){
                    echo "<p id='error'>Ez az email már foglalt!</p><br>";
                }
            ?>
            <button id="data-save" class="nyolcszog" name="data-save" type="submit">Mentés</button>
        </form>

        <h2>Szint:</h2>
        <div id="progress_conatiner">
            <span id="current_level">
                <?php
                    echo floor($_SESSION["user"]["data"]["score"] / $req_points) + 1;
                ?>
            </span>
            <div id="progress_bar_conatiner">
                <?php
                    $progress = $_SESSION["user"]["data"]["score"] % $req_points / $req_points * 100;
                    echo '<div id="progress_bar" style="width:' . $progress . '%"></div>';
                ?>
                
                
            </div>
            <span id="next_level">
                <?php
                    echo floor($_SESSION["user"]["data"]["score"] / $req_points) + 2;
                ?>
            </span>
        </div>
        <p id="progress_text">Következő szinthez szükséges pontok: 
            <span id="progress_text_point">
                <?php
                    echo $req_points - $_SESSION["user"]["data"]["score"] % $req_points;
                ?>
            </span>
        </div>
        
        <h2>Saját fánkok:</h2>
        <div id="donut-box-container"></div>
        <?php
            if(isset($_SESSION["user"]) && $_SESSION["user"]["data"]["admin"]){
                echo '<button id="admin" class="nyolcszog" onclick="location.href=';
                echo "'admin.php'";
                echo '">Admin felület</button>';
            }
        ?>
        
        
        <button id="logout" class="nyolcszog" onclick="location.href='login.php?logout=TRUE'">Kijelentkezés</button>

        <?php
            
            echo '<button id="delete" class="nyolcszog" onclick="location.href=';
            echo "'login.php?delete=";
            echo session_id();
            echo "'";
            echo '">Profil törlése</button>';
            
        ?>

    </main>

    <footer>
        <p>Octo Donut</p>
        <p>Készítette: Domokos Ádám, Nógrádi Adrián</p>
    </footer>
</body>
</html>
