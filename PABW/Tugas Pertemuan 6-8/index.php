<?php
require_once 'koneksi.php';

// Fungsi untuk menghitung diskon
function hitungDiskon($totalBelanja)
{
    $diskon = 0;

    if ($totalBelanja >= 100000) {
        $diskon = 10;
    } elseif ($totalBelanja >= 50000) {
        $diskon = 5;
    } else {
        $diskon = 0;
    }

    return $diskon;
}

// Inisialisasi variabel
$totalBelanja = "";
$persentaseDiskon = 0;
$nominalDiskon = 0;
$totalBayar = 0;

$hasilPerhitungan = false;
$pesanError = "";

// Proses perhitungan
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (!isset($_POST['totalBelanja']) || $_POST['totalBelanja'] === "") {
        $pesanError = "Masukkan nominal belanja yang valid.";
    } elseif (!is_numeric($_POST['totalBelanja'])) {
        $pesanError = "Masukkan nominal belanja yang valid.";
    } elseif ((float) $_POST['totalBelanja'] < 0) {
        $pesanError = "Nominal belanja tidak boleh kurang dari nol.";
    } else {
        $totalBelanja = (int) $_POST['totalBelanja'];
        $persentaseDiskon = hitungDiskon($totalBelanja);
        $nominalDiskon = $totalBelanja * $persentaseDiskon / 100;
        $totalBayar = $totalBelanja - $nominalDiskon;

        // Simpan transaksi ke database
        $sql = "INSERT INTO transaksi
                (total_belanja, diskon, nominal_diskon, total_bayar)
                VALUES
                (:total_belanja, :diskon, :nominal_diskon, :total_bayar)";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ":total_belanja" => $totalBelanja,
            ":diskon" => $persentaseDiskon,
            ":nominal_diskon" => $nominalDiskon,
            ":total_bayar" => $totalBayar
        ]);

        $hasilPerhitungan = true;
    }
}

// Mengambil 5 riwayat transaksi terbaru
$stmtRiwayat = $pdo->query(
    "SELECT * FROM transaksi
     ORDER BY id DESC
     LIMIT 5"
);

$riwayat = $stmtRiwayat->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kalkulator Diskon</title>
    <!-- Favicon -->
    <link rel="shortcut icon" href="assets/img/favicon.png" type="image/x-icon">
    <!-- CSS -->
    <link rel="stylesheet" href="assets/style.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
</head>
<body>
    <div class="container">
        <!-- HEADER -->
        <header class="header">
            <div class="header-content">
                <div class="header-text">
                    <span class="header-label">SIMPLE CALCULATION</span>
                    <h1>Kalkulator Diskon</h1>
                    <p>
                        Hitung potongan harga dan total pembayaran
                        dengan mudah dan praktis.
                    </p>
                </div>
                <div class="percent-decoration">
                    %
                </div>
            </div>
        </header>


        <!-- MAIN CONTENT -->
        <main class="main-content">
            <div class="main-grid">

                <!-- INPUT BELANJA -->
                <section class="section-card">
                    <div class="section-heading">
                        <div class="heading-title">
                            <span class="heading-icon">
                                <i class="fa-solid fa-calculator"></i>
                            </span>
                            <h2>Input Belanja</h2>
                        </div>
                        <p>
                            Masukkan total belanja untuk menghitung diskon.
                        </p>
                    </div>
                    <form action="" method="POST">
                        <label for="totalBelanja">
                            Total Belanja
                        </label>
                        <div class="input-group">
                            <span class="currency">Rp</span>
                            <input
                                type="number"
                                name="totalBelanja"
                                id="totalBelanja"
                                placeholder="Masukkan nominal belanja"
                                min="0"
                                step="1"
                                value="<?php echo htmlspecialchars((string) $totalBelanja); ?>"
                                required>
                        </div>
                        <div class="form-buttons">
                            <button type="submit" class="btn-submit">
                                Hitung Diskon
                            </button>
                            <a href="index.php" class="btn-reset">
                                <i class="fa-solid fa-arrows-rotate"></i>
                                Reset
                            </a>
                        </div>
                    </form>
                    <?php if ($pesanError != ""): ?>
                        <div class="alert-error">
                            <?php echo htmlspecialchars($pesanError); ?>
                        </div>
                    <?php endif; ?>
                </section>

                <!-- KETENTUAN DISKON -->
                <section class="section-card">
                    <div class="section-heading">
                        <div class="heading-title">
                            <span class="heading-icon">
                                <i class="fa-solid fa-tags"></i>
                            </span>
                            <h2>Ketentuan Diskon</h2>
                        </div>
                        <p>
                            Besaran diskon berdasarkan total belanja.
                        </p>
                    </div>
                    <div class="discount-list">
                        <div class="discount-row">
                            <span>Di bawah Rp50.000</span>
                            <strong>0%</strong>
                        </div>
                        <div class="discount-row">
                            <span>Rp50.000 – Rp99.999</span>
                            <strong>5%</strong>
                        </div>
                        <div class="discount-row">
                            <span>Rp100.000 ke atas</span>
                            <strong>10%</strong>
                        </div>
                    </div>
                </section>
            </div>

            <!-- HASIL PERHITUNGAN -->
            <?php if ($hasilPerhitungan): ?>
                <section class="result-section">
                    <div class="section-heading">
                        <div class="heading-title">
                            <span class="heading-icon">
                                <i class="fa-solid fa-receipt"></i>
                            </span>
                            <h2>Hasil Perhitungan</h2>
                        </div>
                        <p>
                            Berikut rincian perhitungan diskon belanja Anda.
                        </p>
                    </div>

                    <!-- RINCIAN HASIL -->
                    <div class="result-card">
                        <div class="result-row">
                            <span>Total Belanja</span>
                            <strong>
                                Rp<?php echo number_format($totalBelanja, 0, ',', '.'); ?>
                            </strong>
                        </div>
                        <div class="result-row">
                            <span>Persentase Diskon</span>
                            <strong>
                                <?php echo $persentaseDiskon; ?>%
                            </strong>
                        </div>
                        <div class="result-row">
                            <span>Nominal Diskon</span>
                            <strong class="discount-value">
                                - Rp<?php echo number_format($nominalDiskon, 0, ',', '.'); ?>
                            </strong>
                        </div>
                    </div>

                    <!-- TOTAL PEMBAYARAN -->
                    <div class="total-payment">
                        <div class="payment-label">
                            <div class="payment-title">
                                <i class="fa-solid fa-wallet"></i>
                                <span>Total Pembayaran</span>
                            </div>
                            <small>Jumlah yang harus dibayar</small>
                        </div>
                        <div class="payment-value">
                            Rp<?php echo number_format($totalBayar, 0, ',', '.'); ?>
                        </div>
                    </div>
                </section>
            <?php endif; ?>

            <!-- RIWAYAT TRANSAKSI -->
            <section class="history-section">
                <div class="section-heading">
                    <div class="heading-title">
                        <span class="heading-icon">
                            <i class="fa-solid fa-clock-rotate-left"></i>
                        </span>
                        <h2>Riwayat Transaksi</h2>
                    </div>
                    <p>
                        Menampilkan 5 transaksi terbaru.
                    </p>
                </div>
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Total Belanja</th>
                                <th>Diskon</th>
                                <th>Nominal Potongan</th>
                                <th>Total Bayar</th>
                                <th>Tanggal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($riwayat) > 0): ?>
                                <?php $no = 1; ?>
                                <?php foreach ($riwayat as $data): ?>
                                    <tr>
                                        <td>
                                            <?php echo $no++; ?>
                                        </td>
                                        <td>
                                            Rp<?php echo number_format($data['total_belanja'], 0, ',', '.'); ?>
                                        </td>
                                        <td>
                                            <?php echo $data['diskon']; ?>%
                                        </td>
                                        <td class="discount-value">
                                            Rp<?php echo number_format($data['nominal_diskon'], 0, ',', '.'); ?>
                                        </td>
                                        <td class="table-total">
                                            Rp<?php echo number_format($data['total_bayar'], 0, ',', '.'); ?>
                                        </td>
                                        <td>
                                            <?php echo date('d/m/Y H:i', strtotime($data['tanggal'])); ?>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr>
                                    <td colspan="6" class="empty-data">
                                        Belum ada riwayat transaksi.
                                    </td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>

        <!-- FOOTER -->
        <footer class="footer">
            Kalkulator Diskon &copy; 2026
        </footer>
    </div>
</body>
</html>