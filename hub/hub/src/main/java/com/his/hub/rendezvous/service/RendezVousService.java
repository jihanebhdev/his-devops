package com.his.hub.rendezvous.service;

import com.his.hub.authentication.dao.UtilisateurRepository;
import com.his.hub.authentication.entity.Utilisateur;
import com.his.hub.common.exception.ResourceNotFoundException;
import com.his.hub.patient.dao.PatientRepository;
import com.his.hub.patient.entity.Patient;
import com.his.hub.rendezvous.dao.RendezVousRepository;
import com.his.hub.rendezvous.dto.CreateRendezVousRequest;
import com.his.hub.rendezvous.dto.RendezVousDTO;
import com.his.hub.rendezvous.entity.RendezVous;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RendezVousService {

    private final RendezVousRepository rendezVousRepository;
    private final PatientRepository patientRepository;
    private final UtilisateurRepository utilisateurRepository;

    public RendezVousDTO creerRendezVous(CreateRendezVousRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
            .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé avec l'ID: " + request.getPatientId()));

        Utilisateur medecin = null;
        if (request.getMedecinId() != null) {
            medecin = utilisateurRepository.findById(request.getMedecinId())
                .orElseThrow(() -> new ResourceNotFoundException("Médecin non trouvé avec l'ID: " + request.getMedecinId()));
        }

        RendezVous rendezVous = new RendezVous();
        rendezVous.setPatient(patient);
        rendezVous.setMedecin(medecin);
        rendezVous.setDateHeure(request.getDateHeure());
        rendezVous.setStatut(RendezVous.StatutRendezVous.PLANIFIE);
        rendezVous.setMotif(request.getMotif());
        rendezVous.setNotes(request.getNotes());

        RendezVous saved = rendezVousRepository.save(rendezVous);
        return toDTO(saved);
    }

    public RendezVousDTO modifierRendezVous(Long id, CreateRendezVousRequest request) {
        RendezVous rendezVous = rendezVousRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Rendez-vous non trouvé avec l'ID: " + id));

        if (request.getPatientId() != null) {
            Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé avec l'ID: " + request.getPatientId()));
            rendezVous.setPatient(patient);
        }

        if (request.getMedecinId() != null) {
            Utilisateur medecin = utilisateurRepository.findById(request.getMedecinId())
                .orElseThrow(() -> new ResourceNotFoundException("Médecin non trouvé avec l'ID: " + request.getMedecinId()));
            rendezVous.setMedecin(medecin);
        }

        if (request.getDateHeure() != null) {
            rendezVous.setDateHeure(request.getDateHeure());
        }
        if (request.getMotif() != null) {
            rendezVous.setMotif(request.getMotif());
        }
        if (request.getNotes() != null) {
            rendezVous.setNotes(request.getNotes());
        }

        RendezVous saved = rendezVousRepository.save(rendezVous);
        return toDTO(saved);
    }

    public RendezVousDTO changerStatut(Long id, RendezVous.StatutRendezVous statut) {
        RendezVous rendezVous = rendezVousRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Rendez-vous non trouvé avec l'ID: " + id));
        rendezVous.setStatut(statut);
        RendezVous saved = rendezVousRepository.save(rendezVous);
        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public RendezVousDTO getRendezVousById(Long id) {
        RendezVous rendezVous = rendezVousRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Rendez-vous non trouvé avec l'ID: " + id));
        return toDTO(rendezVous);
    }

    @Transactional(readOnly = true)
    public List<RendezVousDTO> getRendezVousByPatientId(Long patientId) {
        return rendezVousRepository.findByPatientId(patientId).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RendezVousDTO> getRendezVousByMedecinId(Long medecinId) {
        return rendezVousRepository.findByMedecinId(medecinId).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RendezVousDTO> getAllRendezVous() {
        return rendezVousRepository.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RendezVousDTO> getTodayRendezVous() {
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1).minusNanos(1);
        return rendezVousRepository.findByDateHeureBetween(startOfDay, endOfDay).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RendezVousDTO> getUpcomingRendezVous() {
        return rendezVousRepository.findByDateHeureAfterOrderByDateHeureAsc(LocalDateTime.now()).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public void supprimerRendezVous(Long id) {
        RendezVous rendezVous = rendezVousRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Rendez-vous non trouvé avec l'ID: " + id));
        rendezVousRepository.delete(rendezVous);
    }

    private RendezVousDTO toDTO(RendezVous rendezVous) {
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

