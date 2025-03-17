# API配置
API_TYPE="deepseek"  # 可选值: "deepseek" 或 "ollama"

# DeepSeek API配置
# 官方默认API地址: "https://api.deepseek.com/v1/chat/completions"
# 硅基流动：https://api.siliconflow.cn/v1/chat/completions
DEEPSEEK_API_URL="https://api.siliconflow.cn/v1/chat/completions"

DEEPSEEK_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxx"

# DeepSeek模型名称，官方默认模型: "deepseek-chat"
# 硅基流动：deepseek-ai/DeepSeek-V3
DEEPSEEK_MODEL="deepseek-ai/DeepSeek-V3"

# Ollama API配置
OLLAMA_API_URL="http://localhost:11434/api/chat"  # Ollama API地址
OLLAMA_MODEL="qwen2.5-coder:14b"  # Ollama模型名称


# 主题配置
THEMES = {
    "深色主题": {
        "main_bg": "#1a1a1a",
        "secondary_bg": "#2d2d2d",
        "text_color": "#ffffff",
        "accent_color": "#4a90e2",
        "button_hover": "#357abd",
        "button_pressed": "#2d6da3",
        "border_color": "#3d3d3d"
    },
    "浅色主题": {
        "main_bg": "#ffffff",
        "secondary_bg": "#f5f5f5",
        "text_color": "#333333",
        "accent_color": "#4a90e2",
        "button_hover": "#357abd",
        "button_pressed": "#2d6da3",
        "border_color": "#e0e0e0"
    }
}