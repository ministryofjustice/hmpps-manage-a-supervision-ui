import { Name, PersonalCircumstance } from './common'

export interface PersonalDetails {
  crn: string
  name: Name
  contacts: PersonalContact[]
  mainAddress?: Address
  otherAddresses: Address[]
  preferredGender: string
  dateOfBirth: string
  preferredName?: string
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
}

export interface Address {
  buildingName?: string
  buildingNumber?: string
  streetName?: string
  district?: string
  town?: string
  county?: string
  postcode?: string
  lastUpdated?: string
}

export interface PersonAddress extends Address {
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
