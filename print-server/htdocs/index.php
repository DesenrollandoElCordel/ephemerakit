<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

require __DIR__ . '/../vendor/autoload.php';

$settings = json_decode(file_get_contents('../settings.json'));

$app = AppFactory::create();

$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();
$app->addErrorMiddleware(true, true, true);

$app->post('/', function (Request $request, Response $response, $args) {
    global $settings;
    $body = $request->getParsedBody();
    
    list($type, $png) = explode(';', $body['image']);
    list(, $png)      = explode(',', $png);
    $png = base64_decode($png);
    
    $filename = time();
    $archivesPath = realpath(getcwd() . '/../archives') . '/';
    $imagePath = $archivesPath.$filename.'.png';
    $jsonPath = $archivesPath.$filename.'.json';
    file_put_contents($imagePath, $png);
    file_put_contents($jsonPath, json_encode($body['pliego']));
    $lpCommand[] = "lp {$imagePath}";
    foreach( $settings->cups->lp->options as $option => $values ){
      foreach( $values as $value ){
        $lpCommand[] = "-{$option} {$value}";
      }
    }
    $lpCommand[] = "2>&1";
    $lpCommand = implode(' ', $lpCommand);
    exec($lpCommand, $output, $result_code);
    $output = [
      'output' => $output,
      'retval' => $result_code,
    ];
    $response->getBody()->write(json_encode($output));

    return $response->withHeader('Content-type', 'application/json');
});

$app->run();
