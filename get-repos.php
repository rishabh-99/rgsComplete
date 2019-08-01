<?php

//fill_parent_category.php

include('database_connection.php');

$query = "SELECT repoName FROM reposDet";

$statement = $connect->prepare($query);

$statement->execute();

$result = $statement->fetchAll();

$output = '<option value="0">select repos</option>';

foreach($result as $row)
{
 $output .= '<option value="'.$row["id"].'">'.$row["name"].'</option>';
}

echo $output;

?>
