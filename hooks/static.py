# 统计codes和words
import os
import re

# 修改这一行，确保包含 tags 参数
def on_env(env, config, files, tags=None, **kwargs):
    total_words = 0
    total_codes = 0
    
    # 获取 docs 目录
    docs_dir = config['docs_dir']
    
    for root, dirs, filenames in os.walk(docs_dir):
        for f in filenames:
            if f.endswith('.md'):
                # 忽略一些可能存在的隐藏文件或临时文件
                if f.startswith('.'): continue 
                
                with open(os.path.join(root, f), 'r', encoding='utf-8') as file:
                    content = file.read()
                    
                    # 1. 统计字数 (匹配中文字符或英文单词)
                    words = len(re.findall(r'[\u4e00-\u9fa5]|[\w-]+', content))
                    total_words += words
                    
                    # 2. 统计代码行数 (匹配 Markdown 中的 ``` 代码块)
                    # 这里的正则会找成对的 ``` 之间的内容
                    code_blocks = re.findall(r'```(?:\w+)?\n([\s\S]*?)\n```', content)
                    for block in code_blocks:
                        total_codes += len(block.strip().split('\n'))
    
    # 将结果注入到全局变量中
    # 格式化显示：如果超过 1000 则显示为 1.2k
    
    # 将结果注入到全局变量中
    env.globals['words'] = f"{total_words / 1000:.1f}k" if total_words > 1000 else total_words
    env.globals['codes'] = f"{total_codes / 1000:.1f}k" if total_codes > 1000 else total_codes
    
    return env