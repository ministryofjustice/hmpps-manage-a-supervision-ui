import { Name } from './common'

export interface ProfessionalContact {
  name: Name
  contacts: [Contact]
}

export interface Contact {
  name: string
  telephoneNumber: string
  email: string
  provider: string
  probationDeliveryUnit: string
  team: string
  allocatedUntil: string
}
