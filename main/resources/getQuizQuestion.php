<?php

# Includes
require_once("../../config/main.inc.php");

# Retrieve and sanitize data
if (isset($_REQUEST['questionIds']) && !empty($_REQUEST['questionIds']))
{
    $questionIds = trim(json_encode($_REQUEST['questionIds']),"[]");
}

# Instantiate api class and make request
$api = new Api();
$api->setContentType("application/json");
$api->setAcceptType("application/json");

$response = $api->get("/data/material/questionBlueprint/$questionIds/");
echo $response;