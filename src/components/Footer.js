import React from "react";
import { Link } from "gatsby";
import { Grid } from "@material-ui/core";

import twitter from "../img/social/twitter.svg";

const Footer = class extends React.Component {
  render() {
    return (
      <footer className="footer has-background-black has-text-white-ter">
        <div className="content has-text-centered has-background-black has-text-white-ter">
          <div className="container has-background-black has-text-white-ter">
            <Grid
              style={{ maxWidth: "100vw" }}
              container
              direction="row"
              justify="space-around"
            >
              <Grid item xs={6}>
                <section className="menu">
                  <ul className="menu-list">
                    <li>
                      <Link to="/" className="navbar-item">
                        Home
                      </Link>
                    </li>
                    <li>
                      <a
                        className="navbar-item"
                        href="/admin/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Admin
                      </a>
                    </li>
                  </ul>
                </section>
              </Grid>
              <Grid
                container
                item
                xs={6}
                justify="flex-end"
                alignItems="center"
              >
                <div className="social">
                  <a title="twitter" href="https://twitter.com/camdencodes">
                    <img
                      className="fas fa-lg"
                      src={twitter}
                      alt="Twitter"
                      style={{ width: "1em", height: "1em" }}
                    />
                  </a>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </footer>
    );
  }
};

export default Footer;
