import { GroupedBarChart } from '@carbon/charts-react'
import '@carbon/charts-react/styles.css'

export default function BarChart({chartSetting}) {
    return (
      <>
        {!chartSetting.data ? (
          <p>No chart data available...</p>
        ) : (
          <GroupedBarChart
            data={chartSetting.data}
            options={chartSetting.options}>
          </ GroupedBarChart>
        )}
      </>
    );
}
