import { LineConfig, BarConfig } from '@ant-design/charts'

interface LineData {
    label: string
    value: number
}

export function getLineConfig(data: LineData[]): LineConfig {
    return {
        data,
        padding: 'auto',
        xField: 'Date',
        yField: 'scales',
        lineStyle: {
            lineWidth: 3,
        },
        xAxis: {
            tickCount: 10,
            showLast: true,
            label: {
                style: {
                    fontSize: 14,
                    fill: '#333',
                    fontWeight: 500,
                },
            },
        },
        yAxis: {
            label: {
                style: {
                    fontSize: 14,
                    fill: '#333',
                    fontWeight: 500,
                },
            },
        },
        area: {
            style: {
                fillOpacity: 0.1,
            },
        },
        smooth: true,
    }
}

interface BarData {
    label: string
    value: number
    type?: string
}

export function getBarConfig(data: BarData[]): BarConfig {
    return {
        data,
        isGroup: true,
        xField: 'value',
        yField: 'label',
        seriesField: 'type',
        marginRatio: 0.1,
        label: {
            position: 'right',
            offset: 4,
            style: {
                fontSize: 14,
                fill: '#333',
                fontWeight: 500,
            }
        },
        barStyle: {
            radius: [2, 2, 0, 0],
        },
        xAxis: {
            label: {
                style: {
                    fontSize: 14,
                    fill: '#333',
                    fontWeight: 500,
                },
            },
        },
        yAxis: {
            label: {
                style: {
                    fontSize: 14,
                    fill: '#333',
                    fontWeight: 500,
                },
            },
        },
    }
}