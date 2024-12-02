const ruleKeys = ['isInvalid', 'isEmpty'] as const
const appointmentsKeys = ['type', 'location'] as const
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
  },
}

export default errorMessages
