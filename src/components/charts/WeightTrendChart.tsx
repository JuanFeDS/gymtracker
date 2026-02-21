import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import type { WeightLog } from '../../types';

const chartContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '220px'
};

interface WeightTrendChartProps {
    data: WeightLog[];
}

const WeightTrendChart: React.FC<WeightTrendChartProps> = ({ data }) => {
    const ordered = useMemo(() => [...data].reverse(), [data]);
    const dates = ordered.map(log => log.date);
    const values = ordered.map(log => log.weight);

    const options = useMemo(() => ({
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            borderColor: 'rgba(74, 199, 255, 0.4)',
            textStyle: { color: '#e2e8f0' }
        },
        grid: {
            left: 10,
            right: 10,
            top: 20,
            bottom: 20,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: dates,
            boundaryGap: false,
            axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.4)' } },
            axisLabel: { color: 'rgba(148, 163, 184, 0.8)', fontSize: 10 },
            axisTick: { show: false }
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } },
            axisLabel: { color: 'rgba(148, 163, 184, 0.8)' }
        },
        series: [
            {
                data: values,
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: { width: 3, color: '#40E0D0' },
                itemStyle: { color: '#40E0D0' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(64, 224, 208, 0.35)' },
                        { offset: 1, color: 'rgba(64, 224, 208, 0.05)' }
                    ])
                }
            }
        ]
    }), [dates, values]);

    if (!data.length) {
        return (
            <div style={{
                ...chartContainerStyle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)'
            }}>
                Registra tu primer peso para ver la tendencia.
            </div>
        );
    }

    return <ReactECharts option={options} style={chartContainerStyle} />;
};

export default WeightTrendChart;
