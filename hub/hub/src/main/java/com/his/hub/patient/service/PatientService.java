package com.his.hub.patient.service;

import com.his.hub.authentication.dao.RoleRepository;
import com.his.hub.authentication.dao.UtilisateurRepository;
import com.his.hub.authentication.entity.Role;
import com.his.hub.authentication.entity.Utilisateur;
import com.his.hub.common.exception.BusinessException;
import com.his.hub.common.exception.ResourceNotFoundException;
import com.his.hub.patient.dao.PatientRepository;
import com.his.hub.patient.dto.CreatePatientRequest;
import com.his.hub.patient.dto.PatientDTO;
import com.his.hub.patient.entity.Patient;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientService {

    private final PatientRepository patientRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public PatientDTO creerPatient(CreatePatientRequest request) {
        if (request.getNumeroIdentification() != null && 
            patientRepository.existsByNumeroIdentification(request.getNumeroIdentification())) {
            throw new BusinessException("Un patient avec ce numéro d'identification existe déjà");
        }

        Patient patient = new Patient();
        patient.setNom(request.getNom());
        patient.setPrenom(request.getPrenom());
        patient.setDateNaissance(request.getDateNaissance());
        patient.setSexe(request.getSexe());
        patient.setNumeroIdentification(request.getNumeroIdentification());
        patient.setAdresse(request.getAdresse());
        patient.setTelephone(request.getTelephone());
        patient.setEmail(request.getEmail());
        patient.setAntecedentsMedicaux(request.getAntecedentsMedicaux());
        patient.setAllergies(request.getAllergies());
        patient.setActif(true);

        
        if (Boolean.TRUE.equals(request.getCreerCompteUtilisateur())) {
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                throw new BusinessException("Le nom d'utilisateur est requis pour créer un compte");
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                throw new BusinessException("Le mot de passe est requis pour créer un compte");
            }
            if (utilisateurRepository.existsByUsername(request.getUsername())) {
                throw new BusinessException("Le nom d'utilisateur existe déjà");
            }
            if (request.getEmail() != null && utilisateurRepository.existsByEmail(request.getEmail())) {
                throw new BusinessException("L'email existe déjà");
            }

            Utilisateur utilisateur = new Utilisateur();
            utilisateur.setUsername(request.getUsername());
            utilisateur.setPassword(passwordEncoder.encode(request.getPassword()));
            utilisateur.setNom(request.getNom());
            utilisateur.setPrenom(request.getPrenom());
            utilisateur.setEmail(request.getEmail());
            utilisateur.setTelephone(request.getTelephone());
            utilisateur.setActif(true);

            
            Role patientRole = roleRepository.findByNom("PATIENT")
                .orElseThrow(() -> new BusinessException("Le rôle PATIENT n'existe pas"));
            utilisateur.setRoles(Set.of(patientRole));

            Utilisateur savedUtilisateur = utilisateurRepository.save(utilisateur);
            patient.setUtilisateur(savedUtilisateur);
        }

        Patient saved = patientRepository.save(patient);
        return toDTO(saved);
    }

    public PatientDTO modifierPatient(Long id, CreatePatientRequest request) {
        Patient patient = patientRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé avec l'ID: " + id));

        if (request.getNumeroIdentification() != null && 
            !patient.getNumeroIdentification().equals(request.getNumeroIdentification()) &&
            patientRepository.existsByNumeroIdentification(request.getNumeroIdentification())) {
            throw new BusinessException("Un patient avec ce numéro d'identification existe déjà");
        }

        patient.setNom(request.getNom());
        patient.setPrenom(request.getPrenom());
        patient.setDateNaissance(request.getDateNaissance());
        patient.setSexe(request.getSexe());
        patient.setNumeroIdentification(request.getNumeroIdentification());
        patient.setAdresse(request.getAdresse());
        patient.setTelephone(request.getTelephone());
        patient.setEmail(request.getEmail());
        patient.setAntecedentsMedicaux(request.getAntecedentsMedicaux());
        patient.setAllergies(request.getAllergies());

        Patient saved = patientRepository.save(patient);
        return toDTO(saved);
    }

    public void supprimerPatient(Long id) {
        Patient patient = patientRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé avec l'ID: " + id));
        patient.setActif(false);
        patientRepository.save(patient);
    }

    @Transactional(readOnly = true)
    public PatientDTO getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé avec l'ID: " + id));
        return toDTO(patient);
    }

    @Transactional(readOnly = true)
    public List<PatientDTO> getAllPatients() {
        return patientRepository.findByActifTrue().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PatientDTO> rechercherPatients(String recherche) {
        return patientRepository.findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(recherche, recherche)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PatientDTO getPatientByUtilisateurId(Long utilisateurId) {
        Patient patient = patientRepository.findByUtilisateurId(utilisateurId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé pour cet utilisateur"));
        return toDTO(patient);
    }

    
    public PatientDTO updatePatientProfile(Long utilisateurId, com.his.hub.patient.dto.UpdatePatientProfileRequest request) {
        Patient patient = patientRepository.findByUtilisateurId(utilisateurId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé pour cet utilisateur"));

        if (request.getAdresse() != null) {
            patient.setAdresse(request.getAdresse());
        }
        if (request.getTelephone() != null) {
            patient.setTelephone(request.getTelephone());
        }
        if (request.getEmail() != null) {
            patient.setEmail(request.getEmail());
        }

        Patient saved = patientRepository.save(patient);
        return toDTO(saved);
    }

    private PatientDTO toDTO(Patient patient) {
        PatientDTO dto = new PatientDTO();
        dto.setId(patient.getId());
        dto.setNom(patient.getNom());
        dto.setPrenom(patient.getPrenom());
        dto.setDateNaissance(patient.getDateNaissance());
        dto.setSexe(patient.getSexe());
        dto.setNumeroIdentification(patient.getNumeroIdentification());
        dto.setAdresse(patient.getAdresse());
        dto.setTelephone(patient.getTelephone());
        dto.setEmail(patient.getEmail());
        dto.setAntecedentsMedicaux(patient.getAntecedentsMedicaux());
        dto.setAllergies(patient.getAllergies());
        dto.setActif(patient.getActif());
        dto.setDateCreation(patient.getDateCreation());
        dto.setDateModification(patient.getDateModification());
        return dto;
    }
}

