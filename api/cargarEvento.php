<?php

// ini_set("display_errors", 1);
// ini_set("track_errors", 1);
// ini_set("html_errors", 1);
// error_reporting(E_ALL);
// required headers
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

// include database and object files
include_once '../config/database.php';
include_once '../objects/loadeventos.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// prepare product object
$Loadeventos = new Loadeventos($db);

$data = json_decode(file_get_contents("php://input"));
// get id of product to be edited
$Loadeventos->numdoc = $data->numdoc;
$Loadeventos->open = $data->open;
$Loadeventos->rol = $data->rol;
$Loadeventos->orgs = $data->orgs;
$Loadeventos->ano = $data->ano;
$Loadeventos->mes = $data->mes;
$Loadeventos->Sala = $data->Sala;
// set product property values

if ($Loadeventos->authEventos()) {


// set response code - 200 ok
    http_response_code(200);

   
}

// if unable to update the product, tell the user
else {

// set response code - 503 service unavailable
    http_response_code(400);

    // tell the user
    //echo json_encode(array("message" =>"Error", "body" =>"El evento no ha sido cancelado","foot" =>"error"));
}
?>