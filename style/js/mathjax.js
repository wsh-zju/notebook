window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    packages: {'[+]': ['ams', 'amscd', 'cancel', 'color']}  // 加载常用LaTeX扩展
  },
  svg: {
    fontCache: 'global',
    fontURL: 'https://cdn.jsdelivr.net/npm/neo-euler@0.1/fonts',  // 字体文件路径
    font: 'Neo-Euler'  // 指定使用Neo-Euler字体
  }
};