myApp.service('chart', function() {

  // chart js scripts for area chart
	this.loadChart = function(dateOfTest,marksAll,maxX,ctx){
    // Chart.js scripts
    // -- Set new default font family and font color to mimic Bootstrap's default styling
    Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#292b2c';

    var myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dateOfTest,
        datasets: [{
          label: "Percentage",
          lineTension: 0.3,
          backgroundColor: "rgba(2,117,216,0.2)",
          borderColor: "rgba(2,117,216,1)",
          pointRadius: 5,
          pointBackgroundColor: "rgba(2,117,216,1)",
          pointBorderColor: "rgba(255,255,255,0.8)",
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(2,117,216,1)",
          pointHitRadius: 20,
          pointBorderWidth: 2,
          data: marksAll,
        }],
      },
      options: {
        events : ['click'],
        scales: {
          xAxes: [{
            time: {
              unit: 'date'
            },
            gridLines: {
              display: false
            },
            scaleLabel: {
              display: true,
              labelString: 'Date of Test'
            },
            ticks: {
              maxTicksLimit: maxX,
              autoSkip: true,
              maxRotation: 70,
              minRotation: 70
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Percentage Scored'
            },
            ticks: {
              min: 0,
              max: 100,
              maxTicksLimit: 5
            },
            gridLines: {
              color: "rgba(0, 0, 0, .125)",
            }
          }],
        },
        legend: {
          display: false
        }
      }
    });
  }

  // chart js scripts for pie chart
  this.displayPieChart = function(pieName,netPercent,ctx){

    var myPieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: pieName,
        datasets: [{
          data: netPercent,
          backgroundColor: ['#007bff', '#dc3545', '#ffc107', '#28a745','#ab47bc','#26a69a','#d4e157','#ffa726','#8d6e63','#78909c'],
        }],
      },
    });
  }

  // chart js scripts for bar graph
  this.displayBarGraph = function(pieName,barNet,ctx){

    var myLineChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: pieName,
        datasets: [{
          label: "Average Score",
          backgroundColor: "rgba(2,117,216,1)",
          borderColor: "rgba(2,117,216,1)",
          data: barNet,
        }],
      },
      options: {
        scales: {
          xAxes: [{
            time: {
              unit: 'month'
            },
            gridLines: {
              display: false
            },
            ticks: {
              maxTicksLimit: 6
            }
          }],
          yAxes: [{
            ticks: {
              min: 0,
              max: 100,
              maxTicksLimit: 5
            },
            gridLines: {
              display: true
            }
          }],
        },
        legend: {
          display: false
        }
      }
    });
  }

});