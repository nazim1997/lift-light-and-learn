import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { storage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface AddRecordDialogProps {
  exerciseId: string;
  exerciseName: string;
  onRecordAdded: () => void;
}

export function AddRecordDialog({ exerciseId, exerciseName, onRecordAdded }: AddRecordDialogProps) {
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const weightNum = parseFloat(weight);
    if (!weightNum || weightNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid weight",
        variant: "destructive",
      });
      return;
    }

    try {
      storage.addRecord(exerciseId, weightNum, date);
      toast({
        title: "Success",
        description: `New max recorded: ${weightNum} kg`,
      });
      setWeight("");
      setDate(new Date().toISOString().split('T')[0]);
      setOpen(false);
      onRecordAdded();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add record",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-200">
          <Plus className="w-4 h-4 mr-2" />
          Add Max Weight
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Max Weight - {exerciseName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.5"
              placeholder="100"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-200"
            >
              Add Record
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