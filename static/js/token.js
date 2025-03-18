// DeepSeek Token计算器
document.addEventListener('DOMContentLoaded', function() {
    const tokenInput = document.getElementById('token-input');
    const calculateTokenBtn = document.getElementById('calculate-token-btn');
    const tokenResult = document.getElementById('token-result');

    // DeepSeek的token计算方法
    function calculateDeepSeekTokens(text) {
        // 使用tiktoken的编码方式
        const tokens = text.split(/\s+/).length;
        // 中文字符按2个token计算
        const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
        // 标点符号按0.5个token计算
        const punctuation = (text.match(/[^\w\s\u4e00-\u9fa5]/g) || []).length;
        
        const totalTokens = tokens + chineseChars + (punctuation * 0.5);
        return Math.ceil(totalTokens);
    }

    calculateTokenBtn.addEventListener('click', function() {
        const text = tokenInput.value;
        if (!text) {
            tokenResult.innerHTML = '<p class="error">请输入需要计算的文本</p>';
            return;
        }

        const tokenCount = calculateDeepSeekTokens(text);
        tokenResult.innerHTML = `
            <p>文本长度: ${text.length} 字符</p>
            <p>预估Token数量: ${tokenCount}</p>
            <p>注意：这是一个估算值，实际token数量可能会有所不同</p>
        `;
    });
}); 