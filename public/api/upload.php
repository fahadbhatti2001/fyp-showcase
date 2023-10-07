<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $target_dir = "images//";
    $original_file_name = $_FILES["fileToUpload"]["name"];
    $timestamp = time();
    $file_extension = strtolower(pathinfo($original_file_name, PATHINFO_EXTENSION));
    $new_file_name = $timestamp . "." . $file_extension;
    $target_file = $target_dir . $new_file_name;
    $uploadOk = 1;

    if ($uploadOk == 0) {
        echo "Sorry, your file was not uploaded.";
    } else {
        if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
            echo "The file " . htmlspecialchars($original_file_name) . " has been uploaded as " . htmlspecialchars($new_file_name) . ".";
        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    }
}
