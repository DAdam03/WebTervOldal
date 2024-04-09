<?php

    function load_json($file_path){
        $data = null;

        $str_data = file_get_contents($file_path);
        $data = json_decode($str_data,true);
        
        return $data;
    }


    function store_json($data, $file_path){

        $str_data = json_encode($data);
        file_put_contents($file_path,$str_data);

    }

?>