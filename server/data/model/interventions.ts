export interface Interventions {
  interventions: Intervention[]
}
export interface Intervention {
  id: string
  referenceNumber?: string
  serviceCategories: string[]
  contractType: string
  referralCreatedAt: string
  referralSentAt?: string
  referralConcludedAt?: string
  interventionTitle: string
  referringOfficer: string
  responsibleOfficer: string
  serviceProviderUser: string
  serviceProviderLocation: string
  serviceProviderName: string
  isDraft: boolean
}
