export interface Exercise {
  id: string;
  name: string;
  isCustom: boolean;
}

export interface MaxRecord {
  id: string;
  exerciseId: string;
  weight: number;
  date: string; // ISO date string
  unit: 'kg' | 'lbs';
}

// Default exercises for MVP
export const DEFAULT_EXERCISES: Exercise[] = [
  { id: '1', name: 'Bench Press', isCustom: false },
  { id: '2', name: 'Squat', isCustom: false },
  { id: '3', name: 'Deadlift', isCustom: false },
  { id: '4', name: 'Overhead Press', isCustom: false },
  { id: '5', name: 'Barbell Row', isCustom: false },
  { id: '6', name: 'Pull-ups', isCustom: false },
  { id: '7', name: 'Dips', isCustom: false },
];

class LocalStorage {
  private getExercises(): Exercise[] {
    const stored = localStorage.getItem('gym-tracker-exercises');
    if (!stored) {
      this.saveExercises(DEFAULT_EXERCISES);
      return DEFAULT_EXERCISES;
    }
    return JSON.parse(stored);
  }

  private saveExercises(exercises: Exercise[]): void {
    localStorage.setItem('gym-tracker-exercises', JSON.stringify(exercises));
  }

  private getRecords(): MaxRecord[] {
    const stored = localStorage.getItem('gym-tracker-records');
    return stored ? JSON.parse(stored) : [];
  }

  private saveRecords(records: MaxRecord[]): void {
    localStorage.setItem('gym-tracker-records', JSON.stringify(records));
  }

  // Exercise methods
  getAllExercises(): Exercise[] {
    return this.getExercises();
  }

  addExercise(name: string): Exercise {
    const exercises = this.getExercises();
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name,
      isCustom: true,
    };
    exercises.push(newExercise);
    this.saveExercises(exercises);
    return newExercise;
  }

  deleteExercise(id: string): void {
    const exercises = this.getExercises().filter(e => e.id !== id);
    this.saveExercises(exercises);
    
    // Also delete related records
    const records = this.getRecords().filter(r => r.exerciseId !== id);
    this.saveRecords(records);
  }

  // Record methods
  getRecordsForExercise(exerciseId: string): MaxRecord[] {
    return this.getRecords()
      .filter(record => record.exerciseId === exerciseId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  addRecord(exerciseId: string, weight: number, date: string, unit: 'kg' | 'lbs' = 'kg'): MaxRecord {
    const records = this.getRecords();
    const newRecord: MaxRecord = {
      id: Date.now().toString(),
      exerciseId,
      weight,
      date,
      unit,
    };
    records.push(newRecord);
    this.saveRecords(records);
    return newRecord;
  }

  deleteRecord(id: string): void {
    const records = this.getRecords().filter(r => r.id !== id);
    this.saveRecords(records);
  }

  getLatestMaxForExercise(exerciseId: string): MaxRecord | null {
    const records = this.getRecordsForExercise(exerciseId);
    if (records.length === 0) return null;
    
    return records.reduce((max, current) => 
      current.weight > max.weight ? current : max
    );
  }
}

export const storage = new LocalStorage();