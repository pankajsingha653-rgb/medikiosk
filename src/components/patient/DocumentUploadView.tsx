import { useState } from 'react';
import {
  Upload,
  Camera,
  FileText,
  FileCheck,
  Trash2,
  Eye,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { MedicalDocument, Patient, TimelineEvent } from '../../types';
import { ClinicalAiService } from '../../services/ai';
import { db } from '../../services/db';

interface DocumentUploadViewProps {
  patient: Patient;
  documents: MedicalDocument[];
  onDocumentsUpdated: (docs: MedicalDocument[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function DocumentUploadView({
  patient,
  documents,
  onDocumentsUpdated,
  onContinue,
  onBack
}: DocumentUploadViewProps) {
  const [selectedType, setSelectedType] = useState<MedicalDocument['documentType']>('Prescription');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [processingDocTitle, setProcessingDocTitle] = useState('');
  const [previewDoc, setPreviewDoc] = useState<MedicalDocument | null>(null);

  const STAGES = [
    'Reading document and verifying quality',
    'Extracting text and digital handwriting',
    'Identifying clinical entities (diagnoses, drugs, labs)',
    'Organizing information into clinical taxonomy',
    'Adding to longitudinal medical timeline'
  ];

  const handleSimulateUpload = async (docType: MedicalDocument['documentType'], titleName?: string) => {
    setIsProcessing(true);
    setCurrentStage(1);
    const title = titleName || `${docType} - ${new Date().toLocaleDateString()}`;
    setProcessingDocTitle(title);

    // Step through the 5 OCR stages
    for (let s = 1; s <= 5; s++) {
      setCurrentStage(s);
      await new Promise(r => setTimeout(r, 650));
    }

    // Call OCR simulation service
    const extracted = await ClinicalAiService.simulateOcrExtraction(docType, title);

    const newDoc: MedicalDocument = {
      id: `DOC-${Date.now()}`,
      patientId: patient.id,
      title,
      documentType: docType,
      documentDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      fileUrl: '/docs/sample_medical_doc.pdf',
      status: 'processed',
      extractedData: extracted,
      isVerifiedByPhysician: false
    };

    db.addDocument(newDoc);

    // Also append to medical timeline
    const timelineEv: TimelineEvent = {
      id: `tl-${Date.now()}`,
      patientId: patient.id,
      year: '2026',
      month: 'September',
      dateStr: newDoc.documentDate,
      type: docType === 'Prescription' ? 'prescription' : docType === 'Laboratory Report' ? 'investigation' : 'consultation',
      title: `${docType}: ${extracted.diagnoses[0] || 'Clinical Review'}`,
      institution: 'Hospital Archive / Kiosk Upload',
      summary: extracted.medications.length > 0
        ? `Medications: ${extracted.medications.map(m => m.name).join(', ')}`
        : `Extracted data: ${extracted.diagnoses.join(', ')}`,
      documentId: newDoc.id
    };
    db.addTimelineEvent(timelineEv);

    const updated = [newDoc, ...documents];
    onDocumentsUpdated(updated);
    setIsProcessing(false);
  };

  const handleFileDrop = (e: { preventDefault: () => void; dataTransfer: { files: FileList } }) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleSimulateUpload(selectedType, file.name);
    }
  };

  const handleRemoveDoc = (docId: string) => {
    const updated = documents.filter(d => d.id !== docId);
    onDocumentsUpdated(updated);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Progress Bar (Step 3/4) */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 mb-2">
          <span className="text-[#6C3FC5] font-bold">Step 3 of 5: Document Upload & AI OCR</span>
          <span>Estimated total time: 8–12 minutes</span>
        </div>
        <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
          <div className="bg-[#6C3FC5] h-full rounded-full transition-all duration-300 w-[75%]" />
        </div>
      </div>

      {/* Screen Title */}
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
          Do you have previous medical documents?
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto">
          Scan or upload previous doctor prescriptions, laboratory reports, discharge summaries, or imaging tests.
        </p>
      </div>

      {/* OCR Processing Overlay modal */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-8 shadow-2xl border border-neutral-200 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto border border-neutral-200">
              <Loader2 className="w-8 h-8 text-[#6C3FC5] animate-spin" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-neutral-900">
                Analyzing your document...
              </h3>
              <p className="text-xs text-neutral-500 mt-1 font-mono">{processingDocTitle}</p>
            </div>

            {/* 5-Stage Progression List */}
            <div className="text-left space-y-2.5 bg-neutral-50 p-4 rounded-md border border-neutral-200 text-xs">
              {STAGES.map((st, i) => {
                const stageNum = i + 1;
                const isCurrent = stageNum === currentStage;
                const isDone = stageNum < currentStage;
                return (
                  <div key={st} className="flex items-center gap-2.5">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 ${
                        isDone
                          ? 'bg-[#6C3FC5] text-white'
                          : isCurrent
                          ? 'border-2 border-[#6C3FC5] text-[#6C3FC5] bg-white animate-pulse'
                          : 'bg-neutral-200 text-neutral-400'
                      }`}
                    >
                      {isDone ? '✓' : stageNum}
                    </div>
                    <span className={isCurrent ? 'font-bold text-neutral-900' : isDone ? 'text-neutral-700' : 'text-neutral-400'}>
                      {st}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] text-neutral-500">
              AI-assisted extraction. Information will be presented for verification.
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Zone */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm space-y-6">
        {/* Document Type Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
            Select Document Category:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-medium">
            {(['Prescription', 'Laboratory Report', 'Discharge Summary', 'Imaging Report', 'Previous Consultation'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedType(t)}
                className={`py-2 px-2.5 rounded border text-center transition-colors ${
                  selectedType === t
                    ? 'bg-[#6C3FC5] text-white border-[#6C3FC5] font-bold'
                    : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Drag & Drop Desktop Area + Responsive Mobile Buttons */}
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={handleFileDrop}
          className="border-2 border-dashed border-neutral-200 hover:border-[#6C3FC5] rounded-2xl p-6 sm:p-8 text-center transition-colors bg-[#F3EEFC]/20"
        >
          <div className="w-14 h-14 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center mx-auto text-[#6C3FC5] mb-3 shadow-xs">
            <Upload className="w-6 h-6" />
          </div>

          <h4 className="font-serif text-base sm:text-lg font-bold text-[#171717] mb-1">
            Drag and drop your file here, or choose an option
          </h4>
          <p className="text-xs text-[#666666] mb-5">
            Supports PDF, JPG, PNG formats up to 25MB with AI text extraction.
          </p>

          {/* Desktop & Mobile Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
            {/* Take Photo button */}
            <button
              type="button"
              onClick={() => handleSimulateUpload(selectedType, `Camera Capture - ${selectedType}`)}
              className="w-full px-5 py-3.5 bg-white border-2 border-[#6C3FC5] hover:bg-[#F3EEFC] text-[#6C3FC5] font-bold text-sm rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-xs min-h-[48px]"
            >
              <Camera className="w-5 h-5 text-[#6C3FC5]" />
              <span>Take Photo</span>
            </button>

            {/* Standard file picker */}
            <button
              type="button"
              onClick={() => handleSimulateUpload(selectedType)}
              className="w-full px-5 py-3.5 bg-[#6C3FC5] hover:bg-[#4B238C] text-white font-bold text-sm rounded-xl shadow-xs flex items-center justify-center gap-2.5 transition-all min-h-[48px]"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>

        {/* Supported Document Category Pill Tags */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-500">
          <span className="font-semibold text-neutral-700">Supported:</span>
          <span className="px-2.5 py-1 bg-neutral-100 rounded border border-neutral-200">Prescription</span>
          <span className="px-2.5 py-1 bg-neutral-100 rounded border border-neutral-200">Laboratory Report</span>
          <span className="px-2.5 py-1 bg-neutral-100 rounded border border-neutral-200">Discharge Summary</span>
          <span className="px-2.5 py-1 bg-neutral-100 rounded border border-neutral-200">Imaging Report</span>
          <span className="px-2.5 py-1 bg-neutral-100 rounded border border-neutral-200">Previous Consultation</span>
        </div>
      </div>

      {/* Uploaded Documents List */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-neutral-900">
            Uploaded Documents ({documents.length})
          </h3>
          <span className="text-xs text-neutral-500">
            All documents will be accessible to the consulting physician.
          </span>
        </div>

        {documents.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-neutral-800 text-sm">No previous documents</h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                You haven't uploaded any previous medical documents. If you don't have paper records with you, you can continue directly to review.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSimulateUpload('Prescription')}
              className="px-4 py-2 bg-white border border-neutral-300 text-xs font-bold text-neutral-800 rounded hover:bg-neutral-50"
            >
              Upload Document
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map(doc => (
              <div
                key={doc.id}
                className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[#6C3FC5] flex-shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900 text-sm">{doc.title}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-neutral-100 rounded text-neutral-700">
                        {doc.documentType}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      Date: {doc.documentDate} • Status: <span className="font-semibold text-neutral-800">{doc.status}</span>
                    </div>

                    {/* AI-Extracted summary chip */}
                    {doc.extractedData && (
                      <div className="mt-2 text-xs bg-neutral-50 border border-neutral-200 p-2 rounded text-neutral-700">
                        <div className="flex items-center gap-1 font-bold text-neutral-900 mb-0.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#6C3FC5]" />
                          <span>AI-extracted information. Please verify:</span>
                        </div>
                        <div className="space-y-0.5 text-[11px]">
                          {doc.extractedData.diagnoses.length > 0 && (
                            <div>• Diagnoses: {doc.extractedData.diagnoses.join(', ')}</div>
                          )}
                          {doc.extractedData.medications.length > 0 && (
                            <div>• Medications: {doc.extractedData.medications.map(m => `${m.name} (${m.dosage})`).join(', ')}</div>
                          )}
                          {doc.extractedData.investigations.length > 0 && (
                            <div>• Investigations: {doc.extractedData.investigations.map(i => `${i.test}: ${i.result} ${i.unit || ''}`).join(', ')}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setPreviewDoc(doc)}
                    className="p-2 border border-neutral-300 rounded text-neutral-700 hover:text-[#6C3FC5] hover:border-[#6C3FC5] text-xs flex items-center gap-1 font-semibold"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(doc.id)}
                    className="p-2 border border-neutral-300 rounded text-neutral-500 hover:text-[#6C3FC5] hover:border-[#6C3FC5]"
                    title="Remove Document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <h3 className="text-base font-bold text-neutral-900">{previewDoc.title}</h3>
                <span className="text-xs text-neutral-500">{previewDoc.documentType} • {previewDoc.documentDate}</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="text-neutral-400 hover:text-neutral-900 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Split layout: Placeholder image preview on left, extracted on right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-neutral-100 border border-neutral-200 rounded p-4 flex flex-col items-center justify-center min-h-[200px] text-center">
                <FileText className="w-12 h-12 text-neutral-400 mb-2" />
                <span className="text-xs font-bold text-neutral-700">Digital Document Scan</span>
                <span className="text-[11px] text-neutral-500">{previewDoc.title}</span>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded p-4 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
                  <span className="font-bold text-neutral-900">Extracted Clinical Data</span>
                  <span className="text-[#6C3FC5] font-semibold">Confidence: 96%</span>
                </div>

                {previewDoc.extractedData && (
                  <>
                    <div>
                      <span className="font-bold text-neutral-800 block">Diagnoses:</span>
                      <p className="text-neutral-600">{previewDoc.extractedData.diagnoses.join(', ') || 'None found'}</p>
                    </div>
                    <div>
                      <span className="font-bold text-neutral-800 block">Medications:</span>
                      <p className="text-neutral-600">
                        {previewDoc.extractedData.medications.map(m => `${m.name} (${m.dosage})`).join(', ') || 'None found'}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-neutral-800 block">Investigations:</span>
                      <p className="text-neutral-600">
                        {previewDoc.extractedData.investigations.map(i => `${i.test}: ${i.result} ${i.unit || ''}`).join(', ') || 'None found'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-200 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-[#6C3FC5] text-white rounded text-xs font-bold hover:bg-[#4B238C]"
              >
                Done Viewing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-4 pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-semibold rounded-md flex items-center gap-2 transition-colors text-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to History</span>
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="px-8 py-3.5 bg-[#6C3FC5] hover:bg-[#4B238C] text-white font-bold text-base rounded-md shadow-sm flex items-center gap-2 transition-colors active:scale-[0.99]"
        >
          <span>Continue to History Review</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
