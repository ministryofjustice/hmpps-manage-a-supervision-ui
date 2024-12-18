import { AppointmentType } from '../@types'

interface Type {
  text: string
  value: AppointmentType
}

const appointmentTypes: Type[] = [
  {
    text: 'Home visit',
    value: 'HomeVisitToCaseNS',
  },
  {
    text: 'Initial appointment - home visit',
    value: 'InitialAppointmentHomeVisitNS',
  },
  {
    text: 'Initial appointment - in office',
    value: 'InitialAppointmentInOfficeNS',
  },
  {
    text: 'Planned office visit',
    value: 'PlannedOfficeVisitNS',
  },
]

export default appointmentTypes
