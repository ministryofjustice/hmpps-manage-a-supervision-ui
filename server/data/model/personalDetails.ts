// eslint-disable-next-line import/no-cycle
import { Name, PersonalCircumstance, PersonSummary } from './common'

export interface PersonalDetails {
  crn: string
  name: Name
  contacts: PersonalContact[]
  mainAddress?: PersonAddress
  otherAddresses: PersonAddress[]
  preferredGender: string
  dateOfBirth: string
  preferredName?: string
  previousSurname?: string
  aliases: Name[]
  telephoneNumber?: string
  mobileNumber?: string
  email?: string
  circumstances: Circumstances
  disabilities: Disabilities
  provisions: Provisions
  pnc?: string
  sex: string
  religionOrBelief?: string
  sexualOrientation?: string
  documents: Document[]
}

export interface PersonalContact {
  name: Name
  relationship?: string
  relationshipType: string
  address?: Address
  notes?: string
  lastUpdated?: string
  lastUpdatedBy?: Name
}

export interface Address {
  officeName?: string
  buildingName?: string
  buildingNumber?: string
  streetName?: string
  district?: string
  town?: string
  county?: string
  postcode?: string
  ldu?: string
  lastUpdated?: string
  lastUpdatedBy?: Name
}

export interface PersonAddress {
  buildingName?: string
  buildingNumber?: string
  streetName?: string
  district?: string
  town?: string
  county?: string
  postcode?: string
  telephoneNumber?: string
  lastUpdated?: string
  lastUpdatedBy?: Name
  from: string
  to: string
  type?: string
  status?: string
}

export interface Circumstances {
  circumstances: PersonalCircumstance[]
  lastUpdated?: string
}

export interface Disabilities {
  disabilities: string[]
  lastUpdated?: string
}

export interface Provisions {
  provisions: string[]
  lastUpdated?: string
}

export interface Document {
  id: string
  name: string
  lastUpdated?: string
}

export interface ProvisionOverview {
  personSummary: PersonSummary
  provisions: Provision[]
}

export interface Provision {
  description: string
  notes?: string
  lastUpdated: string
  lastUpdatedBy: Name
}

export interface CircumstanceOverview {
  personSummary: PersonSummary
  circumstances: Circumstance[]
}

export interface Circumstance {
  type: string
  subType: string
  notes?: string
  verified: boolean
  startDate: string
  lastUpdated: string
  lastUpdatedBy: Name
}

export interface DisabilityOverview {
  personSummary: PersonSummary
  disabilities: Disability[]
}

export interface Disability {
  description: string
  notes?: string
  lastUpdated: string
  lastUpdatedBy: Name
}
