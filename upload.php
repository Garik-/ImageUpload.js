<?php

/*
 * Image Upload script
 * https://github.com/Garik-/ImageUpload
 *
 * Copyright 2016, Gar|k
 * http://c0dedgarik.blogspot.ru/
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

function return_bytes($val) {
    $val = trim($val);
    $last = strtolower($val[strlen($val)-1]);
    switch($last) {
        // The 'G' modifier is available since PHP 5.1.0
        case 'g':
            $val *= 1024;
        case 'm':
            $val *= 1024;
        case 'k':
            $val *= 1024;
    }

    return $val;
}

define('MAX_FILE_SIZE', return_bytes(ini_get('upload_max_filesize'))); //in bytes


if(!empty($_FILES)) {
	$uploads_dir = dirname(__FILE__);


    if(is_array($_FILES['pictures']['error'])) {
    	foreach ($_FILES["pictures"]["error"] as $key => $error) {
    	    if (UPLOAD_ERR_OK == $error) {
    	        $tmp_name = $_FILES["pictures"]["tmp_name"][$key];
    	        $name = $_FILES["pictures"]["name"][$key];
    	        move_uploaded_file($tmp_name, $uploads_dir.DIRECTORY_SEPARATOR.$name);
    	    }
    	}
    }
    else {
        if(UPLOAD_ERR_OK == $_FILES["pictures"]["error"]) {
            $tmp_name = $_FILES["pictures"]["tmp_name"];
            $name = $_FILES["pictures"]["name"];
            move_uploaded_file($tmp_name, $uploads_dir.DIRECTORY_SEPARATOR.$name);
        }
    }
	exit('Files uploaded');
}
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Image upload</title>
 </head>
 <body>
<form enctype="multipart/form-data" action="" method="POST" id="upload_form">
    <!-- Поле MAX_FILE_SIZE должно быть указано до поля загрузки файла -->
    <input type="hidden" name="MAX_FILE_SIZE" value="<?php echo MAX_FILE_SIZE; ?>" />
    <!-- Название элемента input определяет имя в массиве $_FILES -->
    Отправить этот файл: <input name="pictures" type="file" multiple />
    <input type="submit" value="Send image" />
</form>

<script>
    function loadScript(src, callback) {
        var s,
            r,
            t;
        r = false;
        s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = src;
        s.onload = s.onreadystatechange = function() {
            //console.log( this.readyState ); //uncomment this line to see which ready states are called.
            if (!r && (!this.readyState || this.readyState == 'complete')) {
                r = true;
                callback();
            }
        };
        t = document.getElementsByTagName('script')[0];
        t.parentNode.insertBefore(s, t);
    }

    loadScript("js/image-upload.min.js", function() {
        ImageUpload(
            document.getElementById("upload_form"), {
                imageMaxWidth: 100,
                imageMaxHeight: 100,
                maxFileSize: document.querySelector("#upload_form input[name='MAX_FILE_SIZE']").value
            }
        );
    });
</script>
 </body>
 </html>