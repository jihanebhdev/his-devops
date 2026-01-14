package com.his.hub.hospitalisation.service;

import com.his.hub.common.exception.BusinessException;
import com.his.hub.common.exception.ResourceNotFoundException;
import com.his.hub.hospitalisation.dao.LitRepository;
import com.his.hub.hospitalisation.dto.LitDTO;
import com.his.hub.hospitalisation.entity.Lit;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class LitService {

    private final LitRepository litRepository;

    public LitDTO creerLit(String numeroLit, String service, String chambre, String notes) {
        if (litRepository.findByNumeroLit(numeroLit).isPresent()) {
            throw new BusinessException("Un lit avec ce numéro existe déjà");
        }

        Lit lit = new Lit();
        lit.setNumeroLit(numeroLit);
        lit.setService(service);
        lit.setChambre(chambre);
        lit.setStatut(Lit.StatutLit.DISPONIBLE);
        lit.setNotes(notes);

        Lit saved = litRepository.save(lit);
        return toDTO(saved);
    }

    public LitDTO modifierLit(Long id, String numeroLit, String service, String chambre, Lit.StatutLit statut, String notes) {
        Lit lit = litRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Lit non trouvé avec l'ID: " + id));

        if (!lit.getNumeroLit().equals(numeroLit) && litRepository.findByNumeroLit(numeroLit).isPresent()) {
            throw new BusinessException("Un lit avec ce numéro existe déjà");
        }

        lit.setNumeroLit(numeroLit);
        lit.setService(service);
        lit.setChambre(chambre);
        if (statut != null) {
            lit.setStatut(statut);
        }
        lit.setNotes(notes);

        Lit saved = litRepository.save(lit);
        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<LitDTO> getLitsDisponibles(String service) {
        List<Lit> lits;
        if (service != null && !service.isEmpty()) {
            lits = litRepository.findByStatutAndService(Lit.StatutLit.DISPONIBLE, service);
        } else {
            lits = litRepository.findByStatut(Lit.StatutLit.DISPONIBLE);
        }
        return lits.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LitDTO getLitById(Long id) {
        Lit lit = litRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Lit non trouvé avec l'ID: " + id));
        return toDTO(lit);
    }

    @Transactional(readOnly = true)
    public List<LitDTO> getAllLits() {
        return litRepository.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public void supprimerLit(Long id) {
        Lit lit = litRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Lit non trouvé avec l'ID: " + id));
        
        if (lit.getStatut() == Lit.StatutLit.OCCUPE) {
            throw new BusinessException("Impossible de supprimer un lit occupé");
        }
        
        litRepository.delete(lit);
    }

    private LitDTO toDTO(Lit lit) {
        LitDTO dto = new LitDTO();
        dto.setId(lit.getId());
        dto.setNumeroLit(lit.getNumeroLit());
        dto.setService(lit.getService());
        dto.setChambre(lit.getChambre());
        dto.setStatut(lit.getStatut());
        dto.setNotes(lit.getNotes());
        return dto;
    }
}

