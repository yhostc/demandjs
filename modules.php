<?php

$mod = @$_GET['m'];
if($mod){
	$mod = explode(",", $mod);
	$js = array();
	for($i=0; $i<count($mod); $i++){
		$s = @file_get_contents($mod[$i].".js");
		if($s){
			$s = str_replace("\r\n", '', $s); //清除换行符   
			$s = str_replace("\n", '', $s); //清除换行符   
			$s = str_replace("\t", '', $s); //清除制表符   			
			
			$js[] = "__jsload__('".$mod[$i]."', '".$s."')";
		}
	}
	echo implode(";\n", $js);
}

?>