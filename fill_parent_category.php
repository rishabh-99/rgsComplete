<?php

//fill_parent_category.php

include('database_connection.php');

$query = "SELECT * FROM fileStructure where type='folder' ORDER BY name ASC ";

$statement = $connect->prepare($query);

$statement->execute();

$result = $statement->fetchAll();

$output = '<option value="0">Root Folder</option>';

foreach($result as $row)
{
 $output .= '<option value="'.$row["id"].'">'.$row["name"].'</option>';
}

echo $output;

?>
