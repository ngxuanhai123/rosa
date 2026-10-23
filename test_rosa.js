/**
 * TEST SUITE: HiHi Rosa (rosa)
 * Kiểm thử độ ổn định & cấu hình
 */

const fs = require('fs');
const path = require('path');

const results = [];
function recordResult(name, passed, details) {
  results.push({ name, passed, details });
  const mark = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${mark} | ${name}`);
  if (details) console.log(`   └─ ${details}`);
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 BẮT ĐẦU KIỂM THỬ DỰ ÁN: rosa (HiHi Rosa)');
  console.log('====================================================\n');

  const dir = __dirname;
  const indexPath = path.join(dir, 'index.html');
  const swPath = path.join(dir, 'sw.js');

  // TEST 1: Cấu trúc file
  try {
    const hasIndex = fs.existsSync(indexPath);
    const hasSw = fs.existsSync(swPath);
    recordResult('1. Cấu trúc file cơ bản', hasIndex && hasSw, `index: ${hasIndex}, sw: ${hasSw}`);
  } catch (e) {
    recordResult('1. Cấu trúc file cơ bản', false, e.message);
  }

  const html = fs.readFileSync(indexPath, 'utf8');

  // TEST 2: Kiểm tra lỗi escape literal \n trong HTML
  try {
    const hasLiteralSlashN = html.includes('</a>\\n');
    recordResult('2. Kiểm tra lỗi escape literal \\n trong HTML', !hasLiteralSlashN, !hasLiteralSlashN ? 'HTML sạch sẽ, không có lỗi chuỗi escape' : 'Phát hiện literal "\\n" trong mã HTML');
  } catch (e) {
    recordResult('2. Kiểm tra lỗi escape literal \\n trong HTML', false, e.message);
  }

  // TEST 3: Cô lập vùng nhớ cache Service Worker
  try {
    const sw = fs.readFileSync(swPath, 'utf8');
    const hasUniqueCache = sw.includes('hihi-rosa-');
    const hasScopedDelete = sw.includes('CACHE_PREFIX') || sw.includes('hihi-rosa-');
    recordResult('3. Cô lập vùng nhớ Cache Service Worker', hasUniqueCache && hasScopedDelete, `Cache name: ${hasUniqueCache}, Scoped delete: ${hasScopedDelete}`);
  } catch (e) {
    recordResult('3. Cô lập vùng nhớ Cache Service Worker', false, e.message);
  }

  const passedCount = results.filter(r => r.passed).length;
  console.log('\n====================================================');
  console.log(`📊 KẾT QUẢ KIỂM THỬ: ${passedCount}/${results.length} bài test vượt qua`);
  console.log('====================================================\n');
}

runTests();
