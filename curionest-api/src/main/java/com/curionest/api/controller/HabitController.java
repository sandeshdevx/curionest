package com.curionest.api.controller;

import com.curionest.api.model.Habit;
import com.curionest.api.model.HabitLog;
import com.curionest.api.service.HabitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/habits")
@CrossOrigin(origins = "*")
public class HabitController {

    private final HabitService habitService;

    @Autowired
    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Habit>> getUserHabits(@PathVariable Long userId) {
        List<Habit> habits = habitService.getHabitsForUser(userId);
        return new ResponseEntity<>(habits, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}/logs")
    public ResponseEntity<List<HabitLog>> getUserHabitLogs(@PathVariable Long userId) {
        List<HabitLog> logs = habitService.getHabitLogsForUser(userId);
        return new ResponseEntity<>(logs, HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<Habit> createHabit(@RequestBody Habit habit) {
        Habit newHabit = habitService.createHabit(habit);
        return new ResponseEntity<>(newHabit, HttpStatus.CREATED);
    }

    @PostMapping("/{habitId}/complete")
    public ResponseEntity<HabitLog> completeHabit(@PathVariable Long habitId, @RequestBody(required = false) String notes) {
        try {
            HabitLog log = habitService.logHabitCompletion(habitId, notes);
            return new ResponseEntity<>(log, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{habitId}/fail")
    public ResponseEntity<String> failHabit(@PathVariable Long habitId) {
        try {
            String result = habitService.failHabit(habitId);
            if ("GRACE_DAY_USED".equals(result)) {
                return new ResponseEntity<>("Grace Day used! Streak frozen. 🧊", HttpStatus.OK);
            } else if ("STREAK_RESET".equals(result)) {
                return new ResponseEntity<>("Habit streak reset. Fetching recovery resources...", HttpStatus.OK);
            }
            return new ResponseEntity<>("Habit not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
