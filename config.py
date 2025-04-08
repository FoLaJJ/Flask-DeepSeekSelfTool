# API配置
API_TYPE="openrouter"  # 可选值: "deepseek"、"ollama" 或 "openrouter"

# DeepSeek API配置
# 官方默认API地址: "https://api.deepseek.com/v1/chat/completions"
# 硅基流动：https://api.siliconflow.cn/v1/chat/completions

DEEPSEEK_API_URL="https://api.siliconflow.cn/v1/chat/completions"

DEEPSEEK_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# DeepSeek模型名称，官方默认模型: "deepseek-chat"
# 硅基流动：deepseek-ai/DeepSeek-V3
DEEPSEEK_MODEL="deepseek-ai/DeepSeek-V3"

# Ollama API配置
OLLAMA_API_URL="http://localhost:11434/api/chat"  # Ollama API地址
OLLAMA_MODEL="qwen2.5-coder:14b"  # Ollama模型名称

# OpenRouter API配置
OPENROUTER_API_URL="https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_API_KEY="sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  # 请在此处填入您的 OpenRouter API Key
OPENROUTER_MODEL="moonshotai/moonlight-16b-a3b-instruct:free"  # 默认使用 Moonlight 16B，可以根据需要修改(因为哥们没有余额hh)

# 主题配置
THEMES = {
    "深色主题": {
        "main_bg": "#3a3aac",
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