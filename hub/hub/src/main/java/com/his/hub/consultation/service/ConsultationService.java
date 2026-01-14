package com.his.hub.consultation.service;

import com.his.hub.authentication.dao.UtilisateurRepository;
import com.his.hub.authentication.entity.Utilisateur;
import com.his.hub.common.exception.ResourceNotFoundException;
import com.his.hub.consultation.dao.ConsultationRepository;
import com.his.hub.consultation.dto.ConsultationDTO;
import com.his.hub.consultation.dto.CreateConsultationRequest;
import com.his.hub.consultation.entity.Consultation;
import com.his.hub.patient.dao.PatientRepository;
import com.his.hub.patient.entity.Patient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final PatientRepository patientRepository;
    private final UtilisateurRepository utilisateurRepository;

    public ConsultationDTO creerConsultation(CreateConsultationRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
            .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé avec l'ID: " + request.getPatientId()));

        Utilisateur medecin = utilisateurRepository.findById(request.getMedecinId())
            .orElseThrow(() -> new ResourceNotFoundException("Médecin non trouvé avec l'ID: " + request.getMedecinId()));

        Consultation consultation = new Consultation();
        consultation.setPatient(patient);
        consultation.setMedecin(medecin);
        consultation.setDateHeure(request.getDateHeure() != null ? request.getDateHeure() : java.time.LocalDateTime.now());
        consultation.setMotif(request.getMotif());
        consultation.setExamenClinique(request.getExamenClinique());
        consultation.setDiagnostic(request.getDiagnostic());
        consultation.setPrescription(request.getPrescription());
        consultation.setRecommandations(request.getRecommandations());
        consultation.setTypeConsultation(request.getTypeConsultation() != null ? 
            request.getTypeConsultation() : Consultation.TypeConsultation.CONSULTATION_GENERALE);

        Consultation saved = consultationRepository.save(consultation);
        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public ConsultationDTO getConsultationById(Long id) {
        Consultation consultation = consultationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Consultation non trouvée avec l'ID: " + id));
        return toDTO(consultation);
    }

    @Transactional(readOnly = true)
    public List<ConsultationDTO> getConsultationsByPatientId(Long patientId) {
        return consultationRepository.findByPatientId(patientId).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ConsultationDTO> getConsultationsByMedecinId(Long medecinId) {
        return consultationRepository.findByMedecinId(medecinId).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ConsultationDTO> getAllConsultations() {
        return consultationRepository.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public void supprimerConsultation(Long id) {
        Consultation consultation = consultationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Consultation non trouvée avec l'ID: " + id));
        consultationRepository.delete(consultation);
    }

    private ConsultationDTO toDTO(Consultation consultation) {
        ConsultationDTO dto = new ConsultationDTO();
        dto.setId(consultation.getId());
        dto.setPatientId(consultation.getPatient().getId());
        dto.setPatientNom(consultation.getPatient().getNom());
        dto.setPatientPrenom(consultation.getPatient().getPrenom());
        dto.setMedecinId(consultation.getMedecin().getId());
        dto.setMedecinNom(consultation.getMedecin().getNom());
        dto.setMedecinPrenom(consultation.getMedecin().getPrenom());
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
}

