import React from "react";
import { Link } from "gatsby";

import Layout from "../components/Layout";
import BlogRoll from "../components/BlogRoll";

export const IndexPageTemplate = () => (
  <div>
    <div className="column container is-12">
      <BlogRoll />
      <div
        className="column is-12 has-text-centered"
        style={{ marginTop: "2rem" }}
      >
        <Link className="btn" to="/blog">
          Read more
        </Link>
      </div>
    </div>
  </div>
);

const IndexPage = () => {
  return (
    <Layout>
      <IndexPageTemplate />
    </Layout>
  );
};

export default IndexPage;
