import React from "react";
import PropTypes from "prop-types";
import { Link, graphql, StaticQuery } from "gatsby";
import { Grid } from "@material-ui/core";

class BlogRoll extends React.Component {
  render() {
    const { data } = this.props;
    const { edges: posts } = data.allMarkdownRemark;

    return (
      <Grid container justify="center" direction="row">
        {posts &&
          posts.map(({ node: post }) => (
            <Grid
              item
              xs={12}
              sm={10}
              md={8}
              key={post.id}
              style={{ marginTop: "1rem" }}
            >
              <article
                className={`blog-list-item tile is-child box notification`}
              >
                <header>
                  <Grid container direction="row" justify="flex-start">
                    <Grid item xs={12}>
                      <Link className="title is-size-4" to={post.fields.slug}>
                        {post.frontmatter.title}
                      </Link>
                    </Grid>
                    <Grid item xs={12}>
                      <div>{post.frontmatter.date}</div>
                    </Grid>
                  </Grid>
                </header>
                <p>
                  {post.excerpt}
                  <br />
                  <br />
                  <Link className="button" to={post.fields.slug}>
                    Keep Reading →
                  </Link>
                </p>
              </article>
            </Grid>
          ))}
      </Grid>
    );
  }
}

BlogRoll.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
};

export default () => (
  <StaticQuery
    query={graphql`
      query BlogRollQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
        ) {
          edges {
            node {
              excerpt(pruneLength: 400)
              id
              fields {
                slug
              }
              frontmatter {
                title
                templateKey
                date(formatString: "MMMM DD, YYYY")
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <BlogRoll data={data} count={count} />}
  />
);
