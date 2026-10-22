  (function () {
    var COR_CLARA = "#f2f5fa";
    var COR_ESCURA = "#0e1524";
    var mq = window.matchMedia("(prefers-color-scheme: dark)");

    function aplicar() {
      // remove e recria a meta para forçar o navegador a reler a cor
      document
        .querySelectorAll('meta[name="theme-color"]')
        .forEach(function (m) { m.remove(); });
      var m = document.createElement("meta");
      m.name = "theme-color";
      m.content = mq.matches ? COR_ESCURA : COR_CLARA;
      document.head.appendChild(m);
    }

    aplicar();
    if (mq.addEventListener) mq.addEventListener("change", aplicar);
    else mq.addListener(aplicar);
    document.addEventListener("visibilitychange", aplicar);
  })();