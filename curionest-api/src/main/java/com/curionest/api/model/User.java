package com.curionest.api.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "users")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    private String firstName;
    private String lastName;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date joinDate;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastLogin;
    
    private String bio;
    
    private boolean prefersDarkMode = false;
    private boolean emailNotifications = true;
    private boolean reminderNotifications = true;
    private boolean achievementNotifications = true;
    private String reminderTime;
    private boolean dataCollection = true;
    private boolean marketingEmails = false;
    
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Habit> habits;
    
    public User() {
        this.joinDate = new Date();
        this.lastLogin = new Date();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Date getJoinDate() { return joinDate; }
    public void setJoinDate(Date joinDate) { this.joinDate = joinDate; }

    public Date getLastLogin() { return lastLogin; }
    public void setLastLogin(Date lastLogin) { this.lastLogin = lastLogin; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public boolean isPrefersDarkMode() { return prefersDarkMode; }
    public void setPrefersDarkMode(boolean prefersDarkMode) { this.prefersDarkMode = prefersDarkMode; }

    public boolean isEmailNotifications() { return emailNotifications; }
    public void setEmailNotifications(boolean emailNotifications) { this.emailNotifications = emailNotifications; }

    public boolean isReminderNotifications() { return reminderNotifications; }
    public void setReminderNotifications(boolean reminderNotifications) { this.reminderNotifications = reminderNotifications; }

    public boolean isAchievementNotifications() { return achievementNotifications; }
    public void setAchievementNotifications(boolean achievementNotifications) { this.achievementNotifications = achievementNotifications; }

    public String getReminderTime() { return reminderTime; }
    public void setReminderTime(String reminderTime) { this.reminderTime = reminderTime; }

    public boolean isDataCollection() { return dataCollection; }
    public void setDataCollection(boolean dataCollection) { this.dataCollection = dataCollection; }

    public boolean isMarketingEmails() { return marketingEmails; }
    public void setMarketingEmails(boolean marketingEmails) { this.marketingEmails = marketingEmails; }

    public List<Habit> getHabits() { return habits; }
    public void setHabits(List<Habit> habits) { this.habits = habits; }
}
