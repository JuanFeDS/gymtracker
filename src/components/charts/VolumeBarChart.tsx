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
    const dailySeries = useMemo(() => {
        if (!sessions.length) return [];

        const totalsByDate = new Map<string, number>();

        sessions.forEach(session => {
            const date = new Date(session.startTime).toISOString().slice(0, 10);
            const currentVolume = totalsByDate.get(date) ?? 0;
            const sessionVolume = session.metrics?.totalVolume ?? 0;
            totalsByDate.set(date, currentVolume + sessionVolume);
        });

        const sortedDates = Array.from(totalsByDate.keys()).sort((a, b) => (a < b ? -1 : 1));
        const lastSeven = sortedDates.slice(-7);

        return lastSeven.map(date => ({
            label: new Date(date).toLocaleDateString(),
            volume: totalsByDate.get(date) ?? 0
        }));
    }, [sessions]);

    if (!dailySeries.length) {
        return (
            <div style={{ ...chartStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                Aún no tienes sesiones registradas.
            </div>
        );
    }

    const categories = dailySeries.map(day => day.label);
    const volumes = dailySeries.map(day => day.volume);

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
