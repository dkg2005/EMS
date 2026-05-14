package com.example.service;

import com.example.dto.AuthRequestDTO;

import java.util.Map;


public interface AuthService {

    Map<String, Object> signup(AuthRequestDTO request);

    Map<String, Object> login(AuthRequestDTO request);
}
