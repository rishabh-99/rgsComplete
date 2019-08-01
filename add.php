<?php

//add.php

include('database_connection.php');

$data = array(
 ':name'  => $_POST['name'],
 ':pid' => $_POST['pid'],
 ':type' => $_POST['type'],
 ':fileC' => $_POST['fileC']
);
	$t=':type';
	$c='Folder';
if(strcmp($t, $c)==0){
$query = "
 INSERT INTO fileStructure (name, pid,type) VALUES (:name, :pid, :type)
";

$statement = $connect->prepare($query);

if($statement->execute($data))
{
 echo 'Folder Added';
}
}
else
{
	$query = "
 INSERT INTO fileStructure (name, pid,type,fileC) VALUES (:name, :pid, :type, :fileC)
";

$statement = $connect->prepare($query);

if($statement->execute($data))
{
 echo 'Category Added';
}
}


?>
