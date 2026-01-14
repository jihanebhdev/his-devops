package com.his.hub.facturation.service;

import com.his.hub.common.exception.BusinessException;
import com.his.hub.common.exception.ResourceNotFoundException;
import com.his.hub.facturation.dao.FactureRepository;
import com.his.hub.facturation.dao.PaiementRepository;
import com.his.hub.facturation.dto.CreatePaiementRequest;
import com.his.hub.facturation.dto.PaiementDTO;
import com.his.hub.facturation.entity.Facture;
import com.his.hub.facturation.entity.Paiement;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PaiementService {

    private final PaiementRepository paiementRepository;
    private final FactureRepository factureRepository;

    public PaiementDTO enregistrerPaiement(CreatePaiementRequest request) {
        Facture facture = factureRepository.findById(request.getFactureId())
            .orElseThrow(() -> new ResourceNotFoundException("Facture non trouvée avec l'ID: " + request.getFactureId()));

        
        double montantDejaPaye = paiementRepository.findByFactureId(request.getFactureId()).stream()
            .mapToDouble(Paiement::getMontant)
            .sum();

        double montantRestant = facture.getMontantPatient() - montantDejaPaye;

        if (request.getMontant() > montantRestant) {
            throw new BusinessException("Le montant du paiement dépasse le montant restant: " + montantRestant);
        }

        Paiement paiement = new Paiement();
        paiement.setFacture(facture);
        paiement.setPatient(facture.getPatient());
        paiement.setMontant(request.getMontant());
        paiement.setDatePaiement(request.getDatePaiement() != null ? 
            request.getDatePaiement() : java.time.LocalDateTime.now());
        paiement.setModePaiement(request.getModePaiement());
        paiement.setReferenceTransaction(request.getReferenceTransaction());
        paiement.setNotes(request.getNotes());

        Paiement saved = paiementRepository.save(paiement);

        
        double nouveauMontantPaye = montantDejaPaye + request.getMontant();
        if (nouveauMontantPaye >= facture.getMontantPatient()) {
            facture.setStatut(Facture.StatutFacture.PAYEE);
        } else if (nouveauMontantPaye > 0) {
            facture.setStatut(Facture.StatutFacture.PARTIELLEMENT_PAYEE);
        }
        factureRepository.save(facture);

        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public PaiementDTO getPaiementById(Long id) {
        Paiement paiement = paiementRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Paiement non trouvé avec l'ID: " + id));
        return toDTO(paiement);
    }

    @Transactional(readOnly = true)
    public List<PaiementDTO> getPaiementsByFactureId(Long factureId) {
        return paiementRepository.findByFactureId(factureId).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PaiementDTO> getPaiementsByPatientId(Long patientId) {
        return paiementRepository.findByPatientId(patientId).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PaiementDTO> getAllPaiements() {
        return paiementRepository.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public void supprimerPaiement(Long id) {
        Paiement paiement = paiementRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Paiement non trouvé avec l'ID: " + id));
        
        
        Facture facture = paiement.getFacture();
        paiementRepository.delete(paiement);
        
        
        double montantTotalPaye = paiementRepository.findByFactureId(facture.getId()).stream()
            .mapToDouble(Paiement::getMontant)
            .sum();
        
        if (montantTotalPaye >= facture.getMontantPatient()) {
            facture.setStatut(Facture.StatutFacture.PAYEE);
        } else if (montantTotalPaye > 0) {
            facture.setStatut(Facture.StatutFacture.PARTIELLEMENT_PAYEE);
        } else {
            facture.setStatut(Facture.StatutFacture.EN_ATTENTE);
        }
        factureRepository.save(facture);
    }

    private PaiementDTO toDTO(Paiement paiement) {
        PaiementDTO dto = new PaiementDTO();
        dto.setId(paiement.getId());
        dto.setFactureId(paiement.getFacture().getId());
        dto.setNumeroFacture(paiement.getFacture().getNumeroFacture());
        dto.setPatientId(paiement.getPatient().getId());
        dto.setPatientNom(paiement.getPatient().getNom());
        dto.setPatientPrenom(paiement.getPatient().getPrenom());
        dto.setMontant(paiement.getMontant());
        dto.setDatePaiement(paiement.getDatePaiement());
        dto.setModePaiement(paiement.getModePaiement());
        dto.setReferenceTransaction(paiement.getReferenceTransaction());
        dto.setNotes(paiement.getNotes());
        dto.setDateCreation(paiement.getDateCreation());
        dto.setDateModification(paiement.getDateModification());
        return dto;
    }
}

