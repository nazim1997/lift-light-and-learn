import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar, Trash2 } from "lucide-react";
import { Exercise, MaxRecord, storage } from "@/lib/storage";
import { ProgressChart } from "@/components/progress-chart";
import { AddRecordDialog } from "@/components/add-record-dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function ExerciseDetail() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [records, setRecords] = useState<MaxRecord[]>([]);

  useEffect(() => {
    if (!exerciseId) {
      navigate('/');
      return;
    }

    const exercises = storage.getAllExercises();
    const foundExercise = exercises.find(e => e.id === exerciseId);
    
    if (!foundExercise) {
      navigate('/');
      return;
    }

    setExercise(foundExercise);
    loadRecords();
  }, [exerciseId, navigate]);

  const loadRecords = () => {
    if (exerciseId) {
      const exerciseRecords = storage.getRecordsForExercise(exerciseId);
      setRecords(exerciseRecords);
    }
  };

  const handleDeleteRecord = (recordId: string) => {
    storage.deleteRecord(recordId);
    loadRecords();
    toast({
      title: "Record deleted",
      description: "Max weight record has been removed",
    });
  };

  if (!exercise) {
    return null;
  }

  const latestMax = records.length > 0 ? Math.max(...records.map(r => r.weight)) : 0;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{exercise.name}</h1>
            <p className="text-muted-foreground">
              {latestMax > 0 ? `Current Max: ${latestMax} kg` : 'No records yet'}
            </p>
          </div>
        </div>

        {/* Progress Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Progress Chart</h2>
            <AddRecordDialog 
              exerciseId={exercise.id}
              exerciseName={exercise.name}
              onRecordAdded={loadRecords}
            />
          </div>
          <ProgressChart records={records} />
        </Card>

        {/* Records History */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Records</h2>
          {records.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No records yet. Add your first max weight!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {records.slice().reverse().map((record) => (
                <div 
                  key={record.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50"
                >
                  <div>
                    <p className="font-semibold text-lg">
                      {record.weight} {record.unit}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(record.date), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteRecord(record.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}