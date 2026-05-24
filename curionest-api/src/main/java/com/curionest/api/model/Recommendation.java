package com.curionest.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "recommendations")
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(nullable = false)
    private String url;
    
    private String category;
    
    private String type; // e.g. "Video", "Article"
    
    @Column(columnDefinition = "TEXT")
    private String description;

    public Recommendation() {
    }

    public Recommendation(String title, String url, String category, String type, String description) {
        this.title = title;
        this.url = url;
        this.category = category;
        this.type = type;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
