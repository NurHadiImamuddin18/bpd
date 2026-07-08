export default function PengaturanPage() {
  return (
    <div>
      <div className="page-header">
        <h1>Pengaturan</h1>
        <p>Konfigurasi Sistem Inventaris</p>
      </div>
      
      <div className="card">
        <h3>Konfigurasi Firebase</h3>
        <p style={{ marginTop: "12px", lineHeight: "1.6", color: "#444" }}>
          Sistem ini terhubung langsung ke Firebase Firestore. Untuk memastikan aplikasi berjalan dengan baik:
        </p>
        <ol style={{ marginTop: "12px", marginLeft: "20px", lineHeight: "1.6", color: "#444" }}>
          <li>Buka <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" style={{ color: "var(--primary)" }}>Firebase Console</a></li>
          <li>Buat Project Baru atau gunakan yang sudah ada</li>
          <li>Aktifkan <strong>Firestore Database</strong> dan atur Security Rules ke mode test (allow read, write)</li>
          <li>Dapatkan konfigurasi Web App (apiKey, projectId, dll)</li>
          <li>Ganti konfigurasi default di file <code>src/lib/firebase.ts</code> dengan konfigurasi milik Anda</li>
        </ol>
      </div>
    </div>
  );
}
