var t = TrelloPowerUp.iframe();

t.render(function () {
  t.card('desc').then(function (card) {
    var data = extractChartData(card.desc);
    if (!data) {
      document.getElementById('chart').style.display = 'none';
      document.getElementById('no-data').style.display = 'block';
      t.sizeTo('#no-data');
      return;
    }
    renderChart(data);
    t.sizeTo('#chart');
  });
});

function extractChartData(desc) {
  if (!desc) return null;
  var match = desc.match(/```chart\s*\n([\s\S]*?)\n```/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch (e) {
    return null;
  }
}

function renderChart(data) {
  var chartDom = document.getElementById('chart');
  var chart = echarts.init(chartDom);

  var series = [];
  var allDates = new Set();

  data.blocos.forEach(function (bloco) {
    bloco.contas.forEach(function (conta) {
      conta.dados.forEach(function (d) {
        allDates.add(d.data);
      });
      series.push({
        name: bloco.nome + ' - ' + conta.nome,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: conta.dados.map(function (d) {
          return [d.data, d.views];
        }),
      });
    });
  });

  var dates = Array.from(allDates).sort();

  var option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50,50,50,0.9)',
      textStyle: { color: '#fff', fontSize: 12 },
    },
    legend: {
      type: 'scroll',
      bottom: 0,
      textStyle: { fontSize: 11 },
    },
    grid: {
      left: 50,
      right: 20,
      top: 20,
      bottom: 60,
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: { fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      name: 'Views',
      nameTextStyle: { fontSize: 11 },
      axisLabel: { fontSize: 11 },
    },
    series: series,
  };

  chart.setOption(option);

  window.addEventListener('resize', function () {
    chart.resize();
  });
}
