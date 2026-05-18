package com.quizbyte.community;

import com.quizbyte.model.User;

public class AuthorDto {

    private Long id;
    private String username;

    public AuthorDto() {
    }

    public AuthorDto(Long id, String username) {
        this.id = id;
        this.username = username;
    }

    public static AuthorDto from(User user) {
        if (user == null) return null;
        return new AuthorDto(user.getId(), user.getUsername());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
