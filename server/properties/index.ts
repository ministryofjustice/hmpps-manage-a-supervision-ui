import errorMessages from './errorMessages'
import appointmentTypes from './appointmentTypes'
import {
  charsOrLess,
  isEmail,
  isNotEmpty,
  isNotLaterThan,
  isNotLaterThanToday,
  isNumeric,
  isUkPostcode,
  isValidDate,
  ValidationSpec,
} from '../utils/validationUtils'

const validate = {
  errorMessages,
  appointmentTypes,
}

export default validate

export const personDetailsValidation: ValidationSpec = {
  phoneNumber: {
    optional: true,
    checks: [
      {
        validator: isNumeric,
        msg: 'Enter a phone number in the correct format.',
      },
      {
        validator: charsOrLess,
        length: 35,
        msg: `Phone number must be 35 characters or less.`,
      },
    ],
  },
  mobileNumber: {
    optional: true,
    checks: [
      {
        validator: isNumeric,
        msg: 'Enter a mobile number in the correct format.',
      },
      {
        validator: charsOrLess,
        length: 35,
        msg: `Mobile number must be 35 characters or less.`,
      },
    ],
  },
  emailAddress: {
    optional: true,
    checks: [
      {
        validator: isEmail,
        msg: 'Enter an email address in the correct format.',
      },
      {
        validator: charsOrLess,
        length: 35,
        msg: `Mobile number must be 35 characters or less.`,
      },
    ],
  },
  buildingName: {
    optional: true,
    checks: [
      {
        validator: charsOrLess,
        length: 35,
        msg: `Building name must be 35 characters or less.`,
      },
    ],
  },
  buildingNumber: {
    optional: true,
    checks: [
      {
        validator: charsOrLess,
        length: 35,
        msg: `House number must be 35 characters or less.`,
      },
    ],
  },
  streetName: {
    optional: true,
    checks: [
      {
        validator: charsOrLess,
        length: 35,
        msg: `Street name must be 35 characters or less.`,
      },
    ],
  },
  district: {
    optional: true,
    checks: [
      {
        validator: charsOrLess,
        length: 35,
        msg: `District must be 35 characters or less.`,
      },
    ],
  },
  town: {
    optional: true,
    checks: [
      {
        validator: charsOrLess,
        length: 35,
        msg: `Town or city must be 35 characters or less.`,
      },
    ],
  },
  county: {
    optional: true,
    checks: [
      {
        validator: charsOrLess,
        length: 35,
        msg: `County must be 35 characters or less.`,
      },
    ],
  },
  postcode: {
    optional: true,
    checks: [
      {
        validator: isUkPostcode,
        msg: 'Enter a full UK postcode.',
      },
    ],
  },
  addressTypeCode: {
    optional: false,
    checks: [
      {
        validator: isNotEmpty,
        msg: 'Select an address type.',
      },
    ],
  },
  verified: {
    optional: false,
    checks: [
      {
        validator: isNotEmpty,
        msg: 'Select yes if the address is verified.',
      },
    ],
  },
  startDate: {
    optional: false,
    checks: [
      {
        validator: isNotEmpty,
        msg: 'Enter or select a start date.',
      },
      {
        validator: isValidDate,
        msg: 'Enter or select a start date.',
      },
      {
        validator: isNotLaterThanToday,
        msg: 'Start date can not be later than today.',
      },
    ],
  },
  endDate: {
    optional: true,
    checks: [
      {
        validator: isValidDate,
        msg: 'Enter or select an end date.',
      },
      {
        validator: isNotLaterThanToday,
        msg: 'End date can not be later than today.',
      },
      {
        validator: isNotLaterThan,
        crossField: 'startDate',
        msg: 'End date can not be earlier than the start date.',
      },
    ],
  },
}
