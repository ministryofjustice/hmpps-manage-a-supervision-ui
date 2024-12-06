const ruleKeys = ['isInvalid', 'isEmpty'] as const
const appointmentsKeys = ['type', 'location', 'date', 'start-time', 'end-time'] as const
type Rule = (typeof ruleKeys)[number]
type AppointmentInput = (typeof appointmentsKeys)[number]

interface ErrorMessages {
  appointments: {
    [key in AppointmentInput]: {
      log: string
      errors: {
        [ruleKey in Rule]?: string
      }
    }
  }
}

const errorMessages: ErrorMessages = {
  appointments: {
    type: {
      log: 'Appointment type not selected',
      errors: {
        isEmpty: 'Select an appointment type',
      },
    },
    location: {
      log: 'Location not selected',
      errors: {
        isEmpty: 'Select an appointment location',
      },
    },
    date: {
      log: 'Appointment date not selected',
      errors: {
        isEmpty: 'Select an appointment date',
      },
    },
    'start-time': {
      log: 'Appointment start time not selected',
      errors: {
        isEmpty: 'Select an appointment start time',
      },
    },
    'end-time': {
      log: 'Appointment end time not selected',
      errors: {
        isEmpty: 'Select an appointment end time',
      },
    },
  },
}

export default errorMessages
