// DeepSeek Token计算器
document.addEventListener('DOMContentLoaded', function() {
    const tokenInput = document.getElementById('token-input');
    const calculateTokenBtn = document.getElementById('calculate-token-btn');
    const tokenResult = document.getElementById('token-result');

    // 根据DeepSeek官网规则优化的计算方法
    function calculateDeepSeekTokens(text) {
        // 统计中文字符（每个0.6 token）
        const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
        // 统计其他字符（包括英文/数字/符号/空格，每个0.3 token）
        const otherChars = text.replace(/[\u4e00-\u9fa5]/g, '').length;

        // 计算总token并向上取整
        return Math.ceil(chineseChars * 0.6 + otherChars * 0.3);
    }

    calculateTokenBtn.addEventListener('click', function() {
        const text = tokenInput.value;
        if (!text) {
            tokenResult.innerHTML = '<p class="error">请输入需要计算的文本</p>';
            return;
        }

        const tokenCount = calculateDeepSeekTokens(text);
        tokenResult.innerHTML = `
            <p class="token-highlight">预估Token数量: ${tokenCount}</p> 
            <p class="token-highlight">文本长度: ${text.length} 字符</p>
            <p class="tip">换算规则: (官方模型估计值,向上取整)</p>
            <p class="tip">中文≈0.6 Token/字</p>
            <p class="tip">英文/数字/符号≈0.3 Token/字</p>
            <p class="tip">tips：这是一个估算值，实际token数量可能会有所不同</p>
        `;
    });
});