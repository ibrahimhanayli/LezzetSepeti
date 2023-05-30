<?php
// CORS ayarları
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Veritabanı bağlantısı
$servername = "localhost";
$dbname = "lezzetsepeti";
$username = "root";
$password = "";

/*
    Kategoriler
    1-Yemekler
    2-İçecekler
    3-Soslar
    4-Atıştırmalıklar
    5-Tatlılar

    Durumlar
    0-Sipariş Alındı
    1-Sipariş Hazırlanıyor
    2-Sipariş Yolda
    3-Sipariş Teslim Edildi
    4-Sipariş İptal Edildi
*/

$conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // CORS ayarları
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST");
    header("Access-Control-Allow-Headers: Content-Type");
    exit;
}
// Gelen isteği işle
elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // GET metodu ile ilgili işlemler burada gerçekleştirilir

    switch ($_GET['action']) {
       case 'yemeklerigetir':
            {
                // Yemekleri getir
                $sql = "SELECT * FROM yemekler";
                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($result);
            }
            break;
        case 'takip':
            {
                $takip = $_GET['takip'];
                // Siparişleri getir
                $sql = "SELECT * FROM siparisler WHERE takip = '$takip'";
                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($result);
            }
            break;
        default:
            // Desteklenmeyen bir işlem geldiğinde hata döndürme
            http_response_code(400);
            echo 'Desteklenmeyen bir işlem!';
            exit;


    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {

    switch ($_GET['action']) {
       case 'siparisolustur':
            {
                $ad = $_POST['ad'];
                $soyad = $_POST['soyad'];
                $adres = $_POST['adres'];
                $telefon = $_POST['telefon'];
                $sepet = $_POST['sepet'];
                $toplamucret = $_POST['toplamucret'];

                //musteri ekle
                $sql = "INSERT INTO musteriler (ad, soyad, adres, telefon) VALUES ('$ad', '$soyad', '$adres', $telefon)";
                $stmt = $conn->prepare($sql);
                if($stmt->execute()){
                    $musteriid = $conn->lastInsertId();
                    //siparis ekle
                    $takip = strtoupper(uniqid());
                    $sql = "INSERT INTO siparisler (sepet,toplamucret,durum,musteri,takip) VALUES ('$sepet', ".$toplamucret.", 0, ".$musteriid.", '$takip')";
                    $stmt = $conn->prepare($sql);
                    if($stmt->execute()){
                        echo json_encode(array('durum' => 1,'mesaj' => 'Siparişiniz alındı.', 'takip' => $takip));
                        exit;
                    }else{
                        echo json_encode(array('durum' => 0,'mesaj' => 'Siparişiniz alınamadı.'));
                        exit;
                    }

                }else{
                    echo json_encode(array('durum' => 0,'mesaj' => 'Müşteri eklenemedi.'));
                    exit;
                }

            }
            break;
        default:
            {
                // Desteklenmeyen bir işlem geldiğinde hata döndürme
            http_response_code(400);
            echo 'Desteklenmeyen bir işlem!';
            exit;
            }
            break;
    }
} else {
    // Desteklenmeyen bir HTTP metodu geldiğinde hata döndürme
    http_response_code(405);
    echo 'Desteklenmeyen bir metot!';
}
