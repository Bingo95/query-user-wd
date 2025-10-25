// script-multi.js — 支持批量手机号查询，每个手机号单独请求并显示结果
const mobileInput = document.getElementById('mobile');
const queryBtn = document.getElementById('queryBtn');
const infoDiv = document.getElementById('info');
const resultsDiv = document.getElementById('results');

function showInfo(text) {
  infoDiv.textContent = text;
}

function createOrGetRow(mobile) {
  let row = resultsDiv.querySelector(`[data-mobile="${mobile}"]`);
  if (!row) {
    row = document.createElement('div');
    row.className = 'result-item';
    row.setAttribute('data-mobile', mobile);
    row.innerHTML = `<strong>${mobile}</strong><span class="status">等待</span>`;
    resultsDiv.appendChild(row);
  }
  return row;
}

function updateRow(mobile, text, cls) {
  const row = createOrGetRow(mobile);
  const status = row.querySelector('.status');
  status.textContent = text;
  row.classList.remove('ok', 'err', 'pending');
  if (cls) row.classList.add(cls);
}

function validateMobile(m) {
  return /^1\d{10}$/.test(m);
}

async function fetchWdFor(mobile) {
  const url = `https://wd.api-app-prod.yuanlingshijie.com/dev/getWd?mobile=${encodeURIComponent(
    mobile
  )}`;
  updateRow(mobile, '正在查询…', 'pending');
  try {
    const resp = await fetch(url, { method: 'GET' });
    if (!resp.ok) throw new Error(`网络错误：${resp.status}`);
    const json = await resp.json();
    if (json && (json.success === true || json.code === '00000')) {
      if (json.data === null || json.data === undefined) {
        updateRow(mobile, '接口返回但没有 data 值', 'err');
      } else {
        const val =
          typeof json.data === 'number' ? json.data : Number(json.data);
        if (Number.isNaN(val)) {
          updateRow(mobile, `返回的 data 不是数字：${json.data}`, 'err');
        } else {
          updateRow(mobile, `WD: ${val.toFixed(2)}`, 'ok');
        }
      }
    } else {
      const errmsg = json && (json.msg || json.message || JSON.stringify(json));
      updateRow(mobile, `接口返回异常: ${errmsg}`, 'err');
    }
  } catch (err) {
    updateRow(mobile, `请求失败：${err.message}`, 'err');
  }
}

queryBtn.addEventListener('click', async () => {
  const raw = mobileInput.value || '';
  showInfo('');
  resultsDiv.innerHTML = '';

  const parts = raw
    .split(/[,;，；\s\n\r]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    showInfo('请至少输入一个手机号（逗号或换行分隔）');
    return;
  }

  const MAX = 50;
  if (parts.length > MAX) {
    showInfo(`一次最多查询 ${MAX} 个手机号，请分批查询`);
    return;
  }

  const seen = new Set();
  const mobiles = [];
  for (const p of parts) {
    if (!seen.has(p)) {
      seen.add(p);
      mobiles.push(p);
    }
  }

  queryBtn.disabled = true;
  const promises = mobiles.map((m) => {
    if (!validateMobile(m)) {
      updateRow(m, '无效的手机号格式', 'err');
      return Promise.resolve();
    }
    createOrGetRow(m);
    return fetchWdFor(m);
  });

  await Promise.allSettled(promises);
  showInfo('查询完成');
  queryBtn.disabled = false;
});

mobileInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    queryBtn.click();
  }
});
