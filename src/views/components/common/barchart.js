import React from 'react';
import ReactApexChart from 'react-apexcharts'

class BarChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {
                colors: ["#7535a6"],
                chart: {
                    animations: {
                        enabled: true,
                        easing: 'easeinout',
                        speed: 800,
                        animateGradually: {
                            enabled: true,
                            delay: 150
                        },
                        dynamicAnimation: {
                            enabled: true,
                            speed: 350
                        }
                    }
                },                
                plotOptions: {
                    bar: {
                
                        horizontal: true,
                    }
                },
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    categories: ['Chest Xray', 'Presumptive','Sample Collected','Diagnosed with TB'
                    ],
                },
                title: {
                    text: 'Screening and  Diagnosis Patient Cascade',
                    align: 'center',
                    floating: true
                },
                tooltip: {
                    theme: 'dark',
                    x: {
                        show: false
                    },
                    y: {
                        title: {
                            formatter: function() {
                                return ''
                            }
                        }
                    }
                }
                
            },
            series: [{
                data: [604, 60, 48, 4]
            }],
            stroke: {
                width: 1,
              colors: ['#fff']
            },
            
        }
    }

    render() {
        return (

            <div id="chart">
                <ReactApexChart
                 options={this.state.options}
                  series={this.state.series} 
                  type="bar" 
                  height="350" />
            </div>
        )
    }
}

export default BarChart