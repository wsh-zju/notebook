mac.MathJax = {
    tex: {
      inlineMath: [["$", "$"]],
      displayMath: [["$$", "$$"]],
      processEscapes: true,
      processEnvironments: true
    },
    options: {
      ignoreHtmlClass: ".*|",
      processHtmlClass: "arithmatex"
    },
    chtml: {
      fontURL: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2", // 字体文件路径，也可换本地路径
      // 字体族设置，按优先级 fallback（后备），可自定义想用的数学字体
      fonts: ["STIX-Web", "TeX"], 
      // 控制是否使用本地字体（若浏览器有匹配字体优先用本地，否则用 fontURL 里的）
      useLocalFiles: false 
    },
    // 若想用 svg 渲染器，可加下面这段
    svg: {
      fontCache: "global",
      font: "STIX-Web", // 可选字体如 STIX-Web、TeX、Asana-Math 等
      localTeXFont: ["TeX Gyre Termes", "STIX Two Math", "Arial"] // 本地字体回退顺序
    }
  };
   
  document$.subscribe(() => { 
    MathJax.typesetPromise()
  })