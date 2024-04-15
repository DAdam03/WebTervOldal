<?php 
    include "file_functions.php";

    session_start();

    $user_data = load_json("jsonData/users.json");
    $donut_data = load_json("jsonData/donuts.json");
    $ingredient_data = load_json("jsonData/ingredients.json");
    $rewards = load_json("jsonData/rewards.json");

    $req_points = 200;// ennyi pontonként van egy szint

    $errors = [];
    if(isset($_GET["checkout-data"])){
        if(!isset($_GET["name"]) || trim($_GET["name"]) == ""){
            $errors[] = "name";
        }
        if(!isset($_GET["email"]) || trim($_GET["email"]) == ""){
            $errors[] = "email";
        }
        if(!isset($_GET["address"]) || trim($_GET["address"]) == ""){
            $errors[] = "address";
        }
        if(!isset($_GET["payment"])){
            $errors[] = "payment";
        }
        if(count($errors) == 0){

            $payment = $_GET["payment"];
            $name = htmlspecialchars(trim($_GET["name"]));
            $email = htmlspecialchars(trim($_GET["email"]));
            $address = htmlspecialchars(trim($_GET["address"]));

            $checkout_data = json_decode($_GET["checkout-data"]);
            $full_price = 0;
            for($i=0; $i<count($checkout_data); $i++){
                $donut_amount = (int)$checkout_data[$i][1];
                $donut_price = 0;
                for($j=0; $j<count($checkout_data[$i][0]); $j++){
                    if(isset($ingredient_data["data"][(string)$checkout_data[$i][0][$j][0]])){
                        $donut_price += (int)$ingredient_data["data"][(string)$checkout_data[$i][0][$j][0]]["2"]*(int)$checkout_data[$i][0][$j][1];
                    }
                }
                $full_price += $donut_price*$donut_amount;
            }

            $bonus_rewards = [];

            if($full_price > 0 && isset($_SESSION["user"])){

                $bonus_rewards = $_SESSION["user"]["data"]["uncollected_rewards"];
                $_SESSION["user"]["data"]["uncollected_rewards"] = [];
                $user_data[(string)$_SESSION["user"]["id"]]["uncollected_rewards"] = [];

                $old_level = (int)($_SESSION["user"]["data"]["score"]/$req_points);
                
                $_SESSION["user"]["data"]["score"] += 65;
                $user_data[(string)$_SESSION["user"]["id"]]["score"] += 65;

                $new_level = (int)($_SESSION["user"]["data"]["score"]/$req_points);

                for($i=$old_level; $i<$new_level; $i++){
                    if(isset($rewards[(string)$i])){
                        $_SESSION["user"]["data"]["uncollected_rewards"][] = $rewards[(string)$i];
                        $user_data[(string)$_SESSION["user"]["id"]]["uncollected_rewards"][] = $rewards[(string)$i];
                    }
                }

                store_json($user_data,"jsonData/users.json");
            }
            header("Location: checkout.php");
        }
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
    
        <link rel="stylesheet" href="style/style.css">
        <link rel="stylesheet" href="style/text_input_style.css">
        <link rel="stylesheet" href="style/donut_box_style.css">
        <link rel="stylesheet" href="style/nyolcszog.css">
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
    <body onload="createCheckoutDonutBoxes()">
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

            <div id="content">
                <h2>Kosár:</h2>
                <div id="order-container" class="nyolcszog">
                    <?php
                        if(isset($_SESSION["user"])){
                            for($i=0; $i<count($_SESSION["user"]["data"]["uncollected_rewards"]); $i++){
                                echo '<div class="bonus_reward"><img alt="bónusz ajándék" src="img/rewards/bonus_';
                                echo $i;
                                echo '.png class="bonus_reward_img"><p class="bonus_reward_name">';
                                echo $_SESSION["user"]["data"]["uncollected_rewards"][$i];
                                echo '</p></div>';
                            }
                        }
                    ?>
                </div>
                <h2 id="price">Fizetendő összeg: 0 Ft</h2>
                <div id="checkout-form" class="nyolcszog">
                    <div class="login-input-wrapper">
                        <?php
                            echo '<input type="text" value="';
                            if(isset($_SESSION["user"])){
                                echo $_SESSION["user"]["data"]["name"];
                            }
                            echo '" id="name" name="name" placeholder="">';
                        ?>
                        <label for="name">Név:</label>
                    </div>
                    <?php
                        if(in_array("name",$errors)){
                            echo "<p id='error'>Töltsd ki a mezőt!</p>";
                        }
                    ?>

                    <div class="login-input-wrapper">
                        <?php
                            echo '<input type="email" value="';
                            if(isset($_SESSION["user"])){
                                echo $_SESSION["user"]["data"]["email"];
                            }
                            echo '" id="e-mail" name="e-mail" placeholder="">';
                        ?>
                        <label for="e-mail">E-mail cím:</label>
                    </div>
                    <?php
                        if(in_array("email",$errors)){
                            echo "<p id='error'>Töltsd ki a mezőt!</p>";
                        }
                    ?>

                    <div class="login-input-wrapper">
                        <input type="text" id="address" name="address" placeholder="">
                        <label for="address">Szállítási cím:</label>
                    </div>
                    <?php
                        if(in_array("address",$errors)){
                            echo "<p id='error'>Töltsd ki a mezőt!</p>";
                        }
                    ?>
                    

                    <p>Fizető eszköz:</p>
                    <input type="radio" id="cash" name="payment" checked>
                    <label for="cash">Készpénz</label><br>
                    
                    <input type="radio" id="card" name="payment">
                    <label for="card">Bankkártya</label><br>
                    

                    <button id="order-send-button" class="nyolcszog" onclick="orderSend()">Rendelés küldése</button>
                </div>
            </div>
        </main>
        <footer>
            <p>Octo Donut</p>
            <p>Készítette: Domokos Ádám, Nógrádi Adrián</p>
        </footer>
    </body>
</html>
