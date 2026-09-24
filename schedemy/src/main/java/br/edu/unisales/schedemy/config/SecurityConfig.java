package br.edu.unisales.schedemy.config;

import static org.springframework.security.config.Customizer.withDefaults;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public InMemoryUserDetailsManager userDetailsService(PasswordEncoder encoder) {
        UserDetails admin = User.withUsername("admin")
                .password(encoder.encode("admin123"))
                .roles("ADMIN", "COORDENADOR", "RECEPCIONISTA")
                .build();

        UserDetails recepcionista = User.withUsername("recepcionista")
                .password(encoder.encode("recepcionista123"))
                .roles("RECEPCIONISTA")
                .build();

        UserDetails coordenador = User.withUsername("coordenador")
                .password(encoder.encode("coordenador123"))
                .roles("COORDENADOR")
                .build();

        UserDetails professor = User.withUsername("professor")
                .password(encoder.encode("professor123"))
                .roles("PROFESSOR")
                .build();

        UserDetails aluno = User.withUsername("aluno")
                .password(encoder.encode("aluno123"))
                .roles("ALUNO")
                .build();

        return new InMemoryUserDetailsManager(admin, recepcionista, coordenador, professor, aluno);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(withDefaults())
                .authorizeHttpRequests(auth -> auth
                        // Documentacao OpenAPI/Swagger e Health livre
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/actuator/health"
                        ).permitAll()
                        // Console H2 livre
                        .requestMatchers("/h2-console/**").permitAll()
                        // Endpoints da API exigem autenticacao
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().permitAll()
                )
                .httpBasic(withDefaults())
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));

        return http.build();
    }
}