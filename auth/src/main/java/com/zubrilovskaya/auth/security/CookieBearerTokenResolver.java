package com.zubrilovskaya.auth.security;

import com.zubrilovskaya.auth.service.CookieService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import java.util.Set;

/**
 * Берёт access-токен из HttpOnly-куки. Если куки нет, пробует заголовок Authorization.
 * На публичных эндпоинтах токен не читается: иначе просроченная кука вызвала бы 401
 * ещё до того, как запрос дойдёт до /auth/refresh.
 */
@Component
public class CookieBearerTokenResolver implements BearerTokenResolver {

    private static final Set<String> PUBLIC = Set.of(PublicPaths.ALL);

    private final DefaultBearerTokenResolver headerResolver = new DefaultBearerTokenResolver();

    @Override
    public String resolve(HttpServletRequest request) {
        if (PUBLIC.contains(request.getRequestURI())) {
            return null;
        }
        Cookie cookie = WebUtils.getCookie(request, CookieService.ACCESS_COOKIE);
        if (cookie != null && !cookie.getValue().isBlank()) {
            return cookie.getValue();
        }
        return headerResolver.resolve(request);
    }
}