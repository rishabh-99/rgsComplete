<?php
//fetch.php

include('database_connection.php');

$parent_category_id = 0;

$query = "SELECT * FROM tbl_category";

$statement = $connect->prepare($query);

$statement->execute();

$result = $statement->fetchAll();

foreach($result as $row)
{
 $data = get_node_data($parent_category_id, $connect);
}

echo json_encode(array_values($data));

function get_node_data($parent_category_id, $connect)
{
 $query = "SELECT * FROM tbl_category WHERE parent_category_id = '".$pid."'";

 $statement = $connect->prepare($query);
 $statement->execute();
 $result = $statement->fetchAll();
 $output = array();
 foreach($result as $row)
 {
  $sub_array = array();
  $sub_array['text'] = $row['name'];
  $sub_array['nodes'] = array_values(get_node_data($row['id'], $connect));
  $output[] = $sub_array;
 }
return $output;
}

?>













