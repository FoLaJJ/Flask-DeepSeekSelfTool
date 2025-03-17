// 全局变量
let fileInputs = {
    'choose-file': null,
    'choose-dir': null,
    'choose-dir-audit': null
};

// 加载动画HTML
const loadingHTML = `
<div class="loading-container">
    <div class="loading-spinner"></div>
    <div class="loading-text">正在分析中...</div>
    <div class="loading-progress">
        <div class="progress-bar"></div>
    </div>
</div>
`;

// 主题切换
document.addEventListener('DOMContentLoaded', () => {
    // 初始化文件选择器
    fileInputs = {
        'choose-file': document.createElement('input'),
        'choose-dir': document.createElement('input'),
        'choose-dir-audit': document.createElement('input')
    };

    // 设置文件选择器属性
    Object.entries(fileInputs).forEach(([buttonId, input]) => {
        input.type = 'file';
        if (buttonId === 'choose-dir' || buttonId === 'choose-dir-audit') {
            input.webkitdirectory = true;
        }
        input.style.display = 'none';
        document.body.appendChild(input);
    });

    // 主题选择
    const themeSelect = document.getElementById('theme');
    const savedTheme = localStorage.getItem('theme') || '浅色主题';
    themeSelect.value = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeSelect.addEventListener('change', (e) => {
        const theme = e.target.value;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });

    // 标签页切换
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            // 更新按钮状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 更新内容显示
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });

    // 文件选择按钮事件
    document.getElementById('choose-file')?.addEventListener('click', () => {
        fileInputs['choose-file'].click();
    });

    document.getElementById('choose-dir')?.addEventListener('click', () => {
        fileInputs['choose-dir'].click();
    });

    document.getElementById('choose-dir-audit')?.addEventListener('click', () => {
        fileInputs['choose-dir-audit'].click();
    });

    // 文件选择事件
    fileInputs['choose-file'].addEventListener('change', () => {
        const pathSpan = document.getElementById('scan-path');
        if (pathSpan) {
            pathSpan.textContent = fileInputs['choose-file'].files.length > 0 ?
                `已选择 ${fileInputs['choose-file'].files.length} 个文件` :
                '未选择文件/目录';
        }
    });

    fileInputs['choose-dir'].addEventListener('change', () => {
        const pathSpan = document.getElementById('scan-path');
        if (pathSpan) {
            pathSpan.textContent = fileInputs['choose-dir'].files.length > 0 ?
                `已选择 ${fileInputs['choose-dir'].files.length} 个文件` :
                '未选择文件/目录';
        }
    });

    fileInputs['choose-dir-audit'].addEventListener('change', () => {
        const pathSpan = document.getElementById('dir-path');
        if (pathSpan) {
            pathSpan.textContent = fileInputs['choose-dir-audit'].files.length > 0 ?
                `已选择 ${fileInputs['choose-dir-audit'].files.length} 个文件` :
                '未选择目录';
        }
    });

    // 添加加载动画样式
    const style = document.createElement('style');
    style.textContent = `
        .loading-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            z-index: 1000;
            display: none;
        }
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 15px;
        }
        .loading-text {
            color: white;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .loading-progress {
            width: 200px;
            height: 4px;
            background: #f3f3f3;
            border-radius: 2px;
            overflow: hidden;
        }
        .progress-bar {
            width: 0%;
            height: 100%;
            background: #3498db;
            transition: width 0.3s ease;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .button-loading {
            position: relative;
            pointer-events: none;
            opacity: 0.7;
        }
        .button-loading::after {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            top: 50%;
            left: 50%;
            margin: -10px 0 0 -10px;
            border: 2px solid #fff;
            border-top-color: transparent;
            border-radius: 50%;
            animation: button-spin 1s linear infinite;
        }
        @keyframes button-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // 添加加载容器
    const loadingContainer = document.createElement('div');
    loadingContainer.innerHTML = loadingHTML;
    document.body.appendChild(loadingContainer);

    // 绑定所有按钮事件
    bindButtonEvents();
});

// 显示加载动画
function showLoading(text = '正在分析中...') {
    const container = document.querySelector('.loading-container');
    const textElement = container.querySelector('.loading-text');
    textElement.textContent = text;
    container.style.display = 'block';
}

// 隐藏加载动画
function hideLoading() {
    const container = document.querySelector('.loading-container');
    container.style.display = 'none';
}

// 更新加载进度
function updateLoadingProgress(progress) {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

// 设置按钮加载状态
function setButtonLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (button) {
        if (isLoading) {
            button.classList.add('button-loading');
            button.disabled = true;
        } else {
            button.classList.remove('button-loading');
            button.disabled = false;
        }
    }
}

// 绑定所有按钮事件
function bindButtonEvents() {
    // 流量分析
    document.getElementById('analyze-btn')?.addEventListener('click', async () => {
        const input = document.getElementById('traffic-input').value;
        if (!input) {
            showError('traffic-result', '请输入HTTP请求数据');
            return;
        }

        setButtonLoading('analyze-btn', true);
        showLoading('正在分析网络流量...');
        updateLoadingProgress(0);

        try {
            const response = await fetch('/api/analyze_traffic', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({http_data: input})
            });
            const data = await response.json();
            if (data.error) {
                showError('traffic-result', data.error);
            } else {
                showResult('traffic-result', data.result);
            }
        } catch (error) {
            showError('traffic-result', error.message);
        } finally {
            setButtonLoading('analyze-btn', false);
            hideLoading();
        }
    });

    // 智能解码
    document.getElementById('decode-btn')?.addEventListener('click', async () => {
        const input = document.getElementById('decode-input').value;
        if (!input) {
            showError('decode-result', '请输入需要解码的字符串');
            return;
        }

        setButtonLoading('decode-btn', true);
        showLoading('正在解码中...');
        updateLoadingProgress(0);

        try {
            const response = await fetch('/api/decode', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({encoded_str: input})
            });
            const data = await response.json();
            if (data.error) {
                showError('decode-result', data.error);
            } else {
                showResult('decode-result', data.result);
            }
        } catch (error) {
            showError('decode-result', error.message);
        } finally {
            setButtonLoading('decode-btn', false);
            hideLoading();
        }
    });

    // JS审计
    document.getElementById('js-audit-btn')?.addEventListener('click', async () => {
        const input = document.getElementById('js-input').value;
        if (!input) {
            showError('js-result', '请输入JavaScript代码');
            return;
        }

        setButtonLoading('js-audit-btn', true);
        showLoading('正在审计JavaScript代码...');
        updateLoadingProgress(0);

        try {
            const response = await fetch('/api/audit_js', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({js_code: input})
            });
            const data = await response.json();
            if (data.error) {
                showError('js-result', data.error);
            } else {
                showResult('js-result', data.result);
            }
        } catch (error) {
            showError('js-result', error.message);
        } finally {
            setButtonLoading('js-audit-btn', false);
            hideLoading();
        }
    });

    // 进程分析
    document.getElementById('process-btn')?.addEventListener('click', async () => {
        const input = document.getElementById('process-input').value;
        if (!input) {
            showError('process-result', '请输入进程信息');
            return;
        }

        setButtonLoading('process-btn', true);
        showLoading('正在分析进程信息...');
        updateLoadingProgress(0);

        try {
            const response = await fetch('/api/analyze_process', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({process_data: input})
            });
            const data = await response.json();
            if (data.error) {
                showError('process-result', data.error);
            } else {
                showResult('process-result', data.result);
            }
        } catch (error) {
            showError('process-result', error.message);
        } finally {
            setButtonLoading('process-btn', false);
            hideLoading();
        }
    });

    // HTTP转Python
    document.getElementById('convert-btn')?.addEventListener('click', async () => {
        const input = document.getElementById('http-input').value;
        if (!input) {
            showError('conversion-result', '请输入HTTP请求');
            return;
        }

        setButtonLoading('convert-btn', true);
        showLoading('正在转换HTTP请求...');
        updateLoadingProgress(0);

        try {
            const response = await fetch('/api/convert_http', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({http_request: input})
            });
            const data = await response.json();
            if (data.error) {
                showError('conversion-result', data.error);
            } else {
                showResult('conversion-result', data.result);
            }
        } catch (error) {
            showError('conversion-result', error.message);
        } finally {
            setButtonLoading('convert-btn', false);
            hideLoading();
        }
    });

    // 文本处理
    document.getElementById('text-process-btn')?.addEventListener('click', async () => {
        const source = document.getElementById('text-source').value;
        const sample = document.getElementById('text-sample').value;
        if (!source || !sample) {
            showError('text-result', '请输入源文本和样本格式');
            return;
        }

        setButtonLoading('text-process-btn', true);
        showLoading('正在处理文本...');
        updateLoadingProgress(0);

        try {
            const response = await fetch('/api/process_text', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({source_text: source, sample_text: sample})
            });
            const data = await response.json();
            if (data.error) {
                showError('text-result', data.error);
            } else {
                showResult('text-result', data.result);
            }
        } catch (error) {
            showError('text-result', error.message);
        } finally {
            setButtonLoading('text-process-btn', false);
            hideLoading();
        }
    });

    // 正则生成
    document.getElementById('regex-btn')?.addEventListener('click', async () => {
        const source = document.getElementById('regex-source').value;
        const sample = document.getElementById('regex-sample').value;
        if (!source || !sample) {
            showError('regex-result', '请输入源文本和样本格式');
            return;
        }

        setButtonLoading('regex-btn', true);
        showLoading('正在生成正则表达式...');
        updateLoadingProgress(0);

        try {
            const response = await fetch('/api/generate_regex', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({source_text: source, sample_text: sample})
            });
            const data = await response.json();
            if (data.error) {
                showError('regex-result', data.error);
            } else {
                showResult('regex-result', data.result);
            }
        } catch (error) {
            showError('regex-result', error.message);
        } finally {
            setButtonLoading('regex-btn', false);
            hideLoading();
        }
    });

    // WebShell检测
    document.getElementById('start-scan')?.addEventListener('click', async () => {
        const files = [...fileInputs['choose-file'].files, ...fileInputs['choose-dir'].files];

        if (files.length === 0) {
            showError('webshell-result', '请选择文件或目录');
            return;
        }

        setButtonLoading('start-scan', true);
        showLoading('正在检测WebShell...');
        updateLoadingProgress(0);

        try {
            // 读取文件内容
            const fileContents = await Promise.all(
                files.map(async (file) => {
                    try {
                        const content = await file.text();
                        return {
                            filename: file.name,
                            content: content
                        };
                    } catch (error) {
                        console.error(`读取文件 ${file.name} 失败:`, error);
                        return {
                            filename: file.name,
                            content: "无法读取文件内容"
                        };
                    }
                })
            );

            const response = await fetch('/api/analyze_webshell', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    files: fileContents,
                    file_types: {
                        php: document.getElementById('check-php').checked,
                        jsp: document.getElementById('check-jsp').checked,
                        asp: document.getElementById('check-asp').checked
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.error) {
                showError('webshell-result', data.error);
            } else {
                showResult('webshell-result', data.result);
            }
        } catch (error) {
            showError('webshell-result', error.message);
        } finally {
            setButtonLoading('start-scan', false);
            hideLoading();
        }
    });

    // AI翻译
    document.getElementById('trans-btn')?.addEventListener('click', async () => {
        const input = document.getElementById('trans-input').value;
        const sourceLang = document.getElementById('source-lang').value;
        const targetLang = document.getElementById('target-lang').value;

        if (!input) {
            showError('trans-output', '请输入待翻译内容');
            return;
        }

        setButtonLoading('trans-btn', true);
        showLoading('正在翻译中...');
        updateLoadingProgress(0);

        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    text: input,
                    source_lang: sourceLang,
                    target_lang: targetLang
                })
            });
            const data = await response.json();
            if (data.error) {
                showError('trans-output', data.error);
            } else {
                showResult('trans-output', data.result);
            }
        } catch (error) {
            showError('trans-output', error.message);
        } finally {
            setButtonLoading('trans-btn', false);
            hideLoading();
        }
    });

    // 源码审计
    document.getElementById('start-audit')?.addEventListener('click', async () => {
        const files = fileInputs['choose-dir-audit'].files;
        if (files.length === 0) {
            showError('audit-result', '请选择源码目录');
            return;
        }

        setButtonLoading('start-audit', true);
        showLoading('正在审计源码...');
        updateLoadingProgress(0);

        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('files[]', file);
        });

        const fileTypes = {
            'check-php-audit': document.getElementById('check-php-audit').checked,
            'check-jsp-audit': document.getElementById('check-jsp-audit').checked,
            'check-asp-audit': document.getElementById('check-asp-audit').checked
        };

        try {
            const response = await fetch('/api/audit_source', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.error) {
                showError('audit-result', data.error);
            } else {
                showResult('audit-result', data.result);
            }
        } catch (error) {
            showError('audit-result', error.message);
        } finally {
            setButtonLoading('start-audit', false);
            hideLoading();
        }
    });

    // 漏洞分析
    document.getElementById('analyze-vuln-btn')?.addEventListener('click', async () => {
        const url = document.getElementById('url-input').value;
        const vulnerability = document.getElementById('vulnerability-input').value;

        if (!url || !vulnerability) {
            showError('vuln-result', '请输入URL和漏洞类型');
            return;
        }

        setButtonLoading('analyze-vuln-btn', true);
        showLoading('正在分析漏洞...');
        updateLoadingProgress(0);

        try {
            const response = await fetch('/api/analyze_vulnerability', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    url: url,
                    vulnerability: vulnerability
                })
            });
            const data = await response.json();
            if (data.error) {
                showError('vuln-result', data.error);
            } else {
                showResult('vuln-result', data.result);
            }
        } catch (error) {
            showError('vuln-result', error.message);
        } finally {
            setButtonLoading('analyze-vuln-btn', false);
            hideLoading();
        }
    });
}

// 通用函数：显示结果
function showResult(elementId, data) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = data;
        element.style.display = 'block';
    }
}

// 通用函数：显示错误
function showError(elementId, error) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = `错误: ${error}`;
        element.style.display = 'block';
        element.style.color = 'var(--error-color)';
    }
}

// 通用函数：更新进度条
function updateProgress(progress) {
    const progressBar = document.querySelector('.progress');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}