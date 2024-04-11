<?php 
    include "file_functions.php";

    session_start();

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
            echo "<script>userData = JSON.parse('$client_user_data');</script>";
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

                </div>
                <h2 id="price">Fizetendő összeg: 0 Ft</h2>
                <form id="checkout-form" class="nyolcszog">
                    <div class="login-input-wrapper">
                        <input type="text" id="name" name="name" placeholder="">
                        <label for="name">Név:</label>
                    </div>

                    <div class="login-input-wrapper">
                        <input type="email" id="e-mail" name="e-mail" placeholder="">
                        <label for="e-mail">E-mail cím:</label>
                    </div>

                    <div class="login-input-wrapper">
                        <input type="text" id="address" name="address" placeholder="">
                        <label for="address">Szállítási cím:</label>
                    </div>
                    

                    <p>Fizető eszköz:</p>
                    <input type="radio" id="cash" name="payment" checked>
                    <label for="cash">Készpénz</label><br>
                    
                    <input type="radio" id="card" name="payment">
                    <label for="card">Bankkártya</label><br>
                    

                    <button type="submit" id="order-send-button" class="nyolcszog">Rendelés küldése</button>
                </form>
            </div>
        </main>
        <footer>
            <p>Octo Donut</p>
            <p>Készítette: Domokos Ádám, Nógrádi Adrián</p>
        </footer>
    </body>
</html>
