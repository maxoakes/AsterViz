import axios from "axios";
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
    { label: "SPKID", accessor: "spkid", hint: "Small-Body database lookup name"},
    { label: "Name", accessor: "full_name", hint: "Full formal name of the body" },
    { label: "NEO", accessor: "neo", hint: "Near-Earth Object" },
    { label: "PHA", accessor: "pha", hint: "Potentially Hazardous Asteroid" },
    { label: "Mv", accessor: "absmag", hint: "Absolute Magnitude. The brightness of a celestial object as it would be seen at a standard distance of 10 parsecs." },
    { label: "Albedo", accessor: "albedo", hint: "Fraction of light that the body surface reflects. From reflecting no light (0.0) to reflecting all light (1.0)" },
    { label: "⌀ (km)", accessor: "diameter", hint: "Average diameter of the body in kilometers" },
    { label: "e", accessor: "eccentricity", hint: "Eccentricity. The elongation of the orbit. 0.0 is perfectly circular, 1.0+ is parabolic." },
    { label: "a (km)", accessor: "semimajor_axis", hint: "Semi-major axis of the bodies orbit. From the center of the ellipse to the longest distance. Measured in kilometers" },
    { label: "q (AU)", accessor: "perihelion", hint: "Perihelion. The shortest distance in the orbit between it and the sun. Measured in asternomical units (AU)." },
    { label: "i (deg)", accessor: "inclination", hint: "Inclination. The tilt in degrees from the reference plane." },
    { label: "Ω (deg)", accessor: "asc_node_long", hint: "Longitude of the Ascending Node. The angle in degrees of the ascending node." },
    { label: "ω (deg)", accessor: "arg_periapsis", hint: "Argument of Periapsis. Measures in degrees from the line of the ascending node on the equatorial plane to the point of periapsis passage." },
    { label: "Class", accessor: "classifications_abbreviation", hint: "Classification abbreviation of the body" },
    { label: "Creator", accessor: "users_name",hint: "Creator of the body in this database"  },
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
        setData(response.data);
    };
    fetchAsteroids().catch(console.error);
  }, [query, order, pageNumber, pageSize]);

  return (
    <>
      <DatabaseStats/>
      <SearchBars setQuery={setQuery} setOrder={setOrder} setPageNumber={setPageNumber} setPageSize={setPageSize} />
      <table>
        <TableHead columns={columns} />
        <TableBody columns={columns} tableData={data} />
      </table>
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
        else if (typeof cellData === "number")
        {
          let isDec = (cellData.toString().split('.').length > 1)
          if (isDec && cellData.toString().split('.')[1].length > 4)
            cellData = cellData.toFixed(4)
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
      {columns.map(({ label, accessor, hint }: any) => {
        return (
          <th className="table-column" key={accessor}>
            <abbr title={hint}>{label}</abbr>
          </th>
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
        <input type="text" placeholder="Asteroid Name" onChange={(e) => setQuery(e.target.value)}/>
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

export function DatabaseStats()
{
  const [databaseSize, setDatabaseSize] = useState(0);

  useEffect(() => {
    const fetchSize = async() => {
        const response = await httpClient.get(`/stats/asteroids`);
        setDatabaseSize(response.data);
    };
    fetchSize().catch(console.error);
  }, []);

  return (
    <div className="stats">
      <p>There are {databaseSize} entries in the asteroid database</p>
    </div>
  );
};