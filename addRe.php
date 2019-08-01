<?php

//addRe.php
include('database_connection.php');

// getting the userID
$response = file_get_contents('http://localhost:8080/userId');
$JSONO=json_decode($response);


$reb= $JSONO[0]->userId;
$res=(int)$reb;

$data = array(
 ':names'  => $_POST['names']
);
	


	$query = "insert INTO reposDet (name,userId) VALUES (:names,'$res')";

$statement = $connect->prepare($query);


if($statement->execute($data))
{
 echo 'Repo Added';
}
else{
	echo "Error";
}



?>
