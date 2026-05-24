package com.curionest.api.repository;

import com.curionest.api.model.HabitLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HabitLogRepository extends JpaRepository<HabitLog, Long> {
    
    List<HabitLog> findByHabitId(Long habitId);
    
    List<HabitLog> findByHabit_UserId(Long userId);
}
