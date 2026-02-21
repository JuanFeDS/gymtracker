import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { CompletedSession } from '../../types';

interface VolumeBarChartProps {
    sessions: CompletedSession[];
}

const chartStyle: React.CSSProperties = {
    width: '100%',
    height: '240px'
};

const VolumeBarChart: React.FC<VolumeBarChartProps> = ({ sessions }) => {
    const recent = useMemo(() => sessions.slice(0, 7).reverse(), [sessions]);

    if (!recent.length) {
        return (
            <div style={{ ...chartStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                Aún no tienes sesiones registradas.
            </div>
        );
    }

    const categories = recent.map(session => new Date(session.startTime).toLocaleDateString());
    const volumes = recent.map(session => session.metrics.totalVolume);

    const option = {
        tooltip: { trigger: 'axis' },
        grid: { left: 10, right: 10, top: 20, bottom: 20, containLabel: true },
        xAxis: {
            type: 'category',
            data: categories,
            axisLabel: { color: 'rgba(226, 232, 240, 0.8)' },
            axisLine: { lineStyle: { color: 'rgba(226, 232, 240, 0.3)' } },
            axisTick: { show: false }
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: 'rgba(226, 232, 240, 0.8)' },
            splitLine: { lineStyle: { color: 'rgba(226, 232, 240, 0.1)' } }
        },
        series: [
            {
                data: volumes,
                type: 'bar',
                itemStyle: {
                    borderRadius: [6, 6, 0, 0],
                    color: '#40E0D0'
                }
            }
        ]
    };

    return <ReactECharts option={option} style={chartStyle} />;
};

export default VolumeBarChart;
