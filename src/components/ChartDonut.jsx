import { DonutChart } from '@carbon/charts-react'
import '@carbon/charts-react/styles.css'

export default function ChartUI({chartSetting}) {
    return (
      <>
        {!chartSetting.data ? (
          <p>No chart data available...</p>
        ) : (
          <DonutChart
            data={chartSetting.data}
            options={chartSetting.options}>
          </ DonutChart>
        )}
      </>
    );
}
