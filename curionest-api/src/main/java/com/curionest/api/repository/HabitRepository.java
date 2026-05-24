package com.curionest.api.repository;

import com.curionest.api.model.Habit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HabitRepository extends JpaRepository<Habit, Long> {
    
    List<Habit> findByUserId(Long userId);
    
    List<Habit> findByUserIdAndIsActiveTrue(Long userId);
}
