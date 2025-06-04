window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    packages: {'[+]': ['ams', 'amscd', 'cancel', 'color']}  // 加载常用LaTeX扩展
  },
  svg: {
    fontCache: 'global',
    fontURL: 'https://cdn.jsdelivr.net/npm/asana-math@1.0/fonts',  // 字体文件路径
    font: 'Asana-Math'
  }
};