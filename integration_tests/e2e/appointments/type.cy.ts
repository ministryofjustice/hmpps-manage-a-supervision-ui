import { after } from 'mocha'
import Page from '../../pages/page'
import AppointmentTypePage from '../../pages/appointments/type.page'
import AppointmentSentencePage from '../../pages/appointments/sentence.page'
import AppointmentLocationPage from '../../pages/appointments/location.page'
import AppointmentDateTimePage from '../../pages/appointments/date-time.page'
import AppointmentRepeatingPage from '../../pages/appointments/repeating.page'
import properties from '../../../server/properties'
import 'cypress-plugin-tab'

// type AppointmentPage = typeof AppointmentTypePage | typeof AppointmentSentencePage

// type PageObject = AppointmentTypePage | AppointmentSentencePage

const crn = 'X778160'
const uuid = '19a88188-6013-43a7-bb4d-6e338516818f'

const completeTypePage = () => {
  const typePage = new AppointmentTypePage()
  typePage.getRadio('type', 1).click()
  typePage.getSubmitBtn().click()
}

const completeSentencePage = () => {
  const sentencePage = new AppointmentSentencePage()
  sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence`).click()
  sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence-licence-condition`).click()
  sentencePage.getSubmitBtn().click()
}

const completeLocationPage = () => {
  const locationPage = new AppointmentLocationPage()
  locationPage.getElement(`#appointments-${crn}-${uuid}-location`).click()
  locationPage.getSubmitBtn().click()
}

const completeDateTimePage = () => {
  const dateTimePage = new AppointmentDateTimePage()
  dateTimePage.getDatePickerToggle().click()
  dateTimePage.getActiveDayButton().click()
  dateTimePage.getElement(`#appointments-${crn}-${uuid}-start-time`).type('9:00am')
  dateTimePage.getElement(`#appointments-${crn}-${uuid}-end-time`).focus().type('9:30am').tab()
  dateTimePage.getSubmitBtn().click()
}

const checkRepeatingPage = () => {
  context('Will the appointment repeat?', () => {
    let repeatingPage: AppointmentRepeatingPage
    before(() => {
      cy.visit(`/case/${crn}/arrange-appointment/${uuid}/type`)
      completeTypePage()
      completeSentencePage()
      completeLocationPage()
      completeDateTimePage()
      repeatingPage = new AppointmentRepeatingPage()
    })
    it('Page is rendered', () => {})

    it('should display the error summary box', () => {
      repeatingPage.getSubmitBtn().click()
      repeatingPage.checkErrorSummaryBox(['Select if the appointment will repeat'])
    })
    it('should display the error message', () => {
      repeatingPage.getElement(`#appointments-${crn}-${uuid}-repeating-error`).should($error => {
        expect($error.text().trim()).to.include('Select if the appointment will repeat')
      })
    })

    // context('Yes is selected', () => {
    it('should display the repeat frequency and count reveal', () => {
      repeatingPage.getElement(`#appointments-${crn}-${uuid}-repeating`).click()
      repeatingPage.getElement(`#conditional-appointments-${crn}-${uuid}-repeating`).should('be.visible')
    })
    // })
  })

  /*
  describe('Will the appointment repeat?', () => {
    let repeatingPage: AppointmentRepeatingPage
    beforeEach(() => {
      cy.visit(`/case/${crn}/arrange-appointment/${uuid}/type`)
      completeTypePage()
      completeSentencePage()
      completeLocationPage()
      completeDateTimePage()
      repeatingPage = new AppointmentRepeatingPage()
    })

    describe('Back link is clicked', () => {})

    describe('Continue is clicked without selecting a repeat option', () => {
      it('should display the error summary box', () => {
        repeatingPage.getSubmitBtn().click()
        repeatingPage.checkErrorSummaryBox(['Select if the appointment will repeat'])
      })
      it('should display the error message', () => {
        repeatingPage.getElement(`#appointments-${crn}-${uuid}-repeating-error`).should($error => {
          expect($error.text().trim()).to.include('Select if the appointment will repeat')
        })
      })
      describe('The error summary link is clicked', () => {
        it('should focus the first radio button', () => {
          repeatingPage.getErrorSummaryLink(1).click()
          repeatingPage.getElement(`#appointments-${crn}-${uuid}-repeating`).should('be.focused')
        })
      })
    })
    describe('Yes is selected', () => {
      it('should display the repeat frequency and count reveal', () => {
        repeatingPage.getElement(`#appointments-${crn}-${uuid}-repeating`).click()
        repeatingPage.getElement(`#conditional-appointments-${crn}-${uuid}-repeating`).should('be.visible')
      })
    })
    describe('No is selected', () => {
      it('should hide the repeat frequency and count reveal', () => {
        repeatingPage.getElement(`#appointments-${crn}-${uuid}-repeating-2`).click()
        repeatingPage.getElement(`#conditional-appointments-${crn}-${uuid}-repeating`).should('not.be.visible')
      })
    })
    describe('Continue is clicked without selecting a repeat frequency or count', () => {
      it('should display the error summary box', () => {
        repeatingPage.getElement(`#appointments-${crn}-${uuid}-repeating`).click()
        repeatingPage.getSubmitBtn().click()
        repeatingPage.checkErrorSummaryBox([
          'Select the frequency the appointment will repeat',
          'Enter the number of times the appointment will repeat',
        ])
      })
      it('should display the error messages', () => {
        repeatingPage.getElement(`#appointments-${crn}-${uuid}-repeating-frequency-error`).should($error => {
          expect($error.text().trim()).to.include('Select the frequency the appointment will repeat')
        })
        repeatingPage.getElement(`#appointments-${crn}-${uuid}-repeating-count-error`).should($error => {
          expect($error.text().trim()).to.include('Enter the number of times the appointment will repeat')
        })
      })
      describe('The first error summary link is clicked', () => {
        it('should focus the first frequency radio button', () => {
          repeatingPage.getErrorSummaryLink(1).click()
          repeatingPage.getElement(`#appointments-${crn}-${uuid}-repeating-frequency`).should('be.focused')
        })
      })
      describe('The second error summary link is clicked', () => {
        beforeEach(() => {
          repeatingPage.getErrorSummaryLink(2).click()
        })
        it('should focus the count field', () => {
          repeatingPage.getElement(`#appointments-${crn}-${uuid}-repeating-count`).should('be.focused')
        })
      })
    })

    describe('Weekly frequency is selected, the continue is clicked', () => {
      beforeEach(() => {
        repeatingPage.getElement(`#appointments-${crn}-${uuid}-repeating-frequency`).click()
        repeatingPage.getSubmitBtn().click()
      })
      it('should display the error summary box', () => {
        repeatingPage.checkErrorSummaryBox(['Enter the number of times the appointment will repeat'])
      })
    })

    describe('An invalid repeat count in entered', () => {
      beforeEach(() => {
        repeatingPage.getElement(`#appointments-${crn}-${uuid}-repeating-frequency`).click()
        repeatingPage.getElement(`#appointments-${crn}-${uuid}-repeating-count`).type('xx')
        repeatingPage.getSubmitBtn().click()
        cy.debug()
      })
      it('should display the error summary box', () => {
        repeatingPage.checkErrorSummaryBox(['Enter a number'])
      })
    })

    // describe('Valid count is entered and continue')
  })
    */
}

const checkDateTimePage = () => {
  describe('Enter the date and time of the appointment', () => {
    let typePage: AppointmentTypePage
    let locationPage: AppointmentLocationPage
    let sentencePage: AppointmentSentencePage
    let dateTimePage: AppointmentDateTimePage
    let repeatingPage: AppointmentRepeatingPage
    beforeEach(() => {
      cy.visit(`/case/${crn}/arrange-appointment/${uuid}/type`)
      typePage = Page.verifyOnPage(AppointmentTypePage)
      typePage.getRadio('type', 1).click()
      typePage.getSubmitBtn().click()
      sentencePage = new AppointmentSentencePage()
      sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence`).click()
      sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence-licence-condition`).click()
      sentencePage.getSubmitBtn().click()
      locationPage = new AppointmentLocationPage()
      locationPage.getElement(`#appointments-${crn}-${uuid}-location`).click()
      locationPage.getSubmitBtn().click()
      dateTimePage = new AppointmentDateTimePage()
    })
    describe('Page is rendered', () => {})

    describe('Back link is clicked', () => {})

    describe('Continue is clicked without selecting a date or time', () => {
      beforeEach(() => {
        dateTimePage.getSubmitBtn().click()
      })
      it('should display the error summary box', () => {
        dateTimePage.checkErrorSummaryBox([
          'Select an appointment date',
          'Select an appointment start time',
          'Select an appointment end time',
        ])
      })
      it('should display the error messages', () => {
        dateTimePage.getElement(`#appointments-${crn}-${uuid}-date-error`).should($error => {
          expect($error.text().trim()).to.include('Select an appointment date')
        })
        dateTimePage.getElement(`#appointments-${crn}-${uuid}-start-time-error`).should($error => {
          expect($error.text().trim()).to.include('Select an appointment start time')
        })
        dateTimePage.getElement(`#appointments-${crn}-${uuid}-end-time-error`).should($error => {
          expect($error.text().trim()).to.include('Select an appointment end time')
        })
      })
    })

    describe('Date is selected', () => {
      const now = new Date()
      const value = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`
      beforeEach(() => {
        dateTimePage.getDatePickerToggle().click()
        dateTimePage.getActiveDayButton().click()
      })
      it('should display the date value in the field', () => {
        dateTimePage.getDatePickerInput().should('have.value', value)
      })
    })
    describe('Start time and end time are selected, continue is clicked', () => {
      beforeEach(() => {
        dateTimePage.getDatePickerToggle().click()
        dateTimePage.getActiveDayButton().click()
        dateTimePage.getElement(`#appointments-${crn}-${uuid}-start-time`).type('9:00am')
        dateTimePage.getElement(`#appointments-${crn}-${uuid}-end-time`).focus().type('9:30am').tab()
        dateTimePage.getSubmitBtn().click()
      })
      it('should redirect to the appointment repeating page', () => {
        repeatingPage = new AppointmentRepeatingPage()
        repeatingPage.checkOnPage()
      })
    })
  })
}

const checkLocationPage = () => {
  describe('Pick a location for this appointment', () => {
    let typePage: AppointmentTypePage
    let locationPage: AppointmentLocationPage
    let sentencePage: AppointmentSentencePage
    let dateTimePage: AppointmentDateTimePage
    beforeEach(() => {
      cy.visit(`/case/${crn}/arrange-appointment/${uuid}/type`)
      typePage = Page.verifyOnPage(AppointmentTypePage)
      typePage.getRadio('type', 1).click()
      typePage.getSubmitBtn().click()
      sentencePage = new AppointmentSentencePage()
      sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence`).click()
      sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence-licence-condition`).click()
      sentencePage.getSubmitBtn().click()
      locationPage = new AppointmentLocationPage()
      locationPage.getSubmitBtn().click()
    })
    describe('Page is rendered', () => {})

    describe('Back link is clicked', () => {})

    describe('Continue is clicked without selecting a location', () => {
      it('should display the error summary box', () => {
        locationPage.checkErrorSummaryBox(['Select an appointment location'])
      })
      it('should display the error message', () => {
        locationPage.getElement(`#appointments-${crn}-${uuid}-location-error`).should($error => {
          expect($error.text().trim()).to.include('Select an appointment location')
        })
      })
    })
    describe('The error summary link is clicked', () => {
      beforeEach(() => {
        locationPage.getErrorSummaryLink(1).click()
      })
      it('should focus the first radio button', () => {
        locationPage.getElement(`#appointments-${crn}-${uuid}-location`).should('be.focused')
      })
    })
    describe('Location is selected, and continue is clicked', () => {
      beforeEach(() => {
        locationPage.getElement(`#appointments-${crn}-${uuid}-location`).click()
        locationPage.getSubmitBtn().click()
      })
      it('should redirect to the date time page', () => {
        dateTimePage = new AppointmentDateTimePage()
        dateTimePage.checkOnPage()
      })
    })
  })
}

const checkSentencePage = (type: number, sentence: number) => {
  describe('Which sentence is this appointment for?', () => {
    let sentencePage: AppointmentSentencePage
    let locationPage: AppointmentLocationPage
    beforeEach(() => {
      sentencePage = Page.verifyOnPage(AppointmentSentencePage)
    })
    if (type === 1) {
      describe('Page is rendered', () => {
        it('should display the hint text', () => {
          sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence-hint`).should($hint => {
            expect($hint.text().trim()).to.eq('Select sentence.')
          })
        })
        it('should not display the licence condition options', () => {
          sentencePage.getElement(`[data-qa="sentence-licence-condition"]`).should('not.be.visible')
        })
        it('should not display the requirement options', () => {
          sentencePage.getElement(`[data-qa="sentence-requirement"]`).should('not.be.visible')
        })
      })
      describe('Back link is clicked', () => {
        let typePage: AppointmentTypePage
        beforeEach(() => {
          sentencePage.getBackLink().click()
          typePage = new AppointmentTypePage()
        })
        after(() => {
          typePage.getSubmitBtn().click()
        })
        it('should be on the type page', () => {
          typePage.checkOnPage()
        })
        it('should persist the type selection', () => {
          typePage.getRadio('type', 1).should('be.checked')
        })
      })
      describe('Continue is clicked without selecting a sentence', () => {
        beforeEach(() => {
          sentencePage.getSubmitBtn().click()
        })
        it('should display the error summary box', () => {
          sentencePage.checkErrorSummaryBox(['Select a sentence'])
        })

        it('should display the error message', () => {
          sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence-error`).should($error => {
            expect($error.text().trim()).to.include('Select a sentence')
          })
        })
        describe('The error summary link is clicked', () => {
          beforeEach(() => {
            sentencePage.getErrorSummaryLink(1).click()
          })
          it('should focus the first radio button', () => {
            sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence`).should('be.focused')
          })
        })
      })
    }
    if (sentence === 1) {
      describe('Sentence with a licence condition is selected', () => {
        beforeEach(() => {
          sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence`).click()
        })
        if ([1, 4].includes(type)) {
          it('should display the licence condition reveal', () => {
            sentencePage.getElement(`[data-qa="sentence-licence-condition"]`).should('be.visible')
            sentencePage.getElement('[data-qa="sentence-licence-condition"] legend').should($legend => {
              expect($legend.text().trim()).to.eq('Which licence condition is this appointment for?')
            })
            sentencePage.getElement('[data-qa="sentence-licence-condition"] .govuk-hint').should($hint => {
              expect($hint.text().trim()).to.eq('Select licence condition.')
            })
          })
          describe('Continue is clicked without selecting a licence condition', () => {
            beforeEach(() => {
              sentencePage.getSubmitBtn().click()
            })
            it('should display the error summary box', () => {
              sentencePage.checkErrorSummaryBox(['Select a licence condition'])
            })
            it('should display the error message', () => {
              sentencePage
                .getElement(`#appointments-${crn}-${uuid}-sentence-licence-condition-error`)
                .should($error => {
                  expect($error.text().trim()).to.include('Select a licence condition')
                })
            })
            it('should persist the sentence selection', () => {
              sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence`).should('be.checked')
            })
            describe('The error summary link is clicked', () => {
              beforeEach(() => {
                sentencePage.getErrorSummaryLink(1).click()
              })

              it('should focus the first radio button', () => {
                sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence-licence-condition`).should('be.focused')
              })
            })
          })
        } else {
          it('should not display the licence condition reveal', () => {
            sentencePage.getElement(`[data-qa="sentence-licence-condition"]`).should('not.exist')
          })
        }
        describe('Continue button is clicked', () => {
          beforeEach(() => {
            if ([1, 4].includes(type)) {
              sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence-licence-condition`).click()
            }
            sentencePage.getSubmitBtn().click()
          })
          it('should redirect to the location page', () => {
            locationPage = new AppointmentLocationPage()
            locationPage.checkOnPage()
          })
          describe('Back link is clicked', () => {
            beforeEach(() => {
              locationPage.getBackLink().click()
              sentencePage = new AppointmentSentencePage()
            })
            it('should be on the sentence page', () => {
              sentencePage.checkOnPage()
            })
            it('should persist the sentence selection', () => {
              sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence`).should('be.checked')
            })
            if ([1, 4].includes(type)) {
              it('should persist the licence condition selection', () => {
                sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence-licence-condition`).should('be.checked')
              })
            }
          })
        })
      })
    }
    if (sentence === 2) {
      describe('Sentence with a requirement is selected', () => {
        beforeEach(() => {
          sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence-2`).click()
        })
        if ([1, 4].includes(type)) {
          it('should display the requirement reveal', () => {
            sentencePage.getElement(`[data-qa="sentence-requirement"]`).should('be.visible')
            sentencePage.getElement('[data-qa="sentence-requirement"] legend').should($legend => {
              expect($legend.text().trim()).to.eq('Which requirement is this appointment for?')
            })
            sentencePage.getElement('[data-qa="sentence-requirement"] .govuk-hint').should($hint => {
              expect($hint.text().trim()).to.eq('Select requirement.')
            })
          })
          describe('Continue is clicked without selecting a requirement', () => {
            beforeEach(() => {
              sentencePage.getSubmitBtn().click()
            })
            it('should display the error summary box', () => {
              sentencePage.checkErrorSummaryBox(['Select a requirement'])
            })
            it('should display the error message', () => {
              sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence-requirement-error`).should($error => {
                expect($error.text().trim()).to.include('Select a requirement')
              })
            })
            it('should persist the sentence selection', () => {
              sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence-2`).should('be.checked')
            })
            describe('The error summary link is clicked', () => {
              beforeEach(() => {
                sentencePage.getErrorSummaryLink(1).click()
              })
              it('should focus the first radio button', () => {
                sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence-requirement`).should('be.focused')
              })
            })
          })
        } else {
          it('should not display the requirement reveal', () => {
            sentencePage.getElement(`[data-qa="sentence-requirement"]`).should('not.exist')
          })
        }
        describe('Continue button is clicked', () => {
          beforeEach(() => {
            if ([1, 4].includes(type)) {
              sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence-requirement`).click()
            }
            sentencePage.getSubmitBtn().click()
          })
          it('should redirect to the location page', () => {
            locationPage = new AppointmentLocationPage()
            locationPage.checkOnPage()
          })
          describe('Back link is clicked', () => {
            beforeEach(() => {
              locationPage.getBackLink().click()
              sentencePage = new AppointmentSentencePage()
            })

            it('should be on the sentence page', () => {
              sentencePage.checkOnPage()
            })
            it('should persist the sentence selection', () => {
              if ([1, 2].includes(type)) {
                sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence`).should('be.checked')
              } else {
                sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence-2`).should('be.checked')
              }
            })
            if ([1, 4].includes(type)) {
              it('should persist the requirement selection', () => {
                sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence-requirement`).should('be.checked')
              })
            }
            after(() => {
              sentencePage.getSubmitBtn().click()
            })
          })
        })
      })
    }
  })
}

describe('Arrange an appointment', () => {
  let page: AppointmentTypePage
  describe('What appointment are you arranging?', () => {
    beforeEach(() => {
      cy.visit(`/case/${crn}/arrange-appointment/${uuid}/type`)
      page = Page.verifyOnPage(AppointmentTypePage)
    })
    it('Page is rendered', () => {
      page.getBackLink().should($backLink => {
        expect($backLink.text()).to.eq('Back')
      })
      page.getBackLink().should('have.attr', 'href', '/')
      for (let i = 1; i < properties.appointmentTypes.length; i += 1) {
        page.getRadioLabel('type', i).should('contain.text', properties.appointmentTypes[i - 1].text)
        page.getRadio('type', i).should('not.be.checked')
      }
      page.getSubmitBtn().should('contain.text', 'Continue')
    })

    describe('Continue is clicked without first selecting a type', () => {
      beforeEach(() => {
        page.getSubmitBtn().click()
      })
      it('should display the error summary box', () => {
        page.checkErrorSummaryBox(['Select an appointment type'])
      })

      it('should display the error message', () => {
        page.getElement(`#appointments-${crn}-${uuid}-type-error`).should($error => {
          expect($error.text().trim()).to.include('Select an appointment type')
        })
      })
      describe('The error summary link is clicked', () => {
        beforeEach(() => {
          page.getErrorSummaryLink(1).click()
        })
        it('should focus the first radio button', () => {
          page.getRadio('type', 1).should('be.focused')
        })
      })
    })

    describe('Home visit', () => {
      beforeEach(() => {
        page.getRadio('type', 1).check()
        page.getSubmitBtn().click()
      })
      checkSentencePage(1, 1)
    })
    describe('Initial appointment - home visit', () => {
      before(() => {
        cy.visit(`/case/${crn}/arrange-appointment/${uuid}/type`)
      })
      beforeEach(() => {
        page.getRadio('type', 2).check()
        page.getSubmitBtn().click()
      })
      checkSentencePage(2, 1)
    })
    describe('Initial appointment - in office', () => {
      before(() => {
        cy.visit(`/case/${crn}/arrange-appointment/${uuid}/type`)
      })
      beforeEach(() => {
        page.getRadio('type', 3).check()
        page.getSubmitBtn().click()
      })
      checkSentencePage(3, 2)
    })
    describe('Planned office visit', () => {
      before(() => {
        cy.visit(`/case/${crn}/arrange-appointment/${uuid}/type`)
      })
      beforeEach(() => {
        page.getRadio('type', 4).check()
        page.getSubmitBtn().click()
      })
      checkSentencePage(4, 2)
    })
  })
  checkLocationPage()
  checkDateTimePage()
  checkRepeatingPage()
})
