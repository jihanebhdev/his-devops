package com.his.hub.facturation.service;

import com.his.hub.common.exception.ResourceNotFoundException;
import com.his.hub.facturation.dao.AssuranceRepository;
import com.his.hub.facturation.dto.AssuranceDTO;
import com.his.hub.facturation.entity.Assurance;
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
public class AssuranceService {

    private final AssuranceRepository assuranceRepository;
    private final PatientRepository patientRepository;

    public AssuranceDTO creerAssurance(Long patientId, String nomAssurance, String numeroContrat, Double tauxCouverture) {
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé avec l'ID: " + patientId));

        Assurance assurance = new Assurance();
        assurance.setPatient(patient);
        assurance.setNomAssurance(nomAssurance);
        assurance.setNumeroContrat(numeroContrat);
        assurance.setTauxCouverture(tauxCouverture != null ? tauxCouverture : 0.0);
        assurance.setActif(true);

        Assurance saved = assuranceRepository.save(assurance);
        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<AssuranceDTO> getAllAssurances() {
        return assuranceRepository.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AssuranceDTO getAssuranceById(Long id) {
        Assurance assurance = assuranceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Assurance non trouvée avec l'ID: " + id));
        return toDTO(assurance);
    }

    @Transactional(readOnly = true)
    public List<AssuranceDTO> getAssurancesByPatientId(Long patientId) {
        return assuranceRepository.findByPatientIdAndActifTrue(patientId).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public AssuranceDTO modifierAssurance(Long id, String nomAssurance, String numeroContrat, Double tauxCouverture) {
        Assurance assurance = assuranceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Assurance non trouvée avec l'ID: " + id));

        if (nomAssurance != null) {
            assurance.setNomAssurance(nomAssurance);
        }
        if (numeroContrat != null) {
            assurance.setNumeroContrat(numeroContrat);
        }
        if (tauxCouverture != null) {
            assurance.setTauxCouverture(tauxCouverture);
        }

        Assurance updated = assuranceRepository.save(assurance);
        return toDTO(updated);
    }

    public void supprimerAssurance(Long id) {
        Assurance assurance = assuranceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Assurance non trouvée avec l'ID: " + id));
        
        
        assurance.setActif(false);
        assuranceRepository.save(assurance);
    }

    private AssuranceDTO toDTO(Assurance assurance) {
        AssuranceDTO dto = new AssuranceDTO();
        dto.setId(assurance.getId());
        dto.setPatientId(assurance.getPatient().getId());
        dto.setPatientNom(assurance.getPatient().getNom());
        dto.setPatientPrenom(assurance.getPatient().getPrenom());
        dto.setNomAssurance(assurance.getNomAssurance());
        dto.setNumeroContrat(assurance.getNumeroContrat());
        dto.setTauxCouverture(assurance.getTauxCouverture());
        dto.setActif(assurance.getActif());
        dto.setDateCreation(assurance.getDateCreation());
        dto.setDateModification(assurance.getDateModification());
        return dto;
    }
}

