package com.his.hub.suivi.service;

import com.his.hub.authentication.dao.UtilisateurRepository;
import com.his.hub.authentication.entity.Utilisateur;
import com.his.hub.common.exception.ResourceNotFoundException;
import com.his.hub.hospitalisation.dao.HospitalisationRepository;
import com.his.hub.hospitalisation.entity.Hospitalisation;
import com.his.hub.suivi.dao.SuiviHospitalierRepository;
import com.his.hub.suivi.dto.CreateSuiviHospitalierRequest;
import com.his.hub.suivi.dto.SuiviHospitalierDTO;
import com.his.hub.suivi.entity.SuiviHospitalier;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SuiviHospitalierService {

    private final SuiviHospitalierRepository suiviHospitalierRepository;
    private final HospitalisationRepository hospitalisationRepository;
    private final UtilisateurRepository utilisateurRepository;

    public SuiviHospitalierDTO enregistrerSuivi(CreateSuiviHospitalierRequest request) {
        Hospitalisation hospitalisation = hospitalisationRepository.findById(request.getHospitalisationId())
            .orElseThrow(() -> new ResourceNotFoundException("Hospitalisation non trouvée avec l'ID: " + request.getHospitalisationId()));

        Utilisateur infirmier = utilisateurRepository.findById(request.getInfirmierId())
            .orElseThrow(() -> new ResourceNotFoundException("Infirmier non trouvé avec l'ID: " + request.getInfirmierId()));

        SuiviHospitalier suivi = new SuiviHospitalier();
        suivi.setHospitalisation(hospitalisation);
        suivi.setInfirmier(infirmier);
        suivi.setDateHeure(request.getDateHeure() != null ? request.getDateHeure() : java.time.LocalDateTime.now());
        suivi.setObservations(request.getObservations());
        suivi.setSoinsAdministres(request.getSoinsAdministres());
        suivi.setMedicaments(request.getMedicaments());
        suivi.setEtatPatient(request.getEtatPatient());

        SuiviHospitalier saved = suiviHospitalierRepository.save(suivi);
        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public SuiviHospitalierDTO getSuiviById(Long id) {
        SuiviHospitalier suivi = suiviHospitalierRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Suivi non trouvé avec l'ID: " + id));
        return toDTO(suivi);
    }

    @Transactional(readOnly = true)
    public List<SuiviHospitalierDTO> getSuivisByHospitalisationId(Long hospitalisationId) {
        return suiviHospitalierRepository.findByHospitalisationIdOrderByDateHeureDesc(hospitalisationId).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public void supprimerSuivi(Long id) {
        SuiviHospitalier suivi = suiviHospitalierRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Suivi non trouvé avec l'ID: " + id));
        suiviHospitalierRepository.delete(suivi);
    }

    private SuiviHospitalierDTO toDTO(SuiviHospitalier suivi) {
        SuiviHospitalierDTO dto = new SuiviHospitalierDTO();
        dto.setId(suivi.getId());
        dto.setHospitalisationId(suivi.getHospitalisation().getId());
        dto.setPatientId(suivi.getHospitalisation().getPatient().getId());
        dto.setPatientNom(suivi.getHospitalisation().getPatient().getNom());
        dto.setPatientPrenom(suivi.getHospitalisation().getPatient().getPrenom());
        dto.setInfirmierId(suivi.getInfirmier().getId());
        dto.setInfirmierNom(suivi.getInfirmier().getNom());
        dto.setInfirmierPrenom(suivi.getInfirmier().getPrenom());
        dto.setDateHeure(suivi.getDateHeure());
        dto.setObservations(suivi.getObservations());
        dto.setSoinsAdministres(suivi.getSoinsAdministres());
        dto.setMedicaments(suivi.getMedicaments());
        dto.setEtatPatient(suivi.getEtatPatient());
        dto.setDateCreation(suivi.getDateCreation());
        dto.setDateModification(suivi.getDateModification());
        return dto;
    }
}

