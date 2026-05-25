import re
import os

def on_page_markdown(markdown, page, config, files):
    # 首页直接跳过，不渲染统计
    if page.url == "" or page.url == "index.html":
        return markdown

    # 1. 精确计算字数与时间
    words_cn = len(re.findall(r'[\u4e00-\u9fa5]', markdown))
    words_en = len(re.findall(r'\b[a-zA-Z0-9_-]+\b', markdown))
    total_words = words_cn + words_en
    reading_time = max(1, round(total_words / 300))

    # 2. 模仿 toc 机制：读取本地的专属组件模板
    template_path = os.path.join("hooks", "templates", "wordcount.html")
    if not os.path.exists(template_path):
        return markdown

    with open(template_path, "r", encoding="utf-8") as f:
        template = f.read()

    # 3. 渲染数据到 HTML 片段中
    html_snippet = template.replace("{{ word_count }}", str(total_words))\
                           .replace("{{ reading_time }}", str(reading_time))

    # 4. 核心魔改：利用正则，精准找到 Markdown 正文里的第一个 `# 标题`
    # 在这个标题的正下方，强行插入我们的字数统计 HTML 片段
    markdown = re.sub(
        r'^(#\s+.+)$', 
        rf'\1\n{html_snippet}\n', 
        markdown, 
        count=1, 
        flags=re.MULTILINE
    )
    return markdown