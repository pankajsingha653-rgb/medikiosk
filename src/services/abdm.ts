// ABDM (Ayushman Bharat Digital Mission) and HL7 FHIR R4 Integration-Ready Bridge

export interface AbhaVerificationResult {
  status: 'demo_verified' | 'failed';
  abhaNumber: string;
  abhaAddress: string;
  name: string;
  gender: string;
  yearOfBirth: string;
  authMethod: 'DEMO_MOCK' | 'AADHAAR_OTP' | 'MOBILE_OTP';
  message: string;
}

export interface FhirBundlePlaceholder {
  resourceType: 'Bundle';
  type: 'collection';
  timestamp: string;
  entry: Array<{
    fullUrl: string;
    resource: {
      resourceType: string;
      id: string;
      [key: string]: any;
    };
  }>;
}

export class AbdmFhirBridge {
  public static readonly STATUS = 'Prototype / Integration Ready (Sandboxed)';
  public static readonly SPEC_VERSION = 'HL7 FHIR R4 / ABDM M1, M2, M3 Draft';

  // Placeholder for ABHA Discovery
  public static verifyAbhaDemo(abhaInput: string): AbhaVerificationResult {
    const clean = abhaInput.replace(/\s+/g, '');
    return {
      status: 'demo_verified',
      abhaNumber: clean.length > 5 ? clean : '91-4829-1024-5512',
      abhaAddress: `${clean.toLowerCase().replace(/[^a-z0-9]/g, '') || 'patient'}@sbx`,
      name: 'Demonstration Patient',
      gender: 'M',
      yearOfBirth: '1974',
      authMethod: 'DEMO_MOCK',
      message: 'Verified via ABDM Sandbox Simulator. Ready for live Gateway keys.'
    };
  }

  // FHIR Bundle Generator for Clinical Case and Documents
  public static generateFhirBundle(patient: any, clinicalCase: any, documents: any[] = []): FhirBundlePlaceholder {
    return {
      resourceType: 'Bundle',
      type: 'collection',
      timestamp: new Date().toISOString(),
      entry: [
        {
          fullUrl: `urn:uuid:patient-${patient.id}`,
          resource: {
            resourceType: 'Patient',
            id: patient.id,
            identifier: [
              {
                system: 'https://healthid.ndhm.gov.in',
                value: patient.abhaId || '91-4829-1024-5512'
              }
            ],
            name: [{ text: patient.fullName }],
            gender: patient.gender?.toLowerCase() || 'unknown',
            birthDate: `${new Date().getFullYear() - (patient.age || 40)}-01-01`
          }
        },
        {
          fullUrl: `urn:uuid:composition-${Date.now()}`,
          resource: {
            resourceType: 'Composition',
            id: `comp-${clinicalCase.id || Date.now()}`,
            status: clinicalCase.physicianReviewed ? 'final' : 'preliminary',
            type: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '371530004',
                  display: 'Clinical consultation report'
                }
              ],
              text: 'MediKiosk Clinical Intake Summary'
            },
            title: 'Patient Intake & Clinical History Record',
            date: new Date().toISOString(),
            section: [
              {
                title: 'Chief Complaints',
                text: {
                  status: 'generated',
                  div: `<div>${clinicalCase.chiefComplaints?.map((c: any) => `${c.complaint} (${c.duration})`).join(', ') || 'None'}</div>`
                }
              },
              {
                title: 'History of Present Illness',
                text: {
                  status: 'generated',
                  div: `<div>${clinicalCase.hpiNarrative || ''}</div>`
                }
              },
              {
                title: 'Uploaded Documents',
                text: {
                  status: 'generated',
                  div: `<div>${documents.map(d => `${d.documentType}: ${d.title}`).join('; ')}</div>`
                }
              }
            ]
          }
        }
      ]
    };
  }

  // Push to Personal Health Record (PHR) sandbox endpoint
  public static async pushToPhr(_abhaId: string, _bundle: any): Promise<{ success: boolean; transactionId: string }> {
    // Sandboxed ABDM Milestone 2 / 3 simulation
    await new Promise(res => setTimeout(res, 500));
    return {
      success: true,
      transactionId: `TXN-ABDM-${Date.now()}`
    };
  }

  // FHIR Composition Resource generator for structured history
  public static generateFhirClinicalComposition(patientId: string, summary: any): FhirBundlePlaceholder {
    return {
      resourceType: 'Bundle',
      type: 'collection',
      timestamp: new Date().toISOString(),
      entry: [
        {
          fullUrl: `urn:uuid:patient-${patientId}`,
          resource: {
            resourceType: 'Patient',
            id: patientId,
            identifier: [
              {
                system: 'https://healthid.ndhm.gov.in',
                value: summary.abhaId || '91-4829-1024-5512'
              }
            ],
            name: [{ text: summary.patientName }]
          }
        },
        {
          fullUrl: `urn:uuid:composition-${Date.now()}`,
          resource: {
            resourceType: 'Composition',
            id: `comp-${Date.now()}`,
            status: 'preliminary',
            type: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '371530004',
                  display: 'Clinical consultation report'
                }
              ],
              text: 'MediKiosk Clinical Intake Summary'
            },
            title: 'Patient Intake & Clinical History Record',
            date: new Date().toISOString()
          }
        }
      ]
    };
  }
}
