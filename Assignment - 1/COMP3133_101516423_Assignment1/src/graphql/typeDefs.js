const gql = require("graphql-tag");

const typeDefs = gql`
  "Standard field-level error object"
  type FieldError {
    field: String
    message: String!
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    created_at: String
    updated_at: String
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
    created_at: String
    updated_at: String
  }

  "Generic responses"
  type UserResponse {
    success: Boolean!
    message: String
    errors: [FieldError!]
    data: User
  }

  type EmployeeResponse {
    success: Boolean!
    message: String
    errors: [FieldError!]
    data: Employee
  }

  type EmployeesResponse {
    success: Boolean!
    message: String
    errors: [FieldError!]
    data: [Employee!]
  }

  type DeleteResponse {
    success: Boolean!
    message: String
  }

  "Login returns token + user (JWT is optional in spec, but good to include) "
  type LoginResponse {
    success: Boolean!
    message: String
    errors: [FieldError!]
    token: String
    user: User
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  "identifier can be username OR email"
  input LoginInput {
    identifier: String!
    password: String!
  }

  "employee_photo will be a Cloudinary URL, or you can pass base64 and upload in resolver"
  input EmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
  }

  input UpdateEmployeeInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: String
    department: String
    employee_photo: String
  }

  type Query {
    "2) Login (Query) - allow user to access system"
    login(input: LoginInput!): LoginResponse!

    "3) Get all employees"
    getAllEmployees: EmployeesResponse!

    "5) Search employee by eid"
    getEmployeeByEid(eid: ID!): EmployeeResponse!

    "8) Search by designation or department"
    searchEmployee(designation: String, department: String): EmployeesResponse!

    "Health check (optional)"
    _health: String
  }

  type Mutation {
    "1) Signup"
    signup(input: SignupInput!): UserResponse!

    "4) Add employee (Cloudinary photo)"
    addEmployee(input: EmployeeInput!): EmployeeResponse!

    "6) Update employee by eid"
    updateEmployeeByEid(eid: ID!, input: UpdateEmployeeInput!): EmployeeResponse!

    "7) Delete employee by eid"
    deleteEmployeeByEid(eid: ID!): DeleteResponse!

    "Health check (optional)"
    _healthMutation: String
  }
`;

module.exports = typeDefs;