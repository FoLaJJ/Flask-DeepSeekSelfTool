from flask import Blueprint, request, jsonify
import requests
import json
import re
from config import API_TYPE, DEEPSEEK_API_KEY, DEEPSEEK_API_URL, DEEPSEEK_MODEL, OLLAMA_API_URL, OLLAMA_MODEL

api = Blueprint('api', __name__)


def chat_completion(prompt, temperature=0.3):
    try:
        if API_TYPE == "deepseek":
            headers = {
                "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": DEEPSEEK_MODEL,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": temperature
            }
            response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=100)
        else:  # ollama
            payload = {
                "model": OLLAMA_MODEL,
                "messages": [{"role": "user", "content": prompt}],
                "stream": False
            }
            response = requests.post(OLLAMA_API_URL, json=payload)

        response.raise_for_status()
        if API_TYPE == "deepseek":
            return response.json()["choices"][0]["message"]["content"]
        else:
            content = response.json()["message"]["content"]
            content = re.sub(r'<think>.*?</think>', '', content, flags=re.DOTALL)
            return content.strip()

    except Exception as e:
        raise Exception(f"API请求错误: {str(e)}")


@api.route('/analyze_traffic', methods=['POST'])
def analyze_traffic():
    try:
        http_data = request.json.get('http_data', '')
        prompt = f"""请进行网络安全分析。请严格按照以下步骤执行：
1. 分析以下HTTP请求的各个组成部分
2. 识别是否存在SQL注入、XSS、CSRF、反序列化、文件上传、路径遍历、OWASPTop10、等常见攻击特征
3. 检查User-Agent等头部信息是否可疑
4. 如果数据包中有一些编码后的内容，一定要解码后再进行分析
5. 最终结论：是否为攻击流量（是/否）

请用中文按以下格式响应：
【分析结果】是/否
【依据】简明扼要列出技术依据

HTTP请求数据：
{http_data}"""

        result = chat_completion(prompt)
        is_attack = "【分析结果】是" in result
        return jsonify({"result": result, "is_attack": is_attack})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/decode', methods=['POST'])
def decode():
    try:
        encoded_str = request.json.get('encoded_str', '')
        prompt = f"""请完整分析并解码以下字符串，要求：
1. 识别所有可能的编码方式（包括嵌套编码）
2. 通过自己重新编码，确认自己解码正确
3. 展示完整的解码过程
4. 输出最终解码结果

原始字符串：{encoded_str}

请用中文按以下格式响应：
【编码分析】列出检测到的编码类型及层级
【解码过程】逐步展示解码步骤
【最终结果】解码后的明文内容"""

        result = chat_completion(prompt)
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/analyze_process', methods=['POST'])
def analyze_process():
    try:
        process_data = request.json.get('process_data', '')
        prompt = f"""你是一个Windows/Linux进程分析工程师，要求：
1. 用户将输出tasklist或者ps aux的结果
2. 帮助用户分析输出你所有认识的进程信息
3. 识别可能的恶意进程
4. 识别杀毒软件进程
5. 识别其他软件进程

tasklist或者ps aux的结果：{process_data}

按优先级列出需要关注的进程
【可疑进程】
【杀软进程】
【第三方软件进程】
给出具体操作建议：
• 安全进程的可终止性评估"""

        result = chat_completion(prompt)
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/audit_js', methods=['POST'])
def audit_js():
    try:
        js_code = request.json.get('js_code', '')
        prompt = f"""请对以下JavaScript代码进行完整的安全审计，要求：
1. 识别XSS、CSRF、不安全的DOM操作、敏感信息泄露、eval使用等安全问题
2. 检查第三方库的安全性和版本漏洞
3. 分析代码逻辑漏洞
4. 提供修复建议

请用中文按以下格式响应：
【高危漏洞】列出高危安全问题及位置
【中低危问题】列出中低风险问题
【修复建议】提供具体修复方案

JavaScript代码：
{js_code}"""

        result = chat_completion(prompt)
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/convert_http', methods=['POST'])
def convert_http():
    try:
        http_request = request.json.get('http_request', '')
        prompt = f"""你是一个专业Python开发助手，请将以下HTTP请求转换为规范的Python代码（使用requests库）。按以下步骤处理：
要求：
1.用户输入：完整请求头（包含Content-Type和Authorization）
2.用户输入：完整的请求题（包含请求方法、URL和参数）
3.用户输入：请求体的内容（如果有）
4.默认不进行SSL验证
5.输出：完整的Python代码，包含请求头、请求体和请求方法

请用中文按以下格式响应：
【Python代码】输出转换后的Python代码，不使用markdown格式，不要有其他多余的输出

这是用户输入的内容：
{http_request}"""

        result = chat_completion(prompt)
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/process_text', methods=['POST'])
def process_text():
    try:
        source_text = request.json.get('source_text', '')
        sample_text = request.json.get('sample_text', '')
        prompt = f"""写python代码，请根据提供的样本格式，将源文本转换为与样本相同的格式。要求：
1. 分析样本文本的结构和格式特征
2. 保持源文本的核心内容不变
3. 按照样本的格式要求重新组织内容
4. 确保转换后的文本与样本格式完全一致
5.最后输出转换两文本的python代码脚本，不要有其他多余的输出。

样本文本：
{sample_text}

源文本：
{source_text}

请直接输出python脚本，不要包含任何解释或说明。不使用markdown格式"""

        result = chat_completion(prompt)
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/generate_regex', methods=['POST'])
def generate_regex():
    try:
        source_text = request.json.get('source_text', '')
        sample_text = request.json.get('sample_text', '')
        prompt = f"""请根据提供的样本格式，通过源文本生成正则表达式为与样本相同的内容。要求：
1. 分析样本文本的结构和格式特征
2. 保持源文本的核心内容不变
3. 生成多个正则表达式
4. 保证可以通过正则表达式匹配到样本文件中的内容

样本文本：
{sample_text}

源文本：
{source_text}

请直接输出生成的多个正则表达式，不要包含任何解释或说明，不要使用markdown格式输出"""

        result = chat_completion(prompt)
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/analyze_webshell', methods=['POST'])
def analyze_webshell():
    try:
        file_content = request.json.get('file_content', '')
        prompt = f"""请分析以下文件内容是否为WebShell或内存马。要求：
1. 检查PHP/JSP/ASP等WebShell特征（如加密函数、执行系统命令、文件操作）
2. 识别内存马特征（如无文件落地、进程注入、异常网络连接）
3. 分析代码中的可疑功能（如命令执行、文件上传、信息收集）
4. 检查混淆编码、加密手段等规避技术
5. 最终结论：是否为恶意软件（是/否）
6. 如果否，则输出安全文件，其他不要输出

请用中文按以下格式响应：
【分析结果】是/否
【恶意类型】WebShell/内存马/其他
【技术特征】列出检测到的技术指标
【风险等级】高/中/低

文件内容：
{file_content}"""

        result = chat_completion(prompt)
        is_malicious = "【分析结果】是" in result
        return jsonify({"result": result, "is_malicious": is_malicious})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/translate', methods=['POST'])
def translate():
    try:
        text = request.json.get('text', '')
        source_lang = request.json.get('source_lang', '自动检测')
        target_lang = request.json.get('target_lang', '中文')
        prompt = f"""请将以下文本从{source_lang}专业地翻译成{target_lang}。要求：
1. 保持技术术语准确性（特别是网络安全相关词汇）
2. 保留代码格式和变量名
3. 正确处理专业缩写（如XSS、SQLi等）
4. 输出仅需翻译结果，无需额外说明

待翻译内容：
{text}"""

        result = chat_completion(prompt)
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/audit_source', methods=['POST'])
def audit_source():
    try:
        file_content = request.json.get('file_content', '')
        file_name = request.json.get('file_name', '')
        prompt = f"""【强制指令】你是一个专业的安全审计AI，请按以下要求分析代码：
1. 漏洞分析流程：
   1.1 识别潜在风险点（SQL操作、文件操作、用户输入点、文件上传漏洞、CSRF、SSRF、XSS、RCE、OWASP top10等漏洞）
   1.2 验证漏洞可利用性
   1.3 按CVSS评分标准评估风险等级

2. 输出规则：
   - 仅输出确认存在的高危/中危漏洞
   - 使用严格格式：[风险等级] 类型 - 位置:行号 - 50字内描述
   - 禁止解释漏洞原理
   - 禁止给出修复建议
   - 每文件最多报告3个最严重问题
   - 如果有可能，给出POC（HTTP请求数据包）

3. 输出示例（除此外不要有任何输出）：
   [高危] SQL注入 - {file_name}:32 - 未过滤的$_GET参数直接拼接SQL查询
   [POC]POST /login.php HTTP/1.1
   Host: example.com
   Content-Type: application/x-www-form-urlencoded
   [中危] XSS - {file_name}:15 - 未转义的userInput输出到HTML
   [POC]POST /login.php HTTP/1.1
   Host: example.com
   Content-Type: application/x-www-form-urlencoded

4. 当前代码（仅限分析）：
{file_content[:3000]}"""

        result = chat_completion(prompt)
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/analyze_vulnerability', methods=['POST'])
def analyze_vulnerability():
    try:
        url = request.json.get('url', '')
        vulnerability = request.json.get('vulnerability', '')
        prompt = f"""请分析以下URL和漏洞信息，并提供以下内容：
1. 漏洞描述
2. 攻击场景
3. 修复建议
4. 整体风险评级（危急、高危、中危、低危）

请用中文按以下格式响应：
【漏洞链接】URL
【漏洞描述】简明扼要描述漏洞
【攻击场景】描述可能的攻击场景
【修复建议】提供具体的修复建议
【风险评级】危急/高危/中危/低危

URL: {url}
漏洞: {vulnerability}"""

        result = chat_completion(prompt)
        risk_level = "低危"  # 默认风险等级
        if "【风险评级】危急" in result:
            risk_level = "危急"
        elif "【风险评级】高危" in result:
            risk_level = "高危"
        elif "【风险评级】中危" in result:
            risk_level = "中危"
        return jsonify({"result": result, "risk_level": risk_level})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
