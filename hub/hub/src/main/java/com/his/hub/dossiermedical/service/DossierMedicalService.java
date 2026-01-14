package com.his.hub.dossiermedical.service;

import com.his.hub.common.exception.BusinessException;
import com.his.hub.common.exception.ResourceNotFoundException;
import com.his.hub.dossiermedical.dao.DossierMedicalRepository;
import com.his.hub.dossiermedical.dto.CreateDossierMedicalRequest;
import com.his.hub.dossiermedical.dto.DossierMedicalDTO;
import com.his.hub.dossiermedical.entity.DossierMedical;
import com.his.hub.patient.dao.PatientRepository;
import com.his.hub.patient.entity.Patient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DossierMedicalService {

    private final DossierMedicalRepository dossierMedicalRepository;
    private final PatientRepository patientRepository;

    public DossierMedicalDTO creerDossierMedical(CreateDossierMedicalRequest request) {
        if (dossierMedicalRepository.existsByPatientId(request.getPatientId())) {
            throw new BusinessException("Un dossier médical existe déjà pour ce patient");
        }

        Patient patient = patientRepository.findById(request.getPatientId())
            .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé avec l'ID: " + request.getPatientId()));

        DossierMedical dossier = new DossierMedical();
        dossier.setPatient(patient);
        dossier.setHistoriqueMedical(request.getHistoriqueMedical());
        dossier.setNotesCliniques(request.getNotesCliniques());
        dossier.setGroupeSanguin(request.getGroupeSanguin());
        dossier.setRhesus(request.getRhesus());
        dossier.setActif(true);

        DossierMedical saved = dossierMedicalRepository.save(dossier);
        return toDTO(saved);
    }

    public DossierMedicalDTO modifierDossierMedical(Long id, CreateDossierMedicalRequest request) {
        DossierMedical dossier = dossierMedicalRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Dossier médical non trouvé avec l'ID: " + id));

        dossier.setHistoriqueMedical(request.getHistoriqueMedical());
        dossier.setNotesCliniques(request.getNotesCliniques());
        dossier.setGroupeSanguin(request.getGroupeSanguin());
        dossier.setRhesus(request.getRhesus());

        DossierMedical saved = dossierMedicalRepository.save(dossier);
        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public DossierMedicalDTO getDossierMedicalById(Long id) {
        DossierMedical dossier = dossierMedicalRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Dossier médical non trouvé avec l'ID: " + id));
        return toDTO(dossier);
    }

    @Transactional(readOnly = true)
    public DossierMedicalDTO getDossierMedicalByPatientId(Long patientId) {
        DossierMedical dossier = dossierMedicalRepository.findByPatientId(patientId)
            .orElseThrow(() -> new ResourceNotFoundException("Dossier médical non trouvé pour le patient avec l'ID: " + patientId));
        return toDTO(dossier);
    }

    @Transactional(readOnly = true)
    public java.util.List<DossierMedicalDTO> getAllDossiersMedicaux() {
        return dossierMedicalRepository.findAll().stream()
            .map(this::toDTO)
            .collect(java.util.stream.Collectors.toList());
    }

    public void supprimerDossierMedical(Long id) {
        DossierMedical dossier = dossierMedicalRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Dossier médical non trouvé avec l'ID: " + id));
        
        
        dossier.setActif(false);
        dossierMedicalRepository.save(dossier);
    }

    private DossierMedicalDTO toDTO(DossierMedical dossier) {
        DossierMedicalDTO dto = new DossierMedicalDTO();
        dto.setId(dossier.getId());
        dto.setPatientId(dossier.getPatient().getId());
        dto.setPatientNom(dossier.getPatient().getNom());
        dto.setPatientPrenom(dossier.getPatient().getPrenom());
        dto.setHistoriqueMedical(dossier.getHistoriqueMedical());
        dto.setNotesCliniques(dossier.getNotesCliniques());
        dto.setGroupeSanguin(dossier.getGroupeSanguin());
        dto.setRhesus(dossier.getRhesus());
        dto.setActif(dossier.getActif());
        dto.setDateCreation(dossier.getDateCreation());
        dto.setDateModification(dossier.getDateModification());
        return dto;
    }
}

