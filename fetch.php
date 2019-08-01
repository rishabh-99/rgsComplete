<?php

//fetch.php

include('database_connection.php');

$pid = 0;

$query = "SELECT * FROM fileStructure";

$statement = $connect->prepare($query);

$statement->execute();

$result = $statement->fetchAll();

foreach($result as $row)
{
 $data = get_node_data($pid, $connect);
}

echo json_encode(array_values($data));

function get_node_data($pid, $connect)
{
 $query = "SELECT * FROM fileStructure WHERE pid = '".$pid."'";

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