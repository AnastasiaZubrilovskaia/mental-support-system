package com.zubrilovskaya.auth.exception;

import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException {
    public ApiException(HttpStatus status, String message) {
        super(message);
    }
}
