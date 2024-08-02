// eslint-disable-next-line import/no-extraneous-dependencies
import * as dotenv from 'dotenv'
// eslint-disable-next-line import/no-cycle
import { testEnvironmentData } from './environments/test'

// Define the Person interface
export interface Person {
  crn: string
  firstName: string
  lastName: string
  sex: string
  dob: string
  pnc: string
}

// Define the TestData class
export class TestData {
  person: Person
}

// Initialize dotenv
dotenv.config() // Read environment variables into process.env

// Function to get environment data
const getEnvironmentData = (): TestData => {
  if (process.env.ENV === 'test') {
    return testEnvironmentData
  }
  if (process.env.ENV === 'pre-prod') {
    // Make sure to define and import preProdEnvironmentData if you use it
    // return preProdEnvironmentData
    throw new Error('Pre-prod environment data is not yet defined.')
  } else {
    throw new Error(`Unexpected environment: ${process.env.ENV}. Make sure you set the ENV variable correctly.`)
  }
}

// Initialize the `data` object with environment data
export const data: TestData = getEnvironmentData()
