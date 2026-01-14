package com.his.hub.authentication.service;

import com.his.hub.authentication.dao.PasswordResetTokenRepository;
import com.his.hub.authentication.dao.UtilisateurRepository;
import com.his.hub.authentication.dto.*;
import com.his.hub.authentication.entity.PasswordResetToken;
import com.his.hub.authentication.entity.Role;
import com.his.hub.authentication.entity.Utilisateur;
import com.his.hub.authentication.security.JwtTokenProvider;
import com.his.hub.common.exception.BusinessException;
import com.his.hub.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;

    public JwtAuthenticationResponse authenticate(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        Utilisateur utilisateur = utilisateurRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new BusinessException("Utilisateur non trouvé"));

        Set<String> roles = utilisateur.getRoles().stream()
            .map(Role::getNom)
            .collect(Collectors.toSet());

        return new JwtAuthenticationResponse(jwt, "Bearer", utilisateur.getUsername(), roles);
    }

    
    public void changePassword(String username, ChangePasswordRequest request) {
        
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("Le nouveau mot de passe et la confirmation ne correspondent pas");
        }

        Utilisateur utilisateur = utilisateurRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        
        if (!passwordEncoder.matches(request.getCurrentPassword(), utilisateur.getPassword())) {
            throw new BusinessException("Le mot de passe actuel est incorrect");
        }

        
        if (passwordEncoder.matches(request.getNewPassword(), utilisateur.getPassword())) {
            throw new BusinessException("Le nouveau mot de passe doit être différent de l'ancien");
        }

        
        utilisateur.setPassword(passwordEncoder.encode(request.getNewPassword()));
        utilisateurRepository.save(utilisateur);
    }

    
    public String requestPasswordReset(ForgotPasswordRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new ResourceNotFoundException("Aucun compte associé à cet email"));

        
        passwordResetTokenRepository.deleteByUtilisateurId(utilisateur.getId());

        
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUtilisateur(utilisateur);
        resetToken.setDateExpiration(LocalDateTime.now().plusHours(24)); 
        resetToken.setUtilise(false);
        resetToken.setDateCreation(LocalDateTime.now());

        passwordResetTokenRepository.save(resetToken);

        
        return token; 
    }

    
    public void resetPassword(ResetPasswordRequest request) {
        
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("Le nouveau mot de passe et la confirmation ne correspondent pas");
        }

        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
            .orElseThrow(() -> new BusinessException("Token invalide"));

        if (!resetToken.isValid()) {
            throw new BusinessException("Le token a expiré ou a déjà été utilisé");
        }

        Utilisateur utilisateur = resetToken.getUtilisateur();
        utilisateur.setPassword(passwordEncoder.encode(request.getNewPassword()));
        utilisateurRepository.save(utilisateur);

        
        resetToken.setUtilise(true);
        passwordResetTokenRepository.save(resetToken);
    }
}
