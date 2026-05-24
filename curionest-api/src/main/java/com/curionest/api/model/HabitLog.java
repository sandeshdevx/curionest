package com.curionest.api.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "habit_logs")
public class HabitLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "habit_id", nullable = false)
    private Habit habit;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date completedDate;

    private String notes;

    public HabitLog() {
        this.completedDate = new Date();
    }

    public HabitLog(Habit habit, String notes) {
        this.habit = habit;
        this.notes = notes;
        this.completedDate = new Date();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Habit getHabit() { return habit; }
    public void setHabit(Habit habit) { this.habit = habit; }

    public Date getCompletedDate() { return completedDate; }
    public void setCompletedDate(Date completedDate) { this.completedDate = completedDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
