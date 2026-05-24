package com.curionest.api.service;

import com.curionest.api.model.Habit;
import com.curionest.api.model.HabitLog;
import com.curionest.api.model.User;
import com.curionest.api.repository.HabitLogRepository;
import com.curionest.api.repository.HabitRepository;
import com.curionest.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HabitService {

    private final HabitRepository habitRepository;
    private final HabitLogRepository habitLogRepository;
    private final DynamicResourceService resourceService;
    private final UserRepository userRepository;

    @Autowired
    public HabitService(HabitRepository habitRepository, HabitLogRepository habitLogRepository, 
                        DynamicResourceService resourceService, UserRepository userRepository) {
        this.habitRepository = habitRepository;
        this.habitLogRepository = habitLogRepository;
        this.resourceService = resourceService;
        this.userRepository = userRepository;
    }

    public List<Habit> getHabitsForUser(Long userId) {
        return habitRepository.findByUserIdAndIsActiveTrue(userId);
    }

    public List<HabitLog> getHabitLogsForUser(Long userId) {
        return habitLogRepository.findByHabit_UserId(userId);
    }

    public Habit createHabit(Habit habit) {
        // Fetch the user so Hibernate doesn't throw TransientPropertyValueException
        if (habit.getUser() != null && habit.getUser().getId() != null) {
            User user = userRepository.findById(habit.getUser().getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
            habit.setUser(user);
        }
        return habitRepository.save(habit);
    }

    public HabitLog logHabitCompletion(Long habitId, String notes) {
        Optional<Habit> habitOpt = habitRepository.findById(habitId);
        if (habitOpt.isEmpty()) {
            throw new IllegalArgumentException("Habit not found");
        }
        
        Habit habit = habitOpt.get();
        if (!habit.isCompletedToday()) {
            habit.incrementStreak();
            habitRepository.save(habit);
            
            HabitLog log = new HabitLog(habit, notes);
            return habitLogRepository.save(log);
        }
        return null;
    }

    public String failHabit(Long habitId) {
        Optional<Habit> habitOpt = habitRepository.findById(habitId);
        if (habitOpt.isPresent()) {
            Habit habit = habitOpt.get();
            
            // The Grace Day Mechanic
            if (habit.getGraceDays() > 0) {
                habit.setGraceDays(habit.getGraceDays() - 1);
                habitRepository.save(habit);
                return "GRACE_DAY_USED";
            }
            
            habit.resetStreak();
            habitRepository.save(habit);
            
            resourceService.fetchResourcesForFailedHabit(habit);
            return "STREAK_RESET";
        }
        return "NOT_FOUND";
    }
}
