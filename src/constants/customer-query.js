import gql from "graphql-tag";

// すべての顧客を取得
export const ALL_CUSTOMERS = gql`
  query allPosts {
    posts {
      id
      createdAt
      name
      gender
    }
  }
`;
