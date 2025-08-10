import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { storage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface AddExerciseDialogProps {
  onExerciseAdded: () => void;
}

export function AddExerciseDialog({ onExerciseAdded }: AddExerciseDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter an exercise name",
        variant: "destructive",
      });
      return;
    }

    try {
      storage.addExercise(name.trim());
      toast({
        title: "Success",
        description: `${name} added to your exercises`,
      });
      setName("");
      setOpen(false);
      onExerciseAdded();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add exercise",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-accent hover:shadow-glow transition-all duration-200">
          <Plus className="w-4 h-4 mr-2" />
          Add Exercise
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Exercise</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="exercise-name">Exercise Name</Label>
            <Input
              id="exercise-name"
              placeholder="e.g., Incline Bench Press"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-200"
            >
              Add Exercise
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}