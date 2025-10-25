// script.js — 处理用户交互并调用接口
const mobileInput = document.getElementById('mobile');
const queryBtn = document.getElementById('queryBtn');
const infoDiv = document.getElementById('info');
const resultDiv = document.getElementById('result');

function showInfo(text) {
  infoDiv.textContent = text;
}

function showResult(text) {
  resultDiv.textContent = text;
}

function validateMobile(m) {
  // 简单校验：11 位数字且以 1 开头（中国手机号）
  return /^1\d{10}$/.test(m);
}

async function queryWd(mobile) {
  const url = `https://wd.api-app-prod.yuanlingshijie.com/dev/getWd?mobile=${encodeURIComponent(
    mobile
  )}`;
  showInfo('正在查询…');
  showResult('');
  queryBtn.disabled = true;
  try {
    const resp = await fetch(url, { method: 'GET' });
    if (!resp.ok) throw new Error(`网络错误：${resp.status}`);
    const json = await resp.json();
    // 期望返回结构示例：{"code":"00000","msg":null,"data":63722.90,...}
    if (json && (json.success === true || json.code === '00000')) {
      if (json.data === null || json.data === undefined) {
        showResult('接口返回但没有 data 值');
      } else {
        // 显示为带两位小数的数字
        const val =
          typeof json.data === 'number' ? json.data : Number(json.data);
        if (Number.isNaN(val)) {
          showResult(`返回的 data 不是数字：${json.data}`);
        } else {
          showResult(`WD: ${val.toFixed(2)}`);
        }
      }
      showInfo('查询成功');
    } else {
      const errmsg = json && (json.msg || json.message || JSON.stringify(json));
      showInfo(`接口返回异常: ${errmsg}`);
    }
  } catch (err) {
    showInfo(`请求失败：${err.message}`);
  } finally {
    queryBtn.disabled = false;
  }
}

queryBtn.addEventListener('click', () => {
  const mobile = mobileInput.value.trim();
  showInfo('');
  showResult('');
  if (!validateMobile(mobile)) {
    showInfo('请输入有效的 11 位手机号（示例：13958119568）');
    return;
  }
  queryWd(mobile);
});

// 支持回车触发查询
mobileInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') queryBtn.click();
});
