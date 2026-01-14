package com.his.hub.constantes.service;

import com.his.hub.authentication.dao.UtilisateurRepository;
import com.his.hub.authentication.entity.Utilisateur;
import com.his.hub.common.exception.ResourceNotFoundException;
import com.his.hub.constantes.dao.ConstantesVitalesRepository;
import com.his.hub.constantes.dto.CreateConstantesVitalesRequest;
import com.his.hub.constantes.dto.ConstantesVitalesDTO;
import com.his.hub.constantes.entity.ConstantesVitales;
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
public class ConstantesVitalesService {

    private final ConstantesVitalesRepository constantesVitalesRepository;
    private final PatientRepository patientRepository;
    private final UtilisateurRepository utilisateurRepository;

    public ConstantesVitalesDTO enregistrerConstantes(CreateConstantesVitalesRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
            .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé avec l'ID: " + request.getPatientId()));

        Utilisateur infirmier = null;
        if (request.getInfirmierId() != null) {
            infirmier = utilisateurRepository.findById(request.getInfirmierId())
                .orElseThrow(() -> new ResourceNotFoundException("Infirmier non trouvé avec l'ID: " + request.getInfirmierId()));
        }

        ConstantesVitales constantes = new ConstantesVitales();
        constantes.setPatient(patient);
        constantes.setInfirmier(infirmier);
        constantes.setDateHeure(request.getDateHeure() != null ? request.getDateHeure() : java.time.LocalDateTime.now());
        constantes.setTemperature(request.getTemperature());
        constantes.setTensionArterielleSystolique(request.getTensionArterielleSystolique());
        constantes.setTensionArterielleDiastolique(request.getTensionArterielleDiastolique());
        constantes.setFrequenceCardiaque(request.getFrequenceCardiaque());
        constantes.setFrequenceRespiratoire(request.getFrequenceRespiratoire());
        constantes.setPoids(request.getPoids());
        constantes.setTaille(request.getTaille());
        constantes.setGlycemie(request.getGlycemie());
        constantes.setSaturationOxygene(request.getSaturationOxygene());
        constantes.setNotes(request.getNotes());

        ConstantesVitales saved = constantesVitalesRepository.save(constantes);
        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public ConstantesVitalesDTO getConstantesById(Long id) {
        ConstantesVitales constantes = constantesVitalesRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Constantes vitales non trouvées avec l'ID: " + id));
        return toDTO(constantes);
    }

    @Transactional(readOnly = true)
    public List<ConstantesVitalesDTO> getConstantesByPatientId(Long patientId) {
        return constantesVitalesRepository.findByPatientIdOrderByDateHeureDesc(patientId).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public void supprimerConstantes(Long id) {
        ConstantesVitales constantes = constantesVitalesRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Constantes vitales non trouvées avec l'ID: " + id));
        constantesVitalesRepository.delete(constantes);
    }

    private ConstantesVitalesDTO toDTO(ConstantesVitales constantes) {
        ConstantesVitalesDTO dto = new ConstantesVitalesDTO();
        dto.setId(constantes.getId());
        dto.setPatientId(constantes.getPatient().getId());
        dto.setPatientNom(constantes.getPatient().getNom());
        dto.setPatientPrenom(constantes.getPatient().getPrenom());
        if (constantes.getInfirmier() != null) {
            dto.setInfirmierId(constantes.getInfirmier().getId());
            dto.setInfirmierNom(constantes.getInfirmier().getNom());
            dto.setInfirmierPrenom(constantes.getInfirmier().getPrenom());
        }
        dto.setDateHeure(constantes.getDateHeure());
        dto.setTemperature(constantes.getTemperature());
        dto.setTensionArterielleSystolique(constantes.getTensionArterielleSystolique());
        dto.setTensionArterielleDiastolique(constantes.getTensionArterielleDiastolique());
        dto.setFrequenceCardiaque(constantes.getFrequenceCardiaque());
        dto.setFrequenceRespiratoire(constantes.getFrequenceRespiratoire());
        dto.setPoids(constantes.getPoids());
        dto.setTaille(constantes.getTaille());
        dto.setGlycemie(constantes.getGlycemie());
        dto.setSaturationOxygene(constantes.getSaturationOxygene());
        dto.setNotes(constantes.getNotes());
        dto.setDateCreation(constantes.getDateCreation());
        dto.setDateModification(constantes.getDateModification());
        return dto;
    }
}

