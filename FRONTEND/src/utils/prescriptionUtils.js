/**
 * Prescription Management Utilities
 * Handles prescription creation, tracking, and distribution
 */

/**
 * Generate a unique prescription ID
 * @param {string} doctorId - Doctor's ID
 * @param {string} patientId - Patient's ID
 * @returns {string} Unique prescription ID
 */
export const generatePrescriptionId = (doctorId = 'DOC', patientId = 'PAT') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `RX-${doctorId.substr(0, 3)}-${patientId.substr(0, 3)}-${timestamp}-${random}`;
};

/**
 * Format prescription data for display
 * @param {Object} prescription - Prescription object
 * @returns {Object} Formatted prescription
 */
export const formatPrescriptionForDisplay = (prescription) => {
  return {
    id: prescription.id,
    prescriptionId: prescription.prescription?.id || generatePrescriptionId(),
    doctorName: prescription.doctor,
    patientName: prescription.patient,
    diagnosis: prescription.diagnosis,
    medicines: prescription.prescription?.medicines || [],
    instructions: prescription.prescription?.instructions || '',
    followUp: prescription.prescription?.followUp || '',
    issuedDate: prescription.date,
    issuedTime: prescription.time,
    status: prescription.status || 'pending',
    validUntil: prescription.prescription?.validUntil || 
                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };
};

/**
 * Validate prescription data
 * @param {Object} prescriptionData - Prescription form data
 * @returns {Object} Validation result
 */
export const validatePrescription = (prescriptionData) => {
  const errors = [];
  
  if (!prescriptionData.diagnosis || prescriptionData.diagnosis.trim() === '') {
    errors.push('Diagnosis is required');
  }
  
  if (!prescriptionData.medicines || prescriptionData.medicines.length === 0) {
    errors.push('At least one medicine is required');
  }
  
  prescriptionData.medicines?.forEach((medicine, index) => {
    if (!medicine.name || medicine.name.trim() === '') {
      errors.push(`Medicine ${index + 1}: Name is required`);
    }
    if (!medicine.dosage || medicine.dosage.trim() === '') {
      errors.push(`Medicine ${index + 1}: Dosage is required`);
    }
    if (!medicine.frequency || medicine.frequency.trim() === '') {
      errors.push(`Medicine ${index + 1}: Frequency is required`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Create prescription notification for admin
 * @param {Object} consultation - Consultation data
 * @param {string} type - Notification type (new/update)
 * @returns {Object} Admin notification object
 */
export const createAdminPrescriptionNotification = (consultation, type = 'new') => {
  const isUpdate = type === 'update';
  
  return {
    id: `admin-presc-${isUpdate ? 'update-' : ''}${Date.now()}`,
    type: isUpdate ? 'prescription_update' : 'prescription',
    title: isUpdate ? 'Prescription Updated' : 'New Prescription Issued',
    message: `Dr. ${consultation.doctor} ${isUpdate ? 'updated' : 'issued'} prescription for ${consultation.patient}`,
    prescriptionData: {
      prescriptionId: consultation.prescription?.id,
      doctorName: consultation.doctor,
      doctorId: consultation.doctorId,
      patientName: consultation.patient,
      patientId: consultation.patientId,
      patientPhone: consultation.patientPhone,
      diagnosis: consultation.diagnosis,
      medicines: consultation.prescription?.medicines || [],
      instructions: consultation.prescription?.instructions,
      followUp: consultation.prescription?.followUp,
      issuedDate: consultation.prescription?.issuedDate,
      validUntil: consultation.prescription?.validUntil,
      lastUpdated: consultation.prescription?.lastUpdated,
      status: isUpdate ? 'updated_pending_pharmacy_approval' : 'pending_pharmacy_approval'
    },
    timestamp: new Date().toISOString(),
    priority: 'medium',
    read: false,
    category: isUpdate ? 'medical_update' : 'medical',
    actionRequired: 'Review and approve for pharmacy processing'
  };
};

/**
 * Create prescription notification for patient
 * @param {Object} consultation - Consultation data
 * @param {string} type - Notification type (new/update)
 * @returns {Object} Patient notification object
 */
export const createPatientPrescriptionNotification = (consultation, type = 'new') => {
  const isUpdate = type === 'update';
  
  return {
    id: `patient-presc-${isUpdate ? 'update-' : ''}${Date.now()}`,
    type: isUpdate ? 'prescription_updated' : 'prescription_received',
    title: isUpdate ? 'Your Prescription Has Been Updated' : 'New Prescription from Your Doctor',
    message: `Dr. ${consultation.doctor} has ${isUpdate ? 'updated your' : 'issued a'} prescription`,
    prescriptionData: {
      prescriptionId: consultation.prescription?.id,
      doctorName: consultation.doctor,
      diagnosis: consultation.diagnosis,
      medicines: consultation.prescription?.medicines?.map(med => ({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        instructions: med.instructions
      })) || [],
      instructions: consultation.prescription?.instructions,
      followUp: consultation.prescription?.followUp,
      issuedDate: consultation.prescription?.issuedDate,
      validUntil: consultation.prescription?.validUntil,
      lastUpdated: consultation.prescription?.lastUpdated,
      pharmacyStatus: isUpdate ? 'pending_update' : 'pending',
      downloadable: true
    },
    timestamp: new Date().toISOString(),
    priority: 'high',
    read: false,
    category: isUpdate ? 'prescription_update' : 'prescription',
    actionRequired: isUpdate ? 
      'Check updated prescription before pharmacy visit' : 
      'Visit pharmacy to collect medicines'
  };
};

/**
 * Send notification to admin system
 * @param {Object} notification - Notification object
 * @returns {boolean} Success status
 */
export const sendToAdmin = (notification) => {
  try {
    const existingNotifications = JSON.parse(
      localStorage.getItem('adminNotifications') || '[]'
    );
    
    const updatedNotifications = [notification, ...existingNotifications];
    localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
    
    // Also update admin dashboard stats
    const adminStats = JSON.parse(localStorage.getItem('adminStats') || '{}');
    adminStats.pendingPrescriptions = (adminStats.pendingPrescriptions || 0) + 1;
    adminStats.totalPrescriptions = (adminStats.totalPrescriptions || 0) + 1;
    localStorage.setItem('adminStats', JSON.stringify(adminStats));
    
    console.log('✅ Notification sent to Admin:', notification);
    return true;
  } catch (error) {
    console.error('❌ Failed to send notification to admin:', error);
    return false;
  }
};

/**
 * Send notification to patient
 * @param {Object} notification - Notification object
 * @param {string} patientId - Patient ID
 * @returns {boolean} Success status
 */
export const sendToPatient = (notification, patientId) => {
  try {
    // Send to specific patient notifications
    const patientNotificationKey = `patientNotifications_${patientId}`;
    const existingPatientNotifications = JSON.parse(
      localStorage.getItem(patientNotificationKey) || '[]'
    );
    
    localStorage.setItem(patientNotificationKey, 
      JSON.stringify([notification, ...existingPatientNotifications]));
    
    // Also send to general patient notifications
    const generalNotifications = JSON.parse(
      localStorage.getItem('patientNotifications') || '[]'
    );
    
    const generalNotification = {
      ...notification,
      patientId,
      patientName: notification.prescriptionData?.patientName || 'Unknown Patient'
    };
    
    localStorage.setItem('patientNotifications', 
      JSON.stringify([generalNotification, ...generalNotifications]));
    
    console.log('✅ Notification sent to Patient:', notification);
    return true;
  } catch (error) {
    console.error('❌ Failed to send notification to patient:', error);
    return false;
  }
};

/**
 * Complete prescription workflow - send to both admin and patient
 * @param {Object} consultation - Consultation data
 * @param {string} type - Type of operation (new/update)
 * @returns {Object} Result object
 */
export const completePrescriptionWorkflow = (consultation, type = 'new') => {
  try {
    // Create notifications
    const adminNotification = createAdminPrescriptionNotification(consultation, type);
    const patientNotification = createPatientPrescriptionNotification(consultation, type);
    
    // Send notifications
    const adminSent = sendToAdmin(adminNotification);
    const patientSent = sendToPatient(patientNotification, consultation.patientId);
    
    return {
      success: adminSent && patientSent,
      adminSent,
      patientSent,
      prescriptionId: consultation.prescription?.id,
      message: `Prescription ${type === 'new' ? 'created' : 'updated'} and sent successfully`
    };
  } catch (error) {
    console.error('❌ Failed to complete prescription workflow:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get prescription statistics
 * @returns {Object} Prescription statistics
 */
export const getPrescriptionStats = () => {
  try {
    const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    const prescriptionNotifications = adminNotifications.filter(n => 
      n.type === 'prescription' || n.type === 'prescription_update'
    );
    
    return {
      total: prescriptionNotifications.length,
      pending: prescriptionNotifications.filter(n => 
        n.prescriptionData?.status?.includes('pending')
      ).length,
      today: prescriptionNotifications.filter(n => {
        const today = new Date().toISOString().split('T')[0];
        return n.timestamp?.startsWith(today);
      }).length
    };
  } catch (error) {
    console.error('❌ Failed to get prescription stats:', error);
    return { total: 0, pending: 0, today: 0 };
  }
};

export default {
  generatePrescriptionId,
  formatPrescriptionForDisplay,
  validatePrescription,
  createAdminPrescriptionNotification,
  createPatientPrescriptionNotification,
  sendToAdmin,
  sendToPatient,
  completePrescriptionWorkflow,
  getPrescriptionStats
};