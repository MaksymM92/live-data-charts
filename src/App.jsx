import { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const App = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080');

        // Connection opened
        ws.onopen = () => console.log('WebSocket Connected');

        // Listen for messages
        ws.onmessage = (event) => {
            try {
                const receivedData = JSON.parse(event.data);
                // Convert timestamp to milliseconds since the Unix epoch
                const timestamp = new Date(receivedData.timestamp).getTime();
                const value = receivedData.value;
                const newDataPoint = [timestamp, value]; // Create the Highcharts-expected format

                setData((currentData) => {
                    const newData = [...currentData, newDataPoint];
                    // Sort by timestamp, which is the first element of each data point array.
                    // Also we need to keep only last 15 data points. Otherwise chart will get messy.
                    return newData.sort((a, b) => a[0] - b[0]).slice(-15);
                });
            } catch (error) {
                console.error('Error parsing message data:', error);
            }
        };

        // Listen for possible errors
        ws.onerror = (error) => console.error('WebSocket Error:', error);

        // Clean up function
        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
                console.log('WebSocket Disconnected');
            }
        };
    }, []);

    // Chart configuration options
    const chartOptions = {
        chart: {
            type: 'spline', // Defines the chart type as a spline (smoothed line chart)
            animation: Highcharts.svg, // Enable animation for SVG elements
            marginRight: 10, // Margin on the right side of the chart
        },
        time: {
            useUTC: false, // Use local time instead of UTC
        },
        title: {
            text: 'Live Data Stream', // Chart title
        },
        xAxis: {
            type: 'datetime', // Configure x-axis to display dates and times
            tickPixelInterval: 150, // Distance between each tick mark on the x-axis
        },
        yAxis: {
            title: {
                text: 'Value', // y-axis title
            },
        },
        legend: {
            enabled: false, // Disable chart legend
        },
        series: [{
            name: 'Live Data', // Series name
            data: data, // Chart data sourced from the state
        }],
    };

    return (
        <div
            style={{
                width: '700px',
                height: '400px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'white',
                padding: '10px'
            }}
        >
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
    );
};

export default App;
