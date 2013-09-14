<?php

$mod = @explode(",", @$_GET['mod']);

$files = "";
for($i=0; $i<count($mod); $i++){
	$file = @file_get_contents("modules/".$mod[$i].".js");
	$file = @eregi_replace("\r\n", "", $file); 
	$file = @preg_replace ( "/\s(?=\s)/","\\1", $file);
	//$file = @addslashes($file);
	$file = @eregi_replace("'", "\'", $file);
	echo "_jsload_ && _jsload_('".$mod[$i]."', '".$file."'); \r\n";
}

?>