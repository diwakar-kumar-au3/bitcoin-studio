import React, { useEffect } from "react";

import io from "socket.io-client";
import { useState } from "react";

import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";

const socket = io("http://localhost:5000");
function Home() {
  const [data, setdata] = useState([]);
  const [bid, setBid] = useState();
  useEffect(() => {
    socket.on("data", (res) => {
      const {
        ask,
        bid,
        last,
        high,
        low,
        volume,
        display_timestamp,
      } = JSON.parse(res);
      var time = new Date(display_timestamp);
      var hour = time.getHours();
      var min = time.getMinutes();
      var sec = time.getSeconds();
      var timestamp = hour + ":" + min + ":" + sec;
      setBid({ bid: bid, last: last, volume: volume, low: low, high: high });
      setdata((dat) => [...dat, { bid: bid, timestamp: timestamp }]);
    });
  }, []);
  return (
    <div>
      <h3 className="text">
        <u>Bitcoin studio</u>
      </h3>
      {/* {console.log(data)} */}
      <h5 className="text">BITCOIN/U.S. DOLLAR</h5>
      {bid != null ? (
        <>
          <h5 className="text text-primary">
            <b>{bid.bid}</b> USD
          </h5>
          <p
            className={`text ${
              bid.last < bid.bid ? "text-success" : "text-danger"
            }`}
          >
            {(bid.bid - bid.last).toFixed(2)}
          </p>
        </>
      ) : null}

      {bid ? (
        <div className="d-flex justify-content-around">
          <p className="text text-info card alert-success">
            Highest :{bid.high}
          </p>
          <p className="text text-info card alert-danger">Lowest :{bid.low}</p>
          <p className="text text-info card alert-info">
            volume :{bid.volume.toFixed(2)}
          </p>
        </div>
      ) : null}
      <div className="mt-5 ml-5">
        <LineChart width={1000} height={400} data={data}>
          <XAxis dataKey="timestamp" domain={["auto", "auto"]} />
          <YAxis dataKey="bid" domain={["auto", "auto"]} />
          <CartesianGrid stroke="#f5f5f5" />
          <Line type="monotone" dataKey="bid" strokeWidth={2} />
        </LineChart>
      </div>
    </div>
  );
}
export default Home;
