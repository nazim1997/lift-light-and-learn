import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Plus, Trash2 } from "lucide-react";
import { Exercise, storage } from "@/lib/storage";

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect: (exercise: Exercise) => void;
  onDelete?: (exerciseId: string) => void;
}

export function ExerciseCard({ exercise, onSelect, onDelete }: ExerciseCardProps) {
  const latestMax = storage.getLatestMaxForExercise(exercise.id);

  return (
    <Card className="p-6 hover:shadow-card transition-all duration-200 hover:scale-[1.02] border-border/50 bg-gradient-to-br from-card to-card/80">
      <div className="flex items-center justify-between">
        <div 
          className="flex-1 cursor-pointer" 
          onClick={() => onSelect(exercise)}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{exercise.name}</h3>
              {latestMax ? (
                <p className="text-sm text-muted-foreground">
                  Max: {latestMax.weight} {latestMax.unit}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">No records yet</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => onSelect(exercise)}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
          </Button>
          {exercise.isCustom && onDelete && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(exercise.id)}
              className="hover:shadow-glow transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}