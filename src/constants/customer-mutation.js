import gql from "graphql-tag";

export const CREATE_CUSTOMER = gql`
  mutation createCustomer($name: String, $gender: String) {
    createPost(data: { status: PUBLISHED, name: $name, gender: $gender }) {
      id
      name
      gender
    }
  }
`;
