package com.his.hub.authentication.security;

import com.his.hub.authentication.dao.UtilisateurRepository;
import com.his.hub.authentication.entity.Role;
import com.his.hub.authentication.entity.Utilisateur;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Utilisateur utilisateur = utilisateurRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé: " + username));

        if (!utilisateur.getActif()) {
            throw new UsernameNotFoundException("Utilisateur désactivé: " + username);
        }

        return User.builder()
            .username(utilisateur.getUsername())
            .password(utilisateur.getPassword())
            .authorities(getAuthorities(utilisateur.getRoles()))
            .build();
    }

    private Collection<? extends GrantedAuthority> getAuthorities(Collection<Role> roles) {
        return roles.stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getNom()))
            .collect(Collectors.toList());
    }
}

