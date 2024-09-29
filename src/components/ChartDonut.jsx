import React, { useEffect, useRef, useState } from 'react';
import { DonutChart } from '@carbon/charts-react';
import PaperView from './ChartPaper'
import '@carbon/charts-react/styles.css';

export default function ChartUI({ chartSetting }) {
  const chartRef = useRef(null); // Reference to the DonutChart DOM element
  const [selectedPaper, setSelectedPaper] = useState(null);
  useEffect(() => {
    const chartInstance = chartRef.current?.chart;
    
    if (chartInstance) {
      chartInstance.services.events.addEventListener('pie-slice-click', (event) => {
        console.log('Pie slice clicked:', event.detail.datum.data);
        setSelectedPaper(event.detail.datum.data);
      });

      // Cleanup event listeners on unmount
      return () => {
        chartInstance.services.events.removeEventListener('pie-slice-mouseover');
        chartInstance.services.events.removeEventListener('pie-slice-click');
      };
    }
  }, [chartSetting]); // Re-run effect when chartSetting changes

  return (
    <>
      {!chartSetting.data ? (
        <p>No chart data available...</p>
      ) : (
        <div className="flex space-x-4">
          <div className={selectedPaper ? "w-1/2" : "w-full"}>
            <DonutChart
              ref={chartRef}
              data={chartSetting.data}
              options={chartSetting.options}
            />
          </div>
          {selectedPaper && (
            <div className="w-1/2">
              <PaperView selectedPaper={selectedPaper} />
            </div>
          )}
        </div>
      )}
    </>
  );
}
