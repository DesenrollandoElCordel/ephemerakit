<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$app->addBodyParsingMiddleware();

$app->post('/', function (Request $request, Response $response, $args) {
  
    $body = $request->getParsedBody();
    
    list($type, $png) = explode(';', $body['image']);
    list(, $png)      = explode(',', $png);
    $png = base64_decode($png);
    
    $filename = time();
    file_put_contents('../archives/'.$filename.'.png', $png);
    file_put_contents('../archives/'.$filename.'.json', json_encode($body['pliego']));
    
    $response->getBody()->write(json_encode($body['pliego']));
    
    return $response->withHeader('Content-type', 'application/json')
      ->withHeader('Access-Control-Allow-Origin', '*')
      ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
      ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});

$app->run();
