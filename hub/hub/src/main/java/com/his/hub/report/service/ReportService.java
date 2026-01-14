package com.his.hub.report.service;

import com.his.hub.common.exception.ResourceNotFoundException;
import com.his.hub.consultation.dao.ConsultationRepository;
import com.his.hub.consultation.dto.ConsultationDTO;
import com.his.hub.consultation.entity.Consultation;
import com.his.hub.document.dao.DocumentRepository;
import com.his.hub.dossiermedical.dao.DossierMedicalRepository;
import com.his.hub.dossiermedical.entity.DossierMedical;
import com.his.hub.hospitalisation.dao.HospitalisationRepository;
import com.his.hub.patient.dao.PatientRepository;
import com.his.hub.patient.dto.PatientDTO;
import com.his.hub.patient.entity.Patient;
import com.his.hub.rendezvous.dao.RendezVousRepository;
import com.his.hub.rendezvous.dto.RendezVousDTO;
import com.his.hub.rendezvous.entity.RendezVous;
import com.his.hub.report.dto.PatientSummaryReport;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final PatientRepository patientRepository;
    private final DossierMedicalRepository dossierMedicalRepository;
    private final ConsultationRepository consultationRepository;
    private final RendezVousRepository rendezVousRepository;
    private final HospitalisationRepository hospitalisationRepository;
    private final DocumentRepository documentRepository;

    
    public PatientSummaryReport generatePatientSummary(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé"));

        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String generatedBy = authentication != null ? authentication.getName() : "System";

        
        DossierMedical dossierMedical = dossierMedicalRepository.findByPatientId(patientId).orElse(null);

        
        List<ConsultationDTO> recentConsultations = consultationRepository.findByPatientId(patientId)
            .stream()
            .sorted((c1, c2) -> c2.getDateHeure().compareTo(c1.getDateHeure()))
            .limit(5)
            .map(this::toConsultationDTO)
            .collect(Collectors.toList());

        
        List<RendezVousDTO> upcomingAppointments = rendezVousRepository
            .findByPatientIdAndDateHeureAfter(patientId, LocalDateTime.now())
            .stream()
            .sorted((r1, r2) -> r1.getDateHeure().compareTo(r2.getDateHeure()))
            .limit(5)
            .map(this::toRendezVousDTO)
            .collect(Collectors.toList());

        
        int totalConsultations = consultationRepository.findByPatientId(patientId).size();
        int totalHospitalisations = hospitalisationRepository.findByPatientId(patientId).size();
        long totalDocuments = documentRepository.countByPatientId(patientId);

        return PatientSummaryReport.builder()
            .generatedAt(LocalDateTime.now())
            .generatedBy(generatedBy)
            .patient(toPatientDTO(patient))
            .groupeSanguin(dossierMedical != null ? dossierMedical.getGroupeSanguin() : null)
            .rhesus(dossierMedical != null && dossierMedical.getRhesus() != null ? 
                dossierMedical.getRhesus() : null)
            .antecedentsMedicaux(patient.getAntecedentsMedicaux())
            .allergies(patient.getAllergies())
            .recentConsultations(recentConsultations)
            .upcomingAppointments(upcomingAppointments)
            .totalConsultations(totalConsultations)
            .totalHospitalisations(totalHospitalisations)
            .totalDocuments((int) totalDocuments)
            .build();
    }

    private PatientDTO toPatientDTO(Patient patient) {
        PatientDTO dto = new PatientDTO();
        dto.setId(patient.getId());
        dto.setNom(patient.getNom());
        dto.setPrenom(patient.getPrenom());
        dto.setDateNaissance(patient.getDateNaissance());
        dto.setSexe(patient.getSexe());
        dto.setNumeroIdentification(patient.getNumeroIdentification());
        dto.setAdresse(patient.getAdresse());
        dto.setTelephone(patient.getTelephone());
        dto.setEmail(patient.getEmail());
        dto.setAntecedentsMedicaux(patient.getAntecedentsMedicaux());
        dto.setAllergies(patient.getAllergies());
        dto.setActif(patient.getActif());
        dto.setDateCreation(patient.getDateCreation());
        dto.setDateModification(patient.getDateModification());
        return dto;
    }

    private ConsultationDTO toConsultationDTO(Consultation consultation) {
        ConsultationDTO dto = new ConsultationDTO();
        dto.setId(consultation.getId());
        dto.setPatientId(consultation.getPatient().getId());
        dto.setPatientNom(consultation.getPatient().getNom());
        dto.setPatientPrenom(consultation.getPatient().getPrenom());
        if (consultation.getMedecin() != null) {
            dto.setMedecinId(consultation.getMedecin().getId());
            dto.setMedecinNom(consultation.getMedecin().getNom());
            dto.setMedecinPrenom(consultation.getMedecin().getPrenom());
        }
        dto.setDateHeure(consultation.getDateHeure());
        dto.setMotif(consultation.getMotif());
        dto.setExamenClinique(consultation.getExamenClinique());
        dto.setDiagnostic(consultation.getDiagnostic());
        dto.setPrescription(consultation.getPrescription());
        dto.setRecommandations(consultation.getRecommandations());
        dto.setTypeConsultation(consultation.getTypeConsultation());
        dto.setDateCreation(consultation.getDateCreation());
        dto.setDateModification(consultation.getDateModification());
        return dto;
    }

    private RendezVousDTO toRendezVousDTO(RendezVous rendezVous) {
        RendezVousDTO dto = new RendezVousDTO();
        dto.setId(rendezVous.getId());
        dto.setPatientId(rendezVous.getPatient().getId());
        dto.setPatientNom(rendezVous.getPatient().getNom());
        dto.setPatientPrenom(rendezVous.getPatient().getPrenom());
        if (rendezVous.getMedecin() != null) {
            dto.setMedecinId(rendezVous.getMedecin().getId());
            dto.setMedecinNom(rendezVous.getMedecin().getNom());
            dto.setMedecinPrenom(rendezVous.getMedecin().getPrenom());
        }
        dto.setDateHeure(rendezVous.getDateHeure());
        dto.setStatut(rendezVous.getStatut());
        dto.setMotif(rendezVous.getMotif());
        dto.setNotes(rendezVous.getNotes());
        dto.setDateCreation(rendezVous.getDateCreation());
        dto.setDateModification(rendezVous.getDateModification());
        return dto;
    }
}

