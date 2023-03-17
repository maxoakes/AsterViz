import {useEffect, useState} from "react";
import { httpClient } from "../services/HttpService";
import { AsteroidResponse } from "./helper";

export function Table()
{
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState('ASC');
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [data, setData] = useState<AsteroidResponse[]>([]);
  const columns = [
    { label: "SPKID", accessor: "spkid" },
    { label: "Name", accessor: "full_name" },
    { label: "NEO", accessor: "neo" },
    { label: "PHA", accessor: "pha" },
    { label: "Absolute Magnitude", accessor: "absmag" },
    { label: "Diameter", accessor: "diameter" },
    { label: "Albedo", accessor: "albedo" },
    { label: "Eccentricity", accessor: "eccentricity" },
    { label: "Semi-Major Axis", accessor: "semimajor_axis" },
    { label: "Perihelion", accessor: "perihelion" },
    { label: "Inclination", accessor: "inclination" },
    { label: "Longitude of Ascending Node", accessor: "asc_node_long" },
    { label: "Argument of Periapsis", accessor: "arg_periapsis" },
    { label: "Mean Anomaly", accessor: "mean_anomaly" },
    { label: "Classification", accessor: "classifications_abbreviation" },
    { label: "Creator", accessor: "users_name" },
  ];

  useEffect(() => {
    console.log(`UPDATE: ${query}, ${order}, ${pageNumber}/${pageSize}`)
    const request = {
      "query": query,
      "order": order,
      "limit": pageSize,
      "offset": (pageSize * (pageNumber-1))
    };
    const fetchAsteroids = async() => {
        console.log(request)
        const response = await httpClient.post(`/asteroid/search`, request);
        console.log(response.data)
        setData(response.data);
    };
    fetchAsteroids().catch(console.error);
  }, [query, order, pageNumber, pageSize]);

  return (
    <>
      <SearchBars setQuery={setQuery} setOrder={setOrder} setPageNumber={setPageNumber} setPageSize={setPageSize} />
      <TableHead columns={columns} />
      <TableBody columns={columns} tableData={data} />
    </>
  )
}

export function TableBody({ tableData, columns }: any)
{
 return (
  <tbody>
   {tableData.map((data: any) => {
    return (
     <tr key={data.spkid}>
      {columns.map(({ accessor }: any) => {
        let cellData = data[accessor];
        if (typeof cellData === "boolean")
        {
          cellData = (cellData) ? "Yes" : "No";
        }
        return <td key={accessor}>{cellData}</td>;
      })}
     </tr>
    );
   })}
  </tbody>
 );
};

export function TableHead({ columns }: any)
{
  return (
    <thead>
    <tr>
      {columns.map(({ label, accessor }: any) => {
        return (
          <th className="table-column" key={accessor}>{label}</th>
        );
      })}
    </tr>
    </thead>
  );
};

type SearchBarProps = {
  setQuery: (query: string) => void,
  setOrder: (order: string) => void,
  setPageNumber: (num: number) => void,
  setPageSize: (num: number) => void,
}
function SearchBars({ setQuery, setOrder, setPageNumber, setPageSize }: any)
{
  let implemented = ["full_name"];
  return (
    <>
      <div className="search-area">
        <input type="text" placeholder="Query" onChange={(e) => setQuery(e.target.value)}/>
        <select onChange={(e) => setOrder(e.target.value)}>
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
        <input type="number" min={1} defaultValue={1} style={{width: 60}} onChange={(e) => setPageNumber(e.target.value)}/>
        <select onChange={(e) => setPageSize(e.target.value)}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={40}>40</option>
          <option value={50}>50</option>
        </select>
      </div>
    </>
  );
}