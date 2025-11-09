import { useEffect } from "react";
import "./Landing.css";
import { FetchReadme } from "../lib/github";

export default function Landing() {
  useEffect(() => {
    FetchReadme();
  }, []);

  return (
    <div className="container">
      <div className="content">
        <h1 className="title">
          Awesome
          <br />
          Hackathon
        </h1>

        <p className="description">
          <span className="description-normal">
            Everything you need for the{" "}
          </span>
          <span className="description-gradient">Awesome Hackathon</span>
        </p>

        <a href="#" className="explore-btn">
          <span className="explore-text">Under Development</span>
          {/* <div className="arrow"></div> */}
        </a>
      </div>
    </div>
  );
}
