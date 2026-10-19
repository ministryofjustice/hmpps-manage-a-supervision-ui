import PrisonerSearchApiClient, { Prisoner } from '../data/prisonerSearchApiClient'
import logger from '../../logger'
import { PersonalDetails } from '../data/model/personalDetails'
import { SupervisionPackage } from '../models/SupervisionPackage'

export async function getStatusTag(
  personalDetails: PersonalDetails,
  supervisionPackage: SupervisionPackage,
  prisoner?: Prisoner,
): Promise<string | undefined> {
  if (personalDetails?.dateOfDeath !== undefined) {
    return 'Deceased'
  }

  const statusTagForPersonInCustody = await getStatusTagForPersonInCustody(prisoner)

  if (statusTagForPersonInCustody !== undefined) {
    return statusTagForPersonInCustody
  }
  // determine from community sentence
  if (supervisionPackage?.outcome === 'success') {
    const activePrimarySentences = supervisionPackage?.context?.sentences?.filter(
      sentence => sentence.isPrimarySentence,
    )

    // has custodial sentence and custody status cannot be determined
    if (activePrimarySentences?.filter(sentence => sentence.type.isCustodial)?.length) {
      return 'In custody'
    }
    // check for breach in community sentence
    const inBreach = activePrimarySentences?.filter(sentence => sentence.inBreach)?.length > 0
    if (inBreach) {
      return 'In breach'
    }
  }

  return undefined
}

export async function getStatusTagForPersonInCustody(prisoner?: Prisoner): Promise<string> {
  if (prisoner?.legalStatus === 'DEAD') {
    return 'Deceased'
  }

  if (prisoner?.lastMovementReasonCode === 'UAL') {
    return prisoner?.recall ? 'Recalled - Unlawfully at large' : 'Unlawfully at large'
  }

  if (prisoner?.status === 'ACTIVE IN' || prisoner?.status === 'ACTIVE OUT') {
    return prisoner?.recall ? 'Recalled - In custody' : 'In custody'
  }

  return undefined
}

export async function getPrisonerDetails(token: string, nomisNumber: string, crn: string): Promise<Prisoner | null> {
  const prisonerSearchApiClient = new PrisonerSearchApiClient(token)

  try {
    return await prisonerSearchApiClient.getPrisonerDetails(nomisNumber)
  } catch (e) {
    logger.error(`Failed to get prisoner details for NOMS number: ${nomisNumber} CRN: ${crn}`, e)
    return undefined
  }
}
