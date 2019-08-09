<?php
require 'config.php';
require 'Slim/Slim.php';
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");

\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();

$app->post('/login','login'); /* User login */
$app->post('/signup','signup'); /* User Signup  */
$app->post('/recupera','recupera'); /* Recupera Pass */
$app->post('/orgBusqueda','orgBusqueda'); /* Busqueda Org*/
$app->post('/llenarmultis','llenarmultis'); /* llenar multiselecc */
$app->post('/llenarmultisciru','llenarmultisciru'); /* llenar multiselecc cirujano*/ 
$app->post('/llenarmultisenf','llenarmultisenf'); /* llenar multiselecc enfermera*/
$app->post('/llenarmultisay','llenarmultisay'); /* llenar multiselecc ayudante*/
$app->post('/llenarmultisanes','llenarmultisanes'); /* llenar multiselecc anestesiologo*/
$app->post('/llenarmultisayanes','llenarmultisayanes'); /* llenar multiselecc ayudante anestesiologo*/
$app->post('/llenarubicacion','llenarubicacion'); /* llenar ubicaciones empresa*/
$app->post('/llenarconvenio','llenarconvenio'); /* llenar convenios evento*/
$app->post('/cargapaciente','cargapaciente'); /* carga paciente formulario modal*/
$app->post('/cargareventos','cargareventos'); /* carga eventos calendario y landing page mis eventos*/
$app->post('/cargarempresa','cargarempresa'); /* carga empresas en formularios de sistema*/
$app->post('/cargarciudad','cargarciudad'); /* carga ciudades en formularios de sistema*/
$app->post('/cargarvpa','cargarvpa'); /* carga informacion para form VPA*/


/*$app->get('/getFeed','getFeed'); User Feeds  */
/* $app->post('/feed','feed'); User Feeds  */
/* $app->post('/feedUpdate','feedUpdate'); /* User Feeds  */
/* $app->post('/feedDelete','feedDelete');  User Feeds  */
/*$app->post('/getImages', 'getImages');*/


$app->run();

/************************* USER LOGIN *************************************/
/* ### User login ### */
function login() {
    
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    
    try {
        
        //$username = $_POST["username"];
        //$password = $_POST["password"];
        $db = getDB();
        $userData ='';
        $sql = 
        "SELECT usu.idusuario, usu.idrol, usu.nombres, usu.apellidos, usu.correoelectronico, usu.usuario,emp.idempresa, emp.nombreempresa,usu.numerodocumento FROM usuario usu LEFT JOIN usuarioempresa ue ON usu.idusuario = ue.idusuario AND ue.estado = 1 LEFT JOIN empresa emp ON emp.idempresa = ue.idempresa AND emp.estado = 1 WHERE (usuario=:username or correoelectronico=:username) and contrasena=:password";
        $stmt = $db->prepare($sql);
        //$stmt->bindParam("username", $username, PDO::PARAM_STR);
        //$password=hash('sha256',$password);
        //$stmt->bindParam("password", $password, PDO::PARAM_STR);
        $stmt->bindParam("username", $data->username, PDO::PARAM_STR);
        $password=base64_encode($data->password);
        $stmt->bindParam("password", $password, PDO::PARAM_STR);
        $stmt->execute();
        $mainCount=$stmt->rowCount();
        $userData = $stmt->fetch(PDO::FETCH_OBJ);

        if(!empty($userData))
        {
            $user_id=$userData->user_id;
            $userData->token = apiToken($user_id);
        }
        $db = null;
		if($userData){
		    $userData = json_encode($userData); 
		    echo '{"userData": ' .$userData . $empresa.'}';
		} else {
		   echo '{"error":{"text":"Solicitud incorrecta en usuario y/o contraseña"}}';
		}

           
    }
    catch(PDOException $e) {
        echo '{"error":{"error controlado":'. $e->getMessage() .'}}';
    }
}


/* ### User registration ### */
function signup() {
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $email=$data->email;
    $name=$data->name;
    $username=$data->username;
    $password=$data->password;
    
    try {
        
        $username_check = preg_match('~^[A-Za-z0-9_]{3,20}$~i', $username);
        $email_check = preg_match('~^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.([a-zA-Z]{2,4})$~i', $email);
        $password_check = preg_match('~^[A-Za-z0-9!@#$%^&*()_]{6,20}$~i', $password);
        
        echo $email_check.'<br/>'.$email;
        
        if (strlen(trim($username))>0 && strlen(trim($password))>0 && strlen(trim($email))>0 && $email_check>0 && $username_check>0 && $password_check>0)
        {
            echo 'here';
            $db = getDB();
            $userData = '';
            $sql = "SELECT idusuario FROM usuario WHERE usuario=:username or correoelectronico=:email";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("username", $username,PDO::PARAM_STR);
            $stmt->bindParam("email", $email,PDO::PARAM_STR);
            $stmt->execute();
            $mainCount=$stmt->rowCount();
            $created=time();
            if($mainCount==0)
            {
                
                /*Inserting user values*/
                $sql1="INSERT INTO usuario(usuario,contrasena,correoelectronico,nombres)VALUES(:username,:password,:email,:name)";
                $stmt1 = $db->prepare($sql1);
                $stmt1->bindParam("username", $username,PDO::PARAM_STR);
                $password=hash('sha256',$data->password);
                $stmt1->bindParam("password", $password,PDO::PARAM_STR);
                $stmt1->bindParam("email", $email,PDO::PARAM_STR);
                $stmt1->bindParam("name", $name,PDO::PARAM_STR);
                $stmt1->execute();
                
                $userData=internalUserDetails($email);
                
            }
            
            $db = null;
         

            if($userData){
               $userData = json_encode($userData);
                echo '{"userData": ' .$userData . '}';
            } else {
               echo '{"error":{"text":"Enter valid data"}}';
            }

           
        }
        else{
            echo '{"error":{"text":"Enter valid data"}}';
        }
    }
    catch(PDOException $e) {
        echo '{"error":{"Error controlado 2":'. $e->getMessage() .'}}';
    }
}

function recupera() {
    
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    
    try {
        
        $db = getDB();
        $userData ='';
        $sql = "SELECT idusuario,nombres,contrasena, correoelectronico, usuario FROM usuario WHERE  (usuario=:username or correoelectronico=:username) ";
        $stmt = $db->prepare($sql);

        //$username=$_POST["username"];
        //$pass=$_POST["password"];
        //echo $username;
        //echo $pass;
        //$stmt->bindParam("username", $username, PDO::PARAM_STR);
        $stmt->bindParam("username", $data->username, PDO::PARAM_STR);
        $stmt->execute();
        $mainCount=$stmt->rowCount();
        $userData = $stmt->fetch(PDO::FETCH_OBJ);
        $nombre=$userData->nombres;
        $contra=$userData->contrasena;
        $email=$userData->correoelectronico;
        $user=$userData->usuario;

        $password=base64_decode($contra);
       

        include("class.phpmailer.php");
        include("class.smtp.php");
        $mail = new PHPMailer();
        $mail->IsSMTP();
        $mail->SMTPAuth = true;
        $mail->SMTPSecure = "ssl";
        $mail->Host = "smtp.gmail.com";
        $mail->Port = 465;
        $mail->Username = "nexgensoluciones.co@gmail.com";
        $mail->Password = "Nexgenadm1.";
        $mail->From = "nexgensoluciones.co@gmail.com";
        $mail->FromName = "HealthOps";
        $mail->Subject = "Recuperacion de su usuario y clave";
        $mail->AltBody = "Hola, te doy tu usuario y clave:.";
        $mail->MsgHTML("Hola ".$nombre.", te doy la bienvenida <br> Tu usuario es : <b>".$user."<b> <br> Tu contrase&ntildea es: <b>".$password."</b>.");
        $mail->AddAddress($email, $usuario);
        $mail->IsHTML(true);
        if(!$mail->Send()) 
        if(!empty($userData))
        {
            $user_id=$userData->user_id;
            $userData->token = apiToken($user_id);
        }
        
        $db = null;
         if($userData){
               $userData = json_encode($userData);
                echo '{"userData": ' .$userData . '}';
            } else {
               echo '{"error":{"text":"Bad request wrong username and password"}}';
            }
           
    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function orgBusqueda(){

    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    
    try {

        $db = getDB();
        $userDataOrg ='';
        $sql = "SELECT e.idempresa, e.nombreempresa FROM empresa e
        INNER JOIN  usuarioempresa u ON u.idempresa = e.idempresa AND u.estado = 1
        INNER JOIN  usuario us ON us.idusuario = u.idusuario
        WHERE (usuario=:username or correoelectronico=:username)";
        $stmt = $db->prepare($sql);
        //$username=$_POST["username"];
        //$pass=$_POST["password"];
        //echo $username;
        //echo $pass;
        //$stmt->bindParam("username", $username, PDO::PARAM_STR);
        $stmt->bindParam("username", $data->username, PDO::PARAM_STR);
        $stmt->execute();
        $mainCount=$stmt->rowCount();
        $userDataOrg = $stmt->fetchAll();

       

        echo $idOrg;
        echo $nomOrg;

      
        
        $db = null;
        if($userDataOrg){
               $userDataOrg = json_encode($userDataOrg);
                echo '{"userDataOrg": ' .$userDataOrg . '}';
            } 
        else{
               echo '{"error":{"text":"Bad request wrong username and password"}}';
        }
           
    }
    catch(PDOException $e) {
    echo '{"error":{"Error orgBusqueda":'. $e->getMessage() .'}}';
    }
}


function llenarmultis () {
    
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    
    try {
        
      

       $tabla = $data->tabla;
       $idempresa= $data->org;
       
        $db = getDB();
        $Data ='';
        $idempresa = $data->org;
        $sql = 
        "SELECT  * FROM {$tabla} WHERE idempresa = {$idempresa}";


        $stmt = $db->prepare($sql);
       
        $stmt->bindParam("tabla", $data->tabla, PDO::PARAM_STR);
        
        $stmt->execute();
        $mainCount=$stmt->rowCount();
        $Data = $stmt->fetchAll();
  
        $db = null;
         if($Data){
                $Data = json_encode($Data); 
                echo '{"'.$tabla.'": ' .$Data. '}';
            } else {
               echo '{"error":{"text":"Solicitud incorrecta en usuario y/o contraseña"}}';
            }

           
    }
    catch(PDOException $e) {
        echo '{"error":{"error controlado":'. $e->getMessage() .'}}';
    }
}

function llenarmultisciru () {
    
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    
    try {
        
      

       $whereci = $data->whereci;
       $org = $data->org;

        $db = getDB();
        $Data ='';

        $sql = 
        "SELECT DISTINCT p.idpersonal, p.nombres, p.apellidos,p.idtipopersonal,e.idempresa 
        FROM personal p 
        INNER JOIN empresa e ON e.idempresa = e.idempresa 
        INNER JOIN personalempresa u ON u.idempresa = e.idempresa and u.idpersonal = p.idpersonal 
        where p.idtipopersonal={$whereci} and u.idempresa={$org}";
        //echo $sql;

        $stmt = $db->prepare($sql);        
        $stmt->execute();
        $mainCount=$stmt->rowCount();
        $Data = $stmt->fetchAll();
  
        $db = null;
         if($Data){
                $Data = json_encode($Data); 
                echo '{"Datacirujano": ' .$Data. '}';
            } else {
               echo '{"error":{"text":"Solicitud incorrecta en usuario y/o contraseña"}}';
            }

           
    }
    catch(PDOException $e) {
        echo '{"error":{"error controlado":'. $e->getMessage() .'}}';
    }
}
function llenarmultisenf () {
    
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    
    
    try {
        
      
       $whereen = $data->whereen;
       $org = $data->org;

        $db = getDB();
        $Data ='';

        $sql = 
        "SELECT DISTINCT p.idpersonal, p.nombres, p.apellidos,p.idtipopersonal,e.idempresa 
        FROM personal p 
        INNER JOIN empresa e ON e.idempresa = e.idempresa 
        INNER JOIN personalempresa u ON u.idempresa = e.idempresa and u.idpersonal = p.idpersonal 
        where p.idtipopersonal={$whereen} and u.idempresa={$org}";
        //echo $sql;
        
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $mainCount=$stmt->rowCount();
        $Data = $stmt->fetchAll();
  
        $db = null;
         if($Data){
                $Data = json_encode($Data); 
                echo '{"Dataenfermera": ' .$Data. '}';
            } else {
               echo '{"error":{"text":"Solicitud incorrecta en usuario y/o contraseña"}}';
            }

           
    }
    catch(PDOException $e) {
        echo '{"error":{"error controlado":'. $e->getMessage() .'}}';
    }
}


function llenarmultisay () {
    
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    
    
    try {
        
      
      
       $whereay = $data->whereay;
       $org = $data->org;
       

        $db = getDB();
        $Data ='';
        $sql = 
        "SELECT DISTINCT p.idpersonal, p.nombres, p.apellidos,p.idtipopersonal,e.idempresa 
        FROM personal p 
        INNER JOIN empresa e ON e.idempresa = e.idempresa 
        INNER JOIN personalempresa u ON u.idempresa = e.idempresa and u.idpersonal = p.idpersonal 
        where p.idtipopersonal={$whereay} and u.idempresa={$org}";
        //echo $sql;
        
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $mainCount=$stmt->rowCount();
        $Data = $stmt->fetchAll();
  
        $db = null;
         if($Data){
                $Data = json_encode($Data); 
                echo '{"Dataayudante": ' .$Data. '}';
            } else {
               echo '{"error":{"text":"Solicitud incorrecta en usuario y/o contraseña"}}';
            }

           
    }
    catch(PDOException $e) {
        echo '{"error":{"error controlado":'. $e->getMessage() .'}}';
    }
}
function llenarmultisanes () {
    
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    
    try {
        
      
       $whereanes = $data->whereanes;
       $org = $data->org;
       

        $db = getDB();
        $Data ='';
        $sql = 
        "SELECT DISTINCT p.idpersonal, p.nombres, p.apellidos,p.idtipopersonal,e.idempresa 
        FROM personal p 
        INNER JOIN empresa e ON e.idempresa = e.idempresa 
        INNER JOIN personalempresa u ON u.idempresa = e.idempresa and u.idpersonal = p.idpersonal 
        where p.idtipopersonal={$whereanes} and u.idempresa={$org}";
        //echo $sql;
        
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $mainCount=$stmt->rowCount();
        $Data = $stmt->fetchAll();
  
        $db = null;
         if($Data){
                $Data = json_encode($Data); 
                echo '{"Dataanestesiologo": ' .$Data. '}';
            } else {
               echo '{"error":{"text":"Solicitud incorrecta en usuario y/o contraseña"}}';
            }

           
    }
    catch(PDOException $e) {
        echo '{"error":{"error controlado":'. $e->getMessage() .'}}';
    }
}


function llenarmultisayanes () {
    
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    
    
    try {
        
     
       $whereayanes = $data->whereayanes;
       $org = $data->org;
      

        $db = getDB();
        $Data ='';
        $sql = 
        "SELECT DISTINCT p.idpersonal, p.nombres, p.apellidos,p.idtipopersonal,e.idempresa 
        FROM personal p 
        INNER JOIN empresa e ON e.idempresa = e.idempresa 
        INNER JOIN personalempresa u ON u.idempresa = e.idempresa and u.idpersonal = p.idpersonal 
        where p.idtipopersonal={$whereayanes} and u.idempresa={$org}";
        //echo $sql;
        
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $mainCount=$stmt->rowCount();
        $Data = $stmt->fetchAll();
  
        $db = null;
         if($Data){
                $Data = json_encode($Data); 
                echo '{"Dataayuanestesia": ' .$Data. '}';
            } else {
               echo '{"error":{"text":"Solicitud incorrecta en usuario y/o contraseña"}}';
            }

           
    }
    catch(PDOException $e) {
        echo '{"error":{"error controlado":'. $e->getMessage() .'}}';
    }
}

function llenarubicacion () {
    
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    
    try {
       
       $empresa = $data->orgs;
       

        $db = getDB();
        $Data ='';
        $sql = 
        "SELECT  idespaciofisico, nombre FROM espaciofisico WHERE idempresa = {$empresa}";
        
        //echo $sql;
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $mainCount=$stmt->rowCount();
        $Data = $stmt->fetchAll();
  
        $db = null;
         if($Data){
                $Data = json_encode($Data); 
                echo '{"ubicacion": ' .$Data. '}';
            } else {
               echo '{"error":{"text":"Solicitud incorrecta en usuario y/o contraseña"}}';
            }

           
    }
    catch(PDOException $e) {
        echo '{"error":{"error controlado":'. $e->getMessage() .'}}';
    }
}

function llenarconvenio () {
    
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    
    try {
    
        $db = getDB();
        $empresa = $data->org;
        $Data ='';
        $sql = 
        "SELECT  idconvenio,nombreconvenio from convenio WHERE idempresa = {$empresa}";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $mainCount=$stmt->rowCount();
        $Data = $stmt->fetchAll();
  
        $db = null;
         if($Data){
                $Data = json_encode($Data); 
                echo '{"convenio": ' .$Data. '}';
            } else {
               echo '{"error":{"text":"Solicitud incorrecta en usuario y/o contraseña"}}';
            }

           
    }
    catch(PDOException $e) {
        echo '{"error":{"error controlado":'. $e->getMessage() .'}}';
    }
}




function cargapaciente () {
    
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $idempresa = $data->org;
    
    try {
        
     

       //$cedula=$_POST["numcedula"];
       //$tipodocumento=$_POST["tipodocumento"];
       $cedula = $data->pacinumero;
       $tipodocumento = $data->pacitipo;
       //echo $tabla;
       //echo $cedula;
        $db = getDB();
        $Data ='';
        $sql = 
        "SELECT idpaciente, nombres, apellidos, fechanacimineto, sexo, direccion, telefono, tipodocumento, numerodocumento, tiposangre, alergias FROM paciente WHERE numerodocumento={$cedula} AND tipodocumento = '{$tipodocumento}' AND idempresa={$idempresa} AND estado = 1";
        $stmt = $db->prepare($sql);
        //$stmt->bindParam("username", $username, PDO::PARAM_STR);
        //$password=hash('sha256',$password);
        //$stmt->bindParam("password", $password, PDO::PARAM_STR);
        //$stmt->bindParam("tabla", $tabla, PDO::PARAM_STR);
        $stmt->bindParam("tabla", $data->tabla, PDO::PARAM_STR);
        
        $stmt->execute();
        $mainCount=$stmt->rowCount();
        $Data = $stmt->fetch(PDO::FETCH_OBJ);
  
  
        $db = null;
         if($Data){
                $Data = json_encode($Data); 
                echo '{"Paciente": ' .$Data. '}';
            } else {
               echo '{"error":{"text":"Solicitud incorrecta en usuario y/o contraseña"}}';
            }

           
    }
    catch(PDOException $e) {
        echo '{"error":{"error controlado":'. $e->getMessage() .'}}';
    }
}


function cargareventos () {
    
$request = \Slim\Slim::getInstance()->request();
$data = json_decode($request->getBody());
    
try 
{

    $db = getDB();
    $Data ='';

    if (!$data->mes) 
    {
        if ($data->rol != 3) 
        {
            if ($data->Sala =='') 
            {
                $sql = "SELECT 
                es.idespaciofisico,
                es.nombre AS espaciofisico,
                pa.idpaciente,
                CONCAT(pa.tipodocumento,':',pa.numerodocumento) AS ccpaciente, 
                CONCAT(pa.nombres,' ',pa.apellidos) AS paciente, 
                DATE_FORMAT(ev.fecha,'%Y/%m/%d %H:%i:%s') AS fechaevento, 
                DATE_FORMAT(ev.fechahorainicio,'%Y/%m/%d %H:%i:%s') AS fechahorainicio, 
                DATE_FORMAT(ev.fechahorafin,'%Y/%m/%d %H:%i:%s') AS fechahorafin,
                ev.estado,
                ev.idevento,
                ev.idconvenio,
                ev.diagnostico,
                ev.tel_acompanante,
                ev.req_adicionales,
                ev.pro_vpa ,
                (SELECT GROUP_CONCAT(mp.nombre) FROM eventodetalle ed
                INNER JOIN masterprocedimiento mp ON ed.idprocedimiento = mp.idmasterprocedimiento
                WHERE ed.idevento = ev.idevento AND ed.estado = 1 ) AS procedimientos,
                (SELECT GROUP_CONCAT(CONCAT(p.nombres,p.apellidos)) FROM eventocirujano ec
                INNER JOIN personal p ON ec.cirujano = p.idpersonal
                WHERE ec.idevento = ev.idevento AND ec.estado = 1 ) AS cirujanos
                FROM evento ev 
                INNER JOIN espaciofisico es ON ev.idespaciofisico=es.idespaciofisico 
                LEFT JOIN paciente pa ON ev.idpaciente=pa.idpaciente 
                WHERE ev.idempresa = {$data->orgs}";
              //  echo "Consulta1 : ".$sql;
            } 
            else 
            {
                $sql =
                "SELECT 
                es.idespaciofisico,
                es.nombre AS espaciofisico,
                pa.idpaciente,
                CONCAT(pa.tipodocumento,':',pa.numerodocumento) AS ccpaciente, 
                CONCAT(pa.nombres,' ',pa.apellidos) AS paciente, 
                DATE_FORMAT(ev.fecha,'%Y/%m/%d %H:%i:%s') AS fechaevento, 
                DATE_FORMAT(ev.fechahorainicio,'%Y/%m/%d %H:%i:%s') AS fechahorainicio, 
                DATE_FORMAT(ev.fechahorafin,'%Y/%m/%d %H:%i:%s') AS fechahorafin,
                ev.estado,
                ev.idevento,
                ev.idconvenio,
                ev.diagnostico,
                ev.tel_acompanante,
                ev.req_adicionales,
                ev.pro_vpa ,
                (SELECT GROUP_CONCAT(mp.nombre) FROM eventodetalle ed
                INNER JOIN masterprocedimiento mp ON ed.idprocedimiento = mp.idmasterprocedimiento
                WHERE ed.idevento = ev.idevento AND ed.estado = 1 ) AS procedimientos,
                (SELECT GROUP_CONCAT(CONCAT(p.nombres,p.apellidos)) FROM eventocirujano ec
                INNER JOIN personal p ON ec.cirujano = p.idpersonal
                WHERE ec.idevento = ev.idevento AND ec.estado = 1 ) AS cirujanos
                FROM evento ev 
                INNER JOIN espaciofisico es ON ev.idespaciofisico=es.idespaciofisico 
                LEFT JOIN paciente pa ON ev.idpaciente=pa.idpaciente 
                WHERE ev.idespaciofisico={$data->Sala} and ev.idempresa = {$data->orgs}";
              // echo "Consulta2 : ".$sql;
            }
        } 
        else 
        {
            if ($data->Sala =='') 
            {
                $sql = "SELECT DISTINCT
                es.idespaciofisico,
                es.nombre AS espaciofisico,
                pa.idpaciente,
                CONCAT(pa.tipodocumento,':',pa.numerodocumento) AS ccpaciente, 
                CONCAT(pa.nombres,' ',pa.apellidos) AS paciente, 
                DATE_FORMAT(ev.fecha,'%Y/%m/%d %H:%i:%s') AS fechaevento, 
                DATE_FORMAT(ev.fechahorainicio,'%Y/%m/%d %H:%i:%s') AS fechahorainicio, 
                DATE_FORMAT(ev.fechahorafin,'%Y/%m/%d %H:%i:%s') AS fechahorafin,
                ev.estado,
                ev.idevento,
                ev.idconvenio,
                ev.diagnostico,
                ev.tel_acompanante,
                ev.req_adicionales,
                ev.pro_vpa ,
                (SELECT GROUP_CONCAT(mp.nombre) FROM eventodetalle ed
                INNER JOIN masterprocedimiento mp ON ed.idprocedimiento = mp.idmasterprocedimiento
                WHERE ed.idevento = ev.idevento AND ed.estado = 1 ) AS procedimientos,
                (SELECT GROUP_CONCAT(CONCAT(p.nombres,p.apellidos)) FROM eventocirujano ec
                INNER JOIN personal p ON ec.cirujano = p.idpersonal
                WHERE ec.idevento = ev.idevento AND ec.estado = 1 ) AS cirujanos
                FROM evento ev 
                INNER JOIN espaciofisico es ON ev.idespaciofisico=es.idespaciofisico 
                LEFT JOIN eventocirujano ec ON ev.idevento=ec.idevento and ec.estado=1
                LEFT JOIN eventoenfermera ee ON ev.idevento=ee.idevento and ee.estado=1
                LEFT JOIN eventoanestesiologo ea ON ev.idevento=ea.idevento and ea.estado=1
                LEFT JOIN eventopersonalapoyo epa ON ev.idevento = epa.idevento and epa.estado=1
                LEFT JOIN personal pc ON pc.idpersonal=ec.cirujano AND pc.idtipopersonal = 1 AND pc.estado = 1
                LEFT JOIN personal pe ON pe.idpersonal=ee.enfermera AND pe.idtipopersonal = 2 AND pe.estado = 1
                LEFT JOIN personal pan ON pan.idpersonal=ea.anestesiologo AND pan.idtipopersonal = 4 AND pan.estado = 1
                LEFT JOIN personal pac ON pac.idpersonal = epa.personalapoyo AND pac.idtipopersonal = 3 AND pac.estado = 1
                LEFT JOIN personal ppa ON ppa.idpersonal = epa.personalapoyo AND ppa.idtipopersonal = 5 AND ppa.estado = 1
                LEFT JOIN usuario u on u.numerodocumento=pc.numerodocumento
                LEFT JOIN rol r on r.idrol=u.idrol
                LEFT JOIN paciente pa ON ev.idpaciente=pa.idpaciente 
                
                WHERE ev.idempresa = {$data->orgs}  AND ( ev.estado = 4 or pc.numerodocumento={$data->numdoc} or pe.numerodocumento={$data->numdoc} or pan.numerodocumento={$data->numdoc} or ppa.numerodocumento={$data->numdoc})";
              // echo "Consulta3 : ".$sql;
            } 
            else 
            {
                $sql =
                "SELECT DISTINCT
                es.idespaciofisico,
                es.nombre AS espaciofisico,
                pa.idpaciente,
                CONCAT(pa.tipodocumento,':',pa.numerodocumento) AS ccpaciente, 
                CONCAT(pa.nombres,' ',pa.apellidos) AS paciente, 
                DATE_FORMAT(ev.fecha,'%Y/%m/%d %H:%i:%s') AS fechaevento, 
                DATE_FORMAT(ev.fechahorainicio,'%Y/%m/%d %H:%i:%s') AS fechahorainicio, 
                DATE_FORMAT(ev.fechahorafin,'%Y/%m/%d %H:%i:%s') AS fechahorafin,
                ev.estado,
                ev.idevento,
                ev.idconvenio,
                ev.diagnostico,
                ev.tel_acompanante,
                ev.req_adicionales,
                ev.pro_vpa ,
                (SELECT GROUP_CONCAT(mp.nombre) FROM eventodetalle ed
                INNER JOIN masterprocedimiento mp ON ed.idprocedimiento = mp.idmasterprocedimiento
                WHERE ed.idevento = ev.idevento AND ed.estado = 1 ) AS procedimientos,
                (SELECT GROUP_CONCAT(CONCAT(p.nombres,p.apellidos)) FROM eventocirujano ec
                INNER JOIN personal p ON ec.cirujano = p.idpersonal
                WHERE ec.idevento = ev.idevento AND ec.estado = 1 ) AS cirujanos
                FROM evento ev 
                INNER JOIN espaciofisico es ON ev.idespaciofisico=es.idespaciofisico 
                LEFT JOIN eventocirujano ec ON ev.idevento=ec.idevento and ec.estado=1
                LEFT JOIN eventoenfermera ee ON ev.idevento=ee.idevento and ee.estado=1
                LEFT JOIN eventoanestesiologo ea ON ev.idevento=ea.idevento and ea.estado=1
                LEFT JOIN eventopersonalapoyo epa ON ev.idevento = epa.idevento and epa.estado=1
                LEFT JOIN personal pc ON pc.idpersonal=ec.cirujano AND pc.idtipopersonal = 1 AND pc.estado = 1
                LEFT JOIN personal pe ON pe.idpersonal=ee.enfermera AND pe.idtipopersonal = 2 AND pe.estado = 1
                LEFT JOIN personal pan ON pan.idpersonal=ea.anestesiologo AND pan.idtipopersonal = 4 AND pan.estado = 1
                LEFT JOIN personal pac ON pac.idpersonal = epa.personalapoyo AND pac.idtipopersonal = 3 AND pac.estado = 1
                LEFT JOIN personal ppa ON ppa.idpersonal = epa.personalapoyo AND ppa.idtipopersonal = 5 AND ppa.estado = 1
                LEFT JOIN usuario u on u.numerodocumento=pc.numerodocumento
                LEFT JOIN rol r on r.idrol=u.idrol
                LEFT JOIN paciente pa ON ev.idpaciente=pa.idpaciente 
                
                WHERE ev.idempresa = {$data->orgs} and ev.idespaciofisico={$data->Sala}  AND ( ev.estado = 4 or pc.numerodocumento={$data->numdoc} or pe.numerodocumento={$data->numdoc} or pan.numerodocumento={$data->numdoc} or ppa.numerodocumento={$data->numdoc})";
              //  echo "Consulta4 : ".$sql;
            }
        }
    }
    else
    {
        if($data->rol != 3)
        {
            //echo 'sin rol';
            $sql = 
            "SELECT 
            es.idespaciofisico,
            es.nombre AS espaciofisico,
            pa.idpaciente,
            CONCAT(pa.tipodocumento,':',pa.numerodocumento) AS ccpaciente, 
            CONCAT(pa.nombres,' ',pa.apellidos) AS paciente, 
            (MONTH(fecha)),
            DATE_FORMAT(ev.fecha,'%Y/%m/%d %H:%i:%s') AS fechaevento, 
            DATE_FORMAT(ev.fechahorainicio,'%Y/%m/%d %H:%i:%s') AS fechahorainicio, 
            DATE_FORMAT(ev.fechahorafin,'%Y/%m/%d %H:%i:%s') AS fechahorafin,
            ev.estado,
            ev.idevento,
            ev.idconvenio,
            ev.diagnostico,
            ev.tel_acompanante,
            ev.req_adicionales,
            ev.pro_vpa ,
            (SELECT GROUP_CONCAT(mp.nombre) FROM eventodetalle ed
            INNER JOIN masterprocedimiento mp ON ed.idprocedimiento = mp.idmasterprocedimiento
            WHERE ed.idevento = ev.idevento AND ed.estado = 1 ) AS procedimientos,
            (SELECT GROUP_CONCAT(CONCAT(p.nombres,p.apellidos)) FROM eventocirujano ec
            INNER JOIN personal p ON ec.cirujano = p.idpersonal
            WHERE ec.idevento = ev.idevento AND ec.estado = 1 ) AS cirujanos
            FROM evento ev 
            INNER JOIN espaciofisico es ON ev.idespaciofisico=es.idespaciofisico 
            LEFT JOIN paciente pa ON ev.idpaciente=pa.idpaciente 
            
            WHERE ev.idempresa ={$data->orgs} and MONTH(fecha)={$data->mes} and YEAR(fecha)={$data->año}
            ORDER BY fechaevento ";
           // echo "Consulta5 : ".$sql;
        }
        else
        {
        // echo 'con rol';

            $sql = 
            "SELECT distinct
            es.idespaciofisico,
            es.nombre AS espaciofisico,
            pa.idpaciente,
            CONCAT(pa.tipodocumento,':',pa.numerodocumento) AS ccpaciente, 
            CONCAT(pa.nombres,' ',pa.apellidos) AS paciente, 
            (MONTH(fecha)),
            DATE_FORMAT(ev.fecha,'%Y/%m/%d %H:%i:%s') AS fechaevento, 
            DATE_FORMAT(ev.fechahorainicio,'%Y/%m/%d %H:%i:%s') AS fechahorainicio, 
            DATE_FORMAT(ev.fechahorafin,'%Y/%m/%d %H:%i:%s') AS fechahorafin,
            ev.estado,
            ev.idevento,
            ev.idconvenio,
            ev.diagnostico,
            ev.tel_acompanante,
            ev.req_adicionales,
            ev.pro_vpa ,
            (SELECT GROUP_CONCAT(mp.nombre) FROM eventodetalle ed
            INNER JOIN masterprocedimiento mp ON ed.idprocedimiento = mp.idmasterprocedimiento
            WHERE ed.idevento = ev.idevento AND ed.estado = 1 ) AS procedimientos,
            (SELECT GROUP_CONCAT(CONCAT(p.nombres,p.apellidos)) FROM eventocirujano ec
            INNER JOIN personal p ON ec.cirujano = p.idpersonal
            WHERE ec.idevento = ev.idevento AND ec.estado = 1 ) AS cirujanos
            FROM evento ev 
            INNER JOIN espaciofisico es ON ev.idespaciofisico=es.idespaciofisico 
            LEFT JOIN eventocirujano ec ON ev.idevento=ec.idevento and ec.estado=1
            LEFT JOIN eventoenfermera ee ON ev.idevento=ee.idevento and ee.estado=1
            LEFT JOIN eventoanestesiologo ea ON ev.idevento=ea.idevento and ea.estado=1
            LEFT JOIN eventopersonalapoyo epa ON ev.idevento = epa.idevento and epa.estado=1
            LEFT JOIN personal pc ON pc.idpersonal=ec.cirujano AND pc.idtipopersonal = 1 AND pc.estado = 1
            LEFT JOIN personal pe ON pe.idpersonal=ee.enfermera AND pe.idtipopersonal = 2 AND pe.estado = 1
            LEFT JOIN personal pan ON pan.idpersonal=ea.anestesiologo AND pan.idtipopersonal = 4 AND pan.estado = 1
            LEFT JOIN personal pac ON pac.idpersonal = epa.personalapoyo AND pac.idtipopersonal = 3 AND pac.estado = 1
            LEFT JOIN personal ppa ON ppa.idpersonal = epa.personalapoyo AND ppa.idtipopersonal = 5 AND ppa.estado = 1
            LEFT JOIN usuario u on u.numerodocumento=pc.numerodocumento 
            LEFT JOIN rol r on r.idrol = u.idrol
            LEFT JOIN paciente pa ON ev.idpaciente=pa.idpaciente
            
            WHERE ev.idempresa ={$data->orgs} and MONTH(fecha)={$data->mes} and YEAR(fecha)={$data->año} and u.idrol=3 
            and ( pc.numerodocumento={$data->numdoc} or pe.numerodocumento={$data->numdoc} or pan.numerodocumento={$data->numdoc} or ppa.numerodocumento={$data->numdoc})
             ORDER BY fechaevento ";
            
           // echo "Consulta6 : ".$sql;
        }
    }
    
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $mainCount=$stmt->rowCount();
    $Data = $stmt->fetchAll();

    $db = null;
    if($Data){
        $Data = json_encode($Data); 
        echo '{"eventos": ' .$Data. '}';
    } else {
        echo '{"error":{"text":"Solicitud incorrecta en usuario y/o contraseña"}}';
    }
}
catch(PDOException $e) {
    
echo '{"error":{"error controlado":'. $e->getMessage() .'}}';

}
}



function cargarempresa () {
    
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $idempresa = $data->org;
    
    try {
        
     
       //echo $tabla;
       //echo $cedula;
        $db = getDB();
        $Data ='';
        $sql = 
        "SELECT idempresa,nombreempresa FROM empresa WHERE  estado = 1";
        $stmt = $db->prepare($sql);
        //$stmt->bindParam("username", $username, PDO::PARAM_STR);
        //$password=hash('sha256',$password);
        //$stmt->bindParam("password", $password, PDO::PARAM_STR);
        //$stmt->bindParam("tabla", $tabla, PDO::PARAM_STR);
        $stmt->bindParam("tabla", $data->tabla, PDO::PARAM_STR);
        
        $stmt->execute();
        $mainCount=$stmt->rowCount();
        $Data = $stmt->fetchAll();
  
  
        $db = null;
         if($Data){
                $Data = json_encode($Data); 
                echo '{"empresahops": ' .$Data. '}';
            } else {
               echo '{"error":{"text":"Solicitud incorrecta en usuario y/o contraseña"}}';
            }

           
    }
    catch(PDOException $e) {
        echo '{"error":{"error controlado":'. $e->getMessage() .'}}';
    }
}



function cargarciudad () {
    
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $idempresa = $data->org;
    
    try {
        
     
       //echo $tabla;
       //echo $cedula;
        $db = getDB();
        $Data ='';
        $sql = 
        "SELECT idciudad,nombreciudad FROM ciudad WHERE  estado = 1";
        $stmt = $db->prepare($sql);
        //$stmt->bindParam("username", $username, PDO::PARAM_STR);
        //$password=hash('sha256',$password);
        //$stmt->bindParam("password", $password, PDO::PARAM_STR);
        //$stmt->bindParam("tabla", $tabla, PDO::PARAM_STR);
        $stmt->bindParam("tabla", $data->tabla, PDO::PARAM_STR);
        
        $stmt->execute();
        $mainCount=$stmt->rowCount();
        $Data = $stmt->fetchAll();
  
  
        $db = null;
         if($Data){
                $Data = json_encode($Data); 
                echo '{"ciudadhops": ' .$Data. '}';
            } else {
               echo '{"error":{"text":"Solicitud incorrecta en usuario y/o contraseña"}}';
            }

           
    }
    catch(PDOException $e) {
        echo '{"error":{"error controlado":'. $e->getMessage() .'}}';
    }
 }



 
// function llenarmultispersonalciru () {
    
    // $request = \Slim\Slim::getInstance()->request();
    // $data = json_decode($request->getBody());
    
    // try {
        
      // //$tabla = "masterprocedimiento";
       // //$where = $_POST["where"];
       // $whereci = $data->whereci;
       
      // //echo $where;

        // $db = getDB();
        // $Data ='';
        
                // $sql = 
       // "SELECT  idpersonal,nombres,apellidos from personal where idtipopersonal={$whereci}";
            
       
        // $stmt = $db->prepare($sql);
        // //$stmt->bindParam("username", $username, PDO::PARAM_STR);
        // //$password=hash('sha256',$password);
        // //$stmt->bindParam("password", $password, PDO::PARAM_STR);
        // //$stmt->bindParam("tabla", $tabla, PDO::PARAM_STR);
        // //$stmt->bindParam("tabla", $data->tabla, PDO::PARAM_STR);
        
        // $stmt->execute();
        // $mainCount=$stmt->rowCount();
        // $Data = $stmt->fetchAll();
  
        // $db = null;
         // if($Data){
                // $Data = json_encode($Data); 
                // echo '{"Datacirujano": ' .$Data. '}';
           // else {
               // echo '{"error":{"text":"no hay nada "}}';
            // }

           
    // }
    // catch(PDOException $e) {
        // echo '{"error":{"error controlado":'. $e->getMessage() .'}}';
    // }
// }
// }


/*function email() {
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $email=$data->email;

    try {
       
        $email_check = preg_match('~^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.([a-zA-Z]{2,4})$~i', $email);
       
        if (strlen(trim($email))>0 && $email_check>0)
        {
            $db = getDB();
            $userData = '';
            $sql = "SELECT user_id FROM emailusuario WHERE email=:email";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("email", $email,PDO::PARAM_STR);
            $stmt->execute();
            $mainCount=$stmt->rowCount();
            $created=time();
            if($mainCount==0)
            {
                
                Inserting user values
                $sql1="INSERT INTO emailusuario(email)VALUES(:email)";
                $stmt1 = $db->prepare($sql1);
                $stmt1->bindParam("email", $email,PDO::PARAM_STR);
                $stmt1->execute();
                
                
            }
            $userData=internalEmailDetails($email);
            $db = null;
            if($userData){
               $userData = json_encode($userData);
                echo '{"userData": ' .$userData . '}';
            } else {
               echo '{"error":{"text":"Enter valid dataaaa"}}';
            }
        }
        else{
            echo '{"error":{"text":"Enter valid data"}}';
        }
    }
    
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}
*/

/* ### internal Username Details ### */
function internalUserDetails($input) {
    
    try {
        $db = getDB();
        $sql = "SELECT idusuario, nombres, correoelectronico, usuario FROM usuario WHERE usuaro=:input or correoelectronico=:input";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("input", $input,PDO::PARAM_STR);
        $stmt->execute();
        $usernameDetails = $stmt->fetch(PDO::FETCH_OBJ);
        $usernameDetails->token = apiToken($usernameDetails->user_id);
        $db = null;
        return $usernameDetails;
        
    } catch(PDOException $e) {
        echo '{"error":{"errror controlado 3":'. $e->getMessage() .'}}';
    }
    
}

function cargarvpa () {
    
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $idevento = $data->idevento;
    
    try {
        
        $db = getDB();
        $Data ='';
        $sql = 
        "CALL get_EventoDetalle( {$idevento} );";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $Data = $stmt->fetch();
        $db = null;
        if($Data){

            

            $cumpleanos = new DateTime($Data['pa_nacimiento']);
            $hoy = new DateTime();
            $annos = $hoy->diff($cumpleanos);
            
            $Data += ['pa_edad' => $annos->y];

            $Data = json_encode($Data, JSON_FORCE_OBJECT); 
            echo '{"datavpa": ' .$Data. '}';
        } 
        else 
        {
           echo '{"error":{"text":"Solicitud incorrecta evento no tiene VPA o no Existe"}}';
        }
           
    }
    catch(PDOException $e) {
        echo '{"error":{"error algo fallo":'. $e->getMessage() .'}}';
    }
 }
/*
function getFeed(){
  
   
    try {
         
        if(1){
            $feedData = '';
            $db = getDB();
          
                $sql = "SELECT * FROM feed  ORDER BY feed_id DESC LIMIT 15";
                $stmt = $db->prepare($sql);
                $stmt->bindParam("user_id", $user_id, PDO::PARAM_INT);
                $stmt->bindParam("lastCreated", $lastCreated, PDO::PARAM_STR);
          
            $stmt->execute();
            $feedData = $stmt->fetchAll(PDO::FETCH_OBJ);
           
            $db = null;

            if($feedData)
            echo '{"feedData": ' . json_encode($feedData) . '}';
            else
            echo '{"feedData": ""}';
        } else{
            echo '{"error":{"text":"No access"}}';
        }
       
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

}

function feed(){
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $user_id=$data->user_id;
    $token=$data->token;
    $lastCreated = $data->lastCreated;
    $systemToken=apiToken($user_id);
   
    try {
         
        if($systemToken == $token){
            $feedData = '';
            $db = getDB();
            if($lastCreated){
                $sql = "SELECT * FROM feed WHERE user_id_fk=:user_id AND created < :lastCreated ORDER BY feed_id DESC LIMIT 5";
                $stmt = $db->prepare($sql);
                $stmt->bindParam("user_id", $user_id, PDO::PARAM_INT);
                $stmt->bindParam("lastCreated", $lastCreated, PDO::PARAM_STR);
            }
            else{
                $sql = "SELECT * FROM feed WHERE user_id_fk=:user_id ORDER BY feed_id DESC LIMIT 5";
                $stmt = $db->prepare($sql);
                $stmt->bindParam("user_id", $user_id, PDO::PARAM_INT);
            }
            $stmt->execute();
            $feedData = $stmt->fetchAll(PDO::FETCH_OBJ);
           
            $db = null;

            if($feedData)
            echo '{"feedData": ' . json_encode($feedData) . '}';
            else
            echo '{"feedData": ""}';
        } else{
            echo '{"error":{"text":"No access"}}';
        }
       
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

}

function feedUpdate(){

    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $user_id=$data->user_id;
    $token=$data->token;
    $feed=$data->feed;
    
    $systemToken=apiToken($user_id);
   
    try {
         
        if($systemToken == $token){
         
            
            $feedData = '';
            $db = getDB();
            $sql = "INSERT INTO feed ( feed, created, user_id_fk) VALUES (:feed,:created,:user_id)";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("feed", $feed, PDO::PARAM_STR);
            $stmt->bindParam("user_id", $user_id, PDO::PARAM_INT);
            $created = time();
            $stmt->bindParam("created", $created, PDO::PARAM_INT);
            $stmt->execute();
            


            $sql1 = "SELECT * FROM feed WHERE user_id_fk=:user_id ORDER BY feed_id DESC LIMIT 1";
            $stmt1 = $db->prepare($sql1);
            $stmt1->bindParam("user_id", $user_id, PDO::PARAM_INT);
            $stmt1->execute();
            $feedData = $stmt1->fetch(PDO::FETCH_OBJ);


            $db = null;
            echo '{"feedData": ' . json_encode($feedData) . '}';
        } else{
            echo '{"error":{"text":"No access"}}';
        }
       
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

}



function feedDelete(){
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $user_id=$data->user_id;
    $token=$data->token;
    $feed_id=$data->feed_id;
    
    $systemToken=apiToken($user_id);
   
    try {
         
        if($systemToken == $token){
            $feedData = '';
            $db = getDB();
            $sql = "Delete FROM feed WHERE user_id_fk=:user_id AND feed_id=:feed_id";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("user_id", $user_id, PDO::PARAM_INT);
            $stmt->bindParam("feed_id", $feed_id, PDO::PARAM_INT);
            $stmt->execute();
            
           
            $db = null;
            echo '{"success":{"text":"Feed deleted"}}';
        } else{
            echo '{"error":{"text":"No access"}}';
        }
       
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }   
    
}*/
/*$app->post('/userImage','userImage');  User Details */
/*function userImage(){
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $user_id=$data->user_id;
    $token=$data->token;
    $imageB64=$data->imageB64;
    $systemToken=apiToken($user_id);
    try {
        if(1){
            $db = getDB();
            $sql = "INSERT INTO imagesData(b64,user_id_fk) VALUES(:b64,:user_id)";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("user_id", $user_id, PDO::PARAM_INT);
            $stmt->bindParam("b64", $imageB64, PDO::PARAM_STR);
            $stmt->execute();
            $db = null;
            echo '{"success":{"status":"uploaded"}}';
        } else{
            echo '{"error":{"text":"No access"}}';
        }
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

$app->post('/getImages', 'getImages');
function getImages(){
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $user_id=$data->user_id;
    $token=$data->token;
    
    $systemToken=apiToken($user_id);
    try {
        if(1){
            $db = getDB();
            $sql = "SELECT b64 FROM imagesData";
            $stmt = $db->prepare($sql);
           
            $stmt->execute();
            $imageData = $stmt->fetchAll(PDO::FETCH_OBJ);
            $db = null;
            echo '{"imageData": ' . json_encode($imageData) . '}';
        } else{
            echo '{"error":{"text":"No access"}}';
        }
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}*/
?>
