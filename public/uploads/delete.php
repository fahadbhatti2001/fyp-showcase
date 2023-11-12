<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (isset($_REQUEST['filename'])) {
        $filename = $_REQUEST['filename'];
        $target_dir = "";
        $target_file = $target_dir . $filename;
        if (file_exists($target_file)) {
            if (unlink($target_file)) {
                echo json_encode(array("message" => "File $filename has been deleted."));
            } else {
                echo json_encode(array("message" => "Unable to delete $filename."));
            }
        } else {
            echo json_encode(array("message" => "File $filename not found."));
        }
    } else {
        echo json_encode(array("message" => "Please provide a 'filename' parameter to delete the file."));
    }
} else {
    echo json_encode(array("message" => "Invalid request method. Use DELETE to delete a file."));
}
