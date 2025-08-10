import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, Plus } from "lucide-react";
import { Exercise, storage } from "@/lib/storage";
import { ExerciseCard } from "@/components/exercise-card";
import { AddExerciseDialog } from "@/components/add-exercise-dialog";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = () => {
    const allExercises = storage.getAllExercises();
    setExercises(allExercises);
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    navigate(`/exercise/${exercise.id}`);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    storage.deleteExercise(exerciseId);
    loadExercises();
    toast({
      title: "Exercise deleted",
      description: "Exercise and all related records have been removed",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="bg-gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Dumbbell className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Gym Max Tracker</h1>
              <p className="text-white/80 text-lg">Track your personal records and progress</p>
            </div>
          </div>
          <AddExerciseDialog onExerciseAdded={loadExercises} />
        </div>
      </div>

      {/* Exercises Grid */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Your Exercises</h2>
          <p className="text-muted-foreground">
            {exercises.length} exercise{exercises.length !== 1 ? 's' : ''} tracked
          </p>
        </div>

        {exercises.length === 0 ? (
          <div className="text-center py-16">
            <Dumbbell className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">Get Started</h3>
            <p className="text-muted-foreground mb-6">
              Add your first exercise to start tracking your max weights
            </p>
            <AddExerciseDialog onExerciseAdded={loadExercises} />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onSelect={handleExerciseSelect}
                onDelete={exercise.isCustom ? handleDeleteExercise : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
