import { sleep } from 'k6';
import http from 'k6/http';
import { Counter } from 'k6/metrics';

// Metrics
const successRequests = new Counter('success_requests');
const failRequests = new Counter('fail_requests');
const fastResponses = new Counter('fast_responses');
const slowResponses = new Counter('slow_responses');

// Test settings
export const options = {
    stages: [
        { duration: '15s', target: 10 }, // Start: menaikkan ke 10 user
        { duration: '30s', target: 20 }, // Tengah: menaikkan ke 20 user
        { duration: '15s', target: 0 },  // Akhir: menurunkan ke 0 user
    ],
};

// Main test function
export default function () {
    // Melakukan request
    const response = http.get('https://elysiajs.com/');
    
    // Mengukur response
    const isSuccess = response.status === 200;
    const responseTime = response.timings.duration;
    const isFast = responseTime < 500; // Response dibawah 0.5 detik dianggap cepat
    
    // Mencatat metrics
    if (isSuccess) {
        successRequests.add(1);
        if (isFast) {
            fastResponses.add(1);
        } else {
            slowResponses.add(1);
        }
    } else {
        failRequests.add(1);
    }

    // Menampilkan info per request
    console.log(`
    === Request Info ===
    Status: ${isSuccess ? '✅ Sukses' : '❌ Gagal'}
    Waktu: ${responseTime/1000} detik
    Kecepatan: ${isFast ? '🚀 Cepat' : '🐢 Lambat'}
    ===================
    `);

    sleep(1);
}

// Generate laporan akhir
export function handleSummary(data) {
    const total = successRequests.value + failRequests.value;
    const successRate = (successRequests.value / total * 100).toFixed(2);
    const fastRate = (fastResponses.value / successRequests.value * 100).toFixed(2);
    
    const summary = `
    📊 LAPORAN PENGUJIAN WEBSITE
    ===========================
    
    Total Pengujian: ${total} request
    
    HASIL:
    ✅ Sukses: ${successRequests.value} request (${successRate}%)
    ❌ Gagal: ${failRequests.value} request
    
    KECEPATAN:
    🚀 Respon Cepat: ${fastResponses.value} request
    🐢 Respon Lambat: ${slowResponses.value} request
    
    PERFORMA:
    - Tingkat Keberhasilan: ${successRate}%
    - Persentase Respon Cepat: ${fastRate}%
    
    KESIMPULAN:
    ${generateConclusion(successRate, fastRate)}
    
    ===========================
    `;
    
    return { stdout: summary };
}

// Helper function untuk generate kesimpulan
function generateConclusion(successRate, fastRate) {
    let conclusion = [];
    
    // Analisis keberhasilan
    if (successRate >= 95) {
        conclusion.push("✅ Reliabilitas website sangat baik");
    } else if (successRate >= 90) {
        conclusion.push("⚠️ Reliabilitas website cukup baik, tapi perlu peningkatan");
    } else {
        conclusion.push("❌ Reliabilitas website perlu perbaikan segera");
    }
    
    // Analisis kecepatan
    if (fastRate >= 90) {
        conclusion.push("🚀 Kecepatan website optimal");
    } else if (fastRate >= 80) {
        conclusion.push("⚡ Kecepatan website bisa ditingkatkan");
    } else {
        conclusion.push("🐢 Kecepatan website perlu optimasi");
    }
    
    return conclusion.join('\n');
}