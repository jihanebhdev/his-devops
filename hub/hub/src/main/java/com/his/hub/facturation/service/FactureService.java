package com.his.hub.facturation.service;

import com.his.hub.common.exception.ResourceNotFoundException;
import com.his.hub.facturation.dao.AssuranceRepository;
import com.his.hub.facturation.dao.FactureRepository;
import com.his.hub.facturation.dto.CreateFactureRequest;
import com.his.hub.facturation.dto.FactureDTO;
import com.his.hub.facturation.dto.LigneFactureDTO;
import com.his.hub.facturation.entity.Assurance;
import com.his.hub.facturation.entity.Facture;
import com.his.hub.facturation.entity.LigneFacture;
import com.his.hub.patient.dao.PatientRepository;
import com.his.hub.patient.entity.Patient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FactureService {

    private final FactureRepository factureRepository;
    private final PatientRepository patientRepository;
    private final AssuranceRepository assuranceRepository;

    public FactureDTO creerFacture(CreateFactureRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
            .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé avec l'ID: " + request.getPatientId()));

        Assurance assurance = null;
        if (request.getAssuranceId() != null) {
            assurance = assuranceRepository.findById(request.getAssuranceId())
                .orElseThrow(() -> new ResourceNotFoundException("Assurance non trouvée avec l'ID: " + request.getAssuranceId()));
        }

        
        String numeroFacture = "FAC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Facture facture = new Facture();
        facture.setPatient(patient);
        facture.setAssurance(assurance);
        facture.setNumeroFacture(numeroFacture);
        facture.setDateFacturation(request.getDateFacturation() != null ? 
            request.getDateFacturation() : LocalDateTime.now());
        facture.setStatut(Facture.StatutFacture.EN_ATTENTE);

        
        double montantTotal = 0.0;
        if (request.getLignesFacture() != null) {
            for (LigneFactureDTO ligneDTO : request.getLignesFacture()) {
                LigneFacture ligne = new LigneFacture();
                ligne.setFacture(facture);
                ligne.setDescription(ligneDTO.getDescription());
                ligne.setQuantite(ligneDTO.getQuantite());
                ligne.setPrixUnitaire(ligneDTO.getPrixUnitaire());
                ligne.setMontantTotal(ligneDTO.getQuantite() * ligneDTO.getPrixUnitaire());
                facture.getLignesFacture().add(ligne);
                montantTotal += ligne.getMontantTotal();
            }
        }

        facture.setMontantTotal(montantTotal);

        
        double tauxCouverture = (assurance != null && assurance.getTauxCouverture() != null) ? 
            assurance.getTauxCouverture() / 100.0 : 0.0;
        facture.setMontantAssurance(montantTotal * tauxCouverture);
        facture.setMontantPatient(montantTotal - facture.getMontantAssurance());

        Facture saved = factureRepository.save(facture);
        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public FactureDTO getFactureById(Long id) {
        Facture facture = factureRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Facture non trouvée avec l'ID: " + id));
        return toDTO(facture);
    }

    @Transactional(readOnly = true)
    public List<FactureDTO> getFacturesByPatientId(Long patientId) {
        return factureRepository.findByPatientId(patientId).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FactureDTO> getAllFactures() {
        return factureRepository.findAllByOrderByDateFacturationDesc().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FactureDTO> getFacturesImpayees() {
        return factureRepository.findByStatut(Facture.StatutFacture.EN_ATTENTE).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public void supprimerFacture(Long id) {
        Facture facture = factureRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Facture non trouvée avec l'ID: " + id));
        factureRepository.delete(facture);
    }

    private FactureDTO toDTO(Facture facture) {
        FactureDTO dto = new FactureDTO();
        dto.setId(facture.getId());
        dto.setPatientId(facture.getPatient().getId());
        dto.setPatientNom(facture.getPatient().getNom());
        dto.setPatientPrenom(facture.getPatient().getPrenom());
        if (facture.getAssurance() != null) {
            dto.setAssuranceId(facture.getAssurance().getId());
            dto.setNomAssurance(facture.getAssurance().getNomAssurance());
        }
        dto.setNumeroFacture(facture.getNumeroFacture());
        dto.setDateFacturation(facture.getDateFacturation());
        dto.setMontantTotal(facture.getMontantTotal());
        dto.setMontantAssurance(facture.getMontantAssurance());
        dto.setMontantPatient(facture.getMontantPatient());
        dto.setStatut(facture.getStatut());
        dto.setLignesFacture(facture.getLignesFacture().stream()
            .map(ligne -> {
                LigneFactureDTO ligneDTO = new LigneFactureDTO();
                ligneDTO.setId(ligne.getId());
                ligneDTO.setDescription(ligne.getDescription());
                ligneDTO.setQuantite(ligne.getQuantite());
                ligneDTO.setPrixUnitaire(ligne.getPrixUnitaire());
                ligneDTO.setMontantTotal(ligne.getMontantTotal());
                return ligneDTO;
            })
            .collect(Collectors.toList()));
        dto.setDateCreation(facture.getDateCreation());
        dto.setDateModification(facture.getDateModification());
        return dto;
    }
}

