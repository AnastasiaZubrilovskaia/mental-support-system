package com.zubrilovskaya.auth.security;

public final class PublicPaths {

    public static final String[] ALL = {
            "/auth/register",
            "/auth/login",
            "/auth/refresh",
            "/auth/logout"
    };

    private PublicPaths() {
    }
}
