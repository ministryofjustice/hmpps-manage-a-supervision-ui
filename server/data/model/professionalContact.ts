// eslint-disable-next-line import/no-cycle

import { Name } from './common'

export interface ProfessionalContact {
  name: Name
  contacts: [Contact]
}

export interface Contact {
  phone: string
  email: string
  provider: string
  probationDeliveryUnit: string
  team: string
  allocatedUntil: string
}
