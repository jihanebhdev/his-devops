package com.his.hub.hospitalisation.service;

import com.his.hub.authentication.dao.UtilisateurRepository;
import com.his.hub.authentication.entity.Utilisateur;
import com.his.hub.common.exception.BusinessException;
import com.his.hub.common.exception.ResourceNotFoundException;
import com.his.hub.hospitalisation.dao.HospitalisationRepository;
import com.his.hub.hospitalisation.dao.LitRepository;
import com.his.hub.hospitalisation.dto.CreateHospitalisationRequest;
import com.his.hub.hospitalisation.dto.HospitalisationDTO;
import com.his.hub.hospitalisation.entity.Hospitalisation;
import com.his.hub.hospitalisation.entity.Lit;
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
public class HospitalisationService {

    private final HospitalisationRepository hospitalisationRepository;
    private final PatientRepository patientRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final LitRepository litRepository;

    public HospitalisationDTO creerHospitalisation(CreateHospitalisationRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
            .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé avec l'ID: " + request.getPatientId()));

        Utilisateur medecin = utilisateurRepository.findById(request.getMedecinId())
            .orElseThrow(() -> new ResourceNotFoundException("Médecin non trouvé avec l'ID: " + request.getMedecinId()));

        Lit lit = litRepository.findById(request.getLitId())
            .orElseThrow(() -> new ResourceNotFoundException("Lit non trouvé avec l'ID: " + request.getLitId()));

        if (lit.getStatut() != Lit.StatutLit.DISPONIBLE) {
            throw new BusinessException("Le lit n'est pas disponible");
        }

        
        hospitalisationRepository.findByPatientIdAndStatut(request.getPatientId(), Hospitalisation.StatutHospitalisation.EN_COURS)
            .ifPresent(h -> {
                throw new BusinessException("Le patient a déjà une hospitalisation en cours");
            });

        Hospitalisation hospitalisation = new Hospitalisation();
        hospitalisation.setPatient(patient);
        hospitalisation.setMedecin(medecin);
        hospitalisation.setLit(lit);
        hospitalisation.setDateAdmission(request.getDateAdmission() != null ? 
            request.getDateAdmission() : java.time.LocalDateTime.now());
        hospitalisation.setStatut(Hospitalisation.StatutHospitalisation.EN_COURS);
        hospitalisation.setMotifAdmission(request.getMotifAdmission());
        hospitalisation.setDiagnostic(request.getDiagnostic());

        
        lit.setStatut(Lit.StatutLit.OCCUPE);
        litRepository.save(lit);

        Hospitalisation saved = hospitalisationRepository.save(hospitalisation);
        return toDTO(saved);
    }

    public HospitalisationDTO enregistrerSortie(Long id, String notesSortie) {
        Hospitalisation hospitalisation = hospitalisationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Hospitalisation non trouvée avec l'ID: " + id));

        hospitalisation.setDateSortie(java.time.LocalDateTime.now());
        hospitalisation.setStatut(Hospitalisation.StatutHospitalisation.SORTIE);
        hospitalisation.setNotesSortie(notesSortie);

        
        Lit lit = hospitalisation.getLit();
        lit.setStatut(Lit.StatutLit.DISPONIBLE);
        litRepository.save(lit);

        Hospitalisation saved = hospitalisationRepository.save(hospitalisation);
        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public HospitalisationDTO getHospitalisationById(Long id) {
        Hospitalisation hospitalisation = hospitalisationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Hospitalisation non trouvée avec l'ID: " + id));
        return toDTO(hospitalisation);
    }

    @Transactional(readOnly = true)
    public List<HospitalisationDTO> getHospitalisationsByPatientId(Long patientId) {
        return hospitalisationRepository.findByPatientId(patientId).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HospitalisationDTO> getHospitalisationsEnCours() {
        return hospitalisationRepository.findByStatut(Hospitalisation.StatutHospitalisation.EN_COURS).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HospitalisationDTO> getAllHospitalisations() {
        return hospitalisationRepository.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public void supprimerHospitalisation(Long id) {
        Hospitalisation hospitalisation = hospitalisationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Hospitalisation non trouvée avec l'ID: " + id));
        
        
        if (hospitalisation.getStatut() == Hospitalisation.StatutHospitalisation.EN_COURS) {
            Lit lit = hospitalisation.getLit();
            lit.setStatut(Lit.StatutLit.DISPONIBLE);
            litRepository.save(lit);
        }
        
        hospitalisationRepository.delete(hospitalisation);
    }

    private HospitalisationDTO toDTO(Hospitalisation hospitalisation) {
        HospitalisationDTO dto = new HospitalisationDTO();
        dto.setId(hospitalisation.getId());
        dto.setPatientId(hospitalisation.getPatient().getId());
        dto.setPatientNom(hospitalisation.getPatient().getNom());
        dto.setPatientPrenom(hospitalisation.getPatient().getPrenom());
        dto.setMedecinId(hospitalisation.getMedecin().getId());
        dto.setMedecinNom(hospitalisation.getMedecin().getNom());
        dto.setMedecinPrenom(hospitalisation.getMedecin().getPrenom());
        dto.setLitId(hospitalisation.getLit().getId());
        dto.setNumeroLit(hospitalisation.getLit().getNumeroLit());
        dto.setService(hospitalisation.getLit().getService());
        dto.setChambre(hospitalisation.getLit().getChambre());
        dto.setDateAdmission(hospitalisation.getDateAdmission());
        dto.setDateSortie(hospitalisation.getDateSortie());
        dto.setStatut(hospitalisation.getStatut());
        dto.setMotifAdmission(hospitalisation.getMotifAdmission());
        dto.setDiagnostic(hospitalisation.getDiagnostic());
        dto.setNotesSortie(hospitalisation.getNotesSortie());
        dto.setDateCreation(hospitalisation.getDateCreation());
        dto.setDateModification(hospitalisation.getDateModification());
        return dto;
    }
}

