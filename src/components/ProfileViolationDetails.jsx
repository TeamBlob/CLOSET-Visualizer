import { Card, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom"


const TABLE_HEAD = ["Paper ID", "Reviewer", "Type", ""];
 
export function ViolationTable({type, data}) {
  console.log(type, data, data.length > 0 && data[0].coi_paper)
  if (data.length === 0) {
    // Handle case when location.state is null or undefined
    return (
      <Card className="h-full w-full overflow-scroll">
        <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-y-0 md:space-x-8"> 
        <Typography variant="big" color="blue-gray" className="font-bold">There is no {type} violation recorded for this profile.</Typography>
      </div>
      </Card>
      
    )

}

  return (
    <Card className="h-full w-full overflow-scroll">
      <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-y-0 md:space-x-8"> 
        <Typography variant="big" color="blue-gray" className="font-bold">{type} Violation</Typography>
      </div>
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 && data.map((violation, index) => {
            const isLast = index === data.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
 
            return (
              <tr key={violation.coi_paper.key}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {violation.coi_paper.pageId}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {violation.coi_paper.reviewer[0].name}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {violation.type}
                  </Typography>
                </td>
                <td className={classes}>
                  <Link to={{ pathname: `/coidetails/${violation.coi_paper.key}`}} state= {{ coi_data: violation.coi_paper, type: violation.type}} className="flex min-w-0 gap-x-4" >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      View
                    </Typography>
                  </Link>

                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}