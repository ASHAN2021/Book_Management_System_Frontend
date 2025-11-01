import { gql } from '@apollo/client';

export const GET_BOOKS = gql`
  query Books {
    books {
      id
      title
      author
      publishedYear
      genre
    }
  }
`;

export const SEARCH_BOOKS = gql`
  query SearchBooks($search: String!) {
    searchBooks(search: $search) {
      id
      title
      author
      publishedYear
      genre
    }
  }
`;

export const GET_BOOK = gql`
  query Book($id: ID!) {
    book(id: $id) {
      id
      title
      author
      publishedYear
      genre
    }
  }
`;

export const ADD_BOOK = gql`
  mutation CreateBook($input: BookInput!) {
    createBook(input: $input) {
      id
      title
      author
      publishedYear
      genre
    }
  }
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $input: BookInput!) {
    updateBook(id: $id, input: $input) {
      id
      title
      author
      publishedYear
      genre
    }
  }
`;

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;