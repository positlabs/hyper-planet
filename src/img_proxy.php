<?php
    header('Content-Type: image/jpg');
		$pic = $_GET['pic'];
    if (isset($pic)) {
        echo file_get_contents($pic);
    }
?>

